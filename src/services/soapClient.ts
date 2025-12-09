import axios from 'axios';
import { API_CONFIG } from './api.config';

const parseXMLResponse = (xmlString : string) => {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'text/xml');
};

const buildSoapEnvelope = (operation: string, params: Record<string,string>) => {
  const namespace = 'http://smartagri.com/weather';
  const prefix = 'wea';

  let bodyContent = `<${prefix}:${operation}>`;
  Object.entries(params).forEach(([key, value]) => {
    bodyContent += `<${prefix}:${key}>${value}</${prefix}:${key}>`;
  });
  bodyContent += `</${prefix}:${operation}>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
          <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:${prefix}="${namespace}">
            <soap:Body>
              ${bodyContent}
            </soap:Body>
          </soap:Envelope>`;
};

const soapClient = axios.create({
  baseURL: `${API_CONFIG.GATEWAY_URL}${API_CONFIG.SERVICES.WEATHER.baseURL}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'text/xml',
    'accept': 'text/xml'
  }
});

const soapRequest = async (operation : string, params : Record<string,string>) => {
  try {
    const envelope = buildSoapEnvelope(operation, params);
    console.log(`[SOAP] Request ${operation}:`, envelope);
    const response = await soapClient.post('/ws', envelope);
    const xmlDoc = parseXMLResponse(response.data);
    console.log(`[SOAP] Response ${operation}:`, xmlDoc);
    return xmlDoc;
  } catch (error: Error | any) {
    console.error(`[SOAP] Error in ${operation}:`, error);
    throw new Error(`SOAP request failed: ${error.message}`);
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getNamespacePrefix = (xmlDoc: Document, namespaceURI: string) => {
  const allElements = xmlDoc.getElementsByTagName('*'); 
  for (let i = 0; i < allElements.length; i++) {
    const elem = allElements[i];
    if (elem.namespaceURI === namespaceURI) {
      return elem.prefix;
    }
  }
  return null;
};

export const parseWeatherInfo = (xmlDoc: Document) => {

  const response = xmlDoc.getElementsByTagNameNS(
    "http://smartagri.com/weather",
    "getWeatherResponse"
  )[0];

  const namespacePrefix = getNamespacePrefix(xmlDoc, "http://smartagri.com/weather"); 

  if (!response) {
    console.warn("No getWeatherResponse found in SOAP XML");
    return null;
  }
    

  const info = response.getElementsByTagName(`${namespacePrefix}:weatherInfo`)[0];
  
  if (!info) {
    console.warn("No weatherInfo node found");
    return null;
  }

  const getValue = (tag: string) =>
    info.getElementsByTagName(tag)[0]?.textContent || null;

  return {
    location: getValue("location"),
    date: getValue("date"),
    temperatureMin: parseFloat(getValue("temperatureMin") || "0"),
    temperatureMax: parseFloat(getValue("temperatureMax") || "0"),
    temperatureAvg: parseFloat(getValue("temperatureAvg") || "0"),
    humidity: parseFloat(getValue("humidity") || "0"),
    precipitation: parseFloat(getValue("precipitation") || "0"),
    windSpeed: parseFloat(getValue("windSpeed") || "0"),
    pressure: parseFloat(getValue("pressure") || "0"),
    weatherCondition: getValue("weatherCondition"),
    cloudCover: parseInt(getValue("cloudCover") || "0", 10)
  };
};



export const parseHistoricalWeather = (xmlDoc: Document) => {
  const namespace = "http://smartagri.com/weather";
  const response = xmlDoc.getElementsByTagNameNS(
    namespace,
    "getHistoricalWeatherResponse"
  )[0];

  if (!response) {
    console.warn("No getHistoricalWeatherResponse found in SOAP XML");
    return [];
  }

  const infoList = response.getElementsByTagNameNS(
    namespace,
    "weatherInfoList"
  );

  const results: any[] = [];

  for (let i = 0; i < infoList.length; i++) {
    const info = infoList[i];
    const getValue = (tag: string) =>
      info.getElementsByTagName(tag)[0]?.textContent || null;

    results.push({
      location: getValue("location"),
      date: getValue("date"),
      temperatureMin: parseFloat(getValue("temperatureMin") || "0"),
      temperatureMax: parseFloat(getValue("temperatureMax") || "0"),
      temperatureAvg: parseFloat(getValue("temperatureAvg") || "0"),
      humidity: parseFloat(getValue("humidity") || "0"),
      precipitation: parseFloat(getValue("precipitation") || "0"),
      windSpeed: parseFloat(getValue("windSpeed") || "0"),
      pressure: parseFloat(getValue("pressure") || "0"),
      weatherCondition: getValue("weatherCondition"),
      cloudCover: parseInt(getValue("cloudCover") || "0", 10)
    });
  }

  return results;
};


export const parseClimateIndex = (xmlDoc: Document) => {
  const namespace = "http://smartagri.com/weather";

  const response = xmlDoc.getElementsByTagNameNS(
    namespace,
    "getClimateIndexResponse"
  )[0];

  if (!response) {
    console.warn("No getClimateIndexResponse found in SOAP XML");
    return null;
  }

  const getValue = (tag: string) =>
    response.getElementsByTagName(tag)[0]?.textContent || null;

  return {
    location: getValue("location"),
    date: getValue("date") || null,
    growingDegreeDays: parseFloat(getValue("growingDegreeDays") || "0"),
    evapotranspiration: parseFloat(getValue("evapotranspiration") || "0"),
    droughtIndex: parseFloat(getValue("droughtIndex") || "0"),
    heatStressIndex: parseFloat(getValue("heatStressIndex") || "0")
  };
};


// ============================================================================
// WEATHER SERVICE METHODS
// ============================================================================

export const weatherService = {
  getWeather: async (location: string, date: string) => {
    const xmlDoc = await soapRequest('getWeatherRequest', { location, date });
    const parsedWeather = parseWeatherInfo(xmlDoc);
    console.log('Parsed Weather:', parsedWeather);
    return parsedWeather;
  },

  getHistoricalWeather: async (location: any, startDate: any, endDate: any) => {
    const xmlDoc = await soapRequest('getHistoricalWeatherRequest', {
      location,
      startDate,
      endDate
    });
    return parseHistoricalWeather(xmlDoc);
  },

  compareWeather: async (location1: any, location2: any, date: any) => {
    const xmlDoc = await soapRequest('compareWeatherRequest', {
      location1,
      location2,
      date
    });
    
    const comparison = xmlDoc.getElementsByTagName('ns2:comparison')[0]?.textContent;
    
    return {
      location1Weather: parseWeatherInfo(xmlDoc),
      location2Weather: parseWeatherInfo(xmlDoc),
      comparison
    };
  },

  getClimateIndex: async (location: any, date: any) => {
    const xmlDoc = await soapRequest('getClimateIndexRequest', { location, date });
    return parseClimateIndex(xmlDoc);
  }
};

export default soapClient;