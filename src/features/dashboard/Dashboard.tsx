
import { useState, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal} from 'react';
import { useAllParcels } from '../../hooks/useParcels';
import { useCurrentWeather } from '../../hooks/useWeather';
import { useLatestIrrigationRecommendation } from '../../hooks/useRecommendations';
import { useActiveAlerts } from '../../hooks/useAlerts'
import {
  MapPin,
  Cloud,
  Droplets,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const [selectedParcelId, setSelectedParcelId] = useState(1);

  // REST API - Fetch all parcels
  const { data: parcels, isLoading: parcelsLoading } = useAllParcels();

  // SOAP API - Fetch weather for selected parcel
  const selectedParcel = parcels?.find((p: { id: null; }) => p.id === selectedParcelId);
  const { data: weather, isLoading: weatherLoading } = useCurrentWeather(
    selectedParcel?.location,
    new Date()
  );

  // GraphQL API - Fetch irrigation recommendation
  const { data: irrigation, isLoading: irrigationLoading } =
    useLatestIrrigationRecommendation(selectedParcelId);

  // gRPC API - Active alerts and streaming
  const { data: activeAlerts,isLoading: alertsLoading } = useActiveAlerts(selectedParcelId);

 return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            🌾 Smart Agriculture Dashboard
          </h1>
          <p className="text-gray-400">
            Integrated Microservices Platform - REST · SOAP · GraphQL · gRPC
          </p>
        </div>

        {/* Protocol Status Indicators */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <ProtocolCard
            protocol="REST"
            status={!parcelsLoading ? 'active' : 'loading'}
            service="Parcel Service"
            color="blue"
          />
          <ProtocolCard
            protocol="SOAP"
            status={!weatherLoading ? 'active' : 'loading'}
            service="Weather Service"
            color="yellow"
          />
          <ProtocolCard
            protocol="GraphQL"
            status={!irrigationLoading ? 'active' : 'loading'}
            service="Recommendations"
            color="purple"
          />
          <ProtocolCard
            protocol="gRPC"
            status={ activeAlerts ? 'active' : 'loading'}
            service="Alert Service"
            color="red"
          />
        </div>

        {/* Parcel Selection */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-100">
            <MapPin className="w-6 h-6 text-blue-400" />
            Select Parcel (REST API)
          </h2>
          {parcelsLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading parcels...
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {parcels?.map((parcel: { id: number | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; location: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; surfaceArea: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; soilType: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                <button
                  key={parcel.id}
                  onClick={() => setSelectedParcelId(parcel.id ?? -1)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedParcelId === parcel.id
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                      : 'border-slate-700 bg-slate-800/50 hover:border-blue-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold text-gray-100">{parcel.name}</div>
                  <div className="text-sm text-gray-400">{parcel.location}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {parcel.surfaceArea} ha · {parcel.soilType}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedParcelId && (
          <>
            {/* Weather Card - SOAP */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-100">
                <Cloud className="w-6 h-6 text-yellow-400" />
                Current Weather (SOAP API)
              </h2>
              {weatherLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching weather data via SOAP...
                </div>
              ) : weather ? (
                <div className="grid grid-cols-4 gap-6">
                  <WeatherStat
                    label="Temperature"
                    value={`${weather.temperatureAvg}°C`}
                    range={`${weather.temperatureMin}°C - ${weather.temperatureMax}°C`}
                  />
                  <WeatherStat
                    label="Humidity"
                    value={`${weather.humidity}%`}
                    icon="💧"
                  />
                  <WeatherStat
                    label="Precipitation"
                    value={`${weather.precipitation} mm`}
                    icon="🌧️"
                  />
                  <WeatherStat
                    label="Wind Speed"
                    value={`${weather.windSpeed} km/h`}
                    icon="💨"
                  />
                </div>
              ) : (
                <p className="text-gray-500">No weather data available</p>
              )}
            </div>

            {/* Irrigation Recommendation - GraphQL */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-100">
                <Droplets className="w-6 h-6 text-purple-400" />
                Irrigation Recommendation (GraphQL API)
              </h2>
              {irrigationLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching recommendation via GraphQL...
                </div>
              ) : irrigation ? (
                <div>
                  <div className="grid grid-cols-3 gap-6 mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Water Amount</div>
                      <div className="text-2xl font-bold text-purple-400">
                        {irrigation.waterAmount} L/m²
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Frequency</div>
                      <div className="text-2xl font-bold text-purple-400">
                        {irrigation.irrigationFrequency}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Optimal Time</div>
                      <div className="text-2xl font-bold text-purple-400">
                        {irrigation.optimalTime}
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <div className="text-sm font-semibold text-purple-300 mb-2">
                      Reasoning:
                    </div>
                    <div className="text-sm text-gray-300">
                      {irrigation.reasoning}
                    </div>
                    <div className="mt-2 text-xs text-purple-400">
                      Confidence: {(irrigation.confidenceScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No irrigation recommendation available</p>
              )}
            </div>

            {/* Active Alerts - gRPC */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-100">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  Active Alerts (gRPC API)
                </h2>
              </div>

              {alertsLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching active alerts via gRPC...
                </div>
              ) : activeAlerts && activeAlerts.length > 0 ? (
                    <div className="space-y-3">
                      {activeAlerts.map((alert: { id: any; title?: string | undefined; message?: string | undefined; alertType?: string | undefined; severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined; acknowledged?: boolean | undefined; }) => (
                        <AlertCard key={alert.id} alert={alert} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No active alerts</p>
                  )}
            </div>
          </>
        )}

        {!selectedParcelId && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300">
              Select a parcel to view integrated data
            </h3>
            <p className="text-gray-500 mt-2">
              Weather, recommendations, and alerts will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};



// ============================================================================
// Helper Components
// ============================================================================

type ProtocolColor = 'blue' | 'yellow' | 'purple' | 'red';
type ProtocolCardProps = {
  protocol: string;
  status: 'active' | 'loading' | 'streaming' | 'error';
  service: string;
  color: ProtocolColor;
};

const ProtocolCard = ({ protocol, status, service, color }: ProtocolCardProps) => {
  const colors: Record<ProtocolColor, string> = {
    blue: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
    yellow: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
    purple: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
    red: 'border-red-500/50 bg-red-500/10 text-red-300'
  };

  const statusColors = {
    active: 'bg-emerald-500 shadow-lg shadow-emerald-500/50',
    loading: 'bg-yellow-500',
    streaming: 'bg-emerald-500 animate-pulse',
    error: 'bg-red-500'
  };

  return (
    <div className={`rounded-lg border-2 p-4 backdrop-blur-sm ${colors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg">{protocol}</span>
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`}></div>
      </div>
      <div className="text-sm opacity-80">{service}</div>
    </div>
  );
};

type WeatherStatProps = {
  label: string;
  value: string;
  range?: string;
  icon?: React.ReactNode;
};

const WeatherStat = ({ label, value, range, icon }: WeatherStatProps) => (
  <div>
    <div className="text-sm text-gray-400 mb-1">{label}</div>
    <div className="text-3xl font-bold text-gray-100 mb-1">
      {icon && <span className="mr-2">{icon}</span>}
      {value}
    </div>
    {range && <div className="text-xs text-gray-500">{range}</div>}
  </div>
);

type Alert = {
  id: string;
  title?: string;
  message?: string;
  alertType?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  acknowledged?: boolean;
};

const AlertCard = ({ alert }: { alert: Alert }) => {
  const severityColors = {
    LOW: 'bg-blue-500/10 border-blue-500/50 text-blue-300',
    MEDIUM: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-300',
    HIGH: 'bg-orange-500/10 border-orange-500/50 text-orange-300',
    CRITICAL: 'bg-red-500/10 border-red-500/50 text-red-300'
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        severityColors[alert.severity || 'MEDIUM']
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-bold mb-1 text-xl">{alert.title}</div>
          <div className="text-sm mb-2 text-gray-300"><b className='font-semibold'>Message : </b>{alert.message}</div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span><b className='font-semibold'>Type : </b>{alert.alertType}</span>
            <span><b className='font-semibold'>Severity : </b>{alert.severity}</span>
            {alert.acknowledged && (
              <span className="text-emerald-400 flex-grow text-end">✓ Acknowledged</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;