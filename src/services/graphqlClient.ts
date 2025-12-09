import { GraphQLClient, type RequestDocument } from 'graphql-request';
import { API_CONFIG } from './api.config';

const graphqlClient = new GraphQLClient(
  `${API_CONFIG.GATEWAY_URL}${API_CONFIG.SERVICES.RECOMMENDATION.baseURL}${API_CONFIG.SERVICES.RECOMMENDATION.graphqlPath}`,
  {
    headers: API_CONFIG.DEFAULT_HEADERS,
  }
);

const graphqlRequest = async (query: RequestDocument, variables = {}) => {
  try {
    console.log('[GraphQL] Request:', { query, variables });
    const data = await graphqlClient.request(query, variables);
    console.log('[GraphQL] Response:', data);
    return data;
  } catch (error : Error | any) {
    console.error('[GraphQL] Error:', error);
    throw new Error(error.response?.errors?.[0]?.message || error.message);
  }
};

// GraphQL Fragments - CORRECTED BASED ON YOUR SCHEMA
const IRRIGATION_FIELDS = `
  fragment IrrigationFields on IrrigationRecommendation {
    id
    parcelId
    recommendationDate
    waterAmount
    irrigationFrequency
    optimalTime
    reasoning
    confidenceScore
    weatherFactors {
      temperature
      humidity
      precipitation
    }
  }
`;

const FERTILIZATION_FIELDS = `
  fragment FertilizationFields on FertilizationRecommendation {
    id
    parcelId
    cropId
    recommendationDate
    fertilizerType
    npkRatio
    quantity
    applicationMethod
    reasoning
    growthStage
    soilType
    # applicationFrequency field doesn't exist - removed
  }
`;

const TREATMENT_FIELDS = `
  fragment TreatmentFields on TreatmentRecommendation {
    id
    parcelId
    cropId
    recommendationDate
    treatmentType
    productName
    dosage
    targetPest
    applicationTiming
    reasoning
    weatherConditions
  }
`;

const CROP_PLAN_FIELDS = `
  fragment CropPlanFields on CropPlan {
    id
    parcelId
    recommendedCrop
    recommendedVariety
    plantingDate
    expectedHarvestDate
    expectedYield
    confidenceScore
    reasoning
    soilSuitability
    climateSuitability
    # createdAt field doesn't exist - removed
  }
`;

export const recommendationService = {
  // Irrigation
  getIrrigationRecommendation: async (id: any) => {
    const query = `${IRRIGATION_FIELDS}
      query GetIrrigationRecommendation($id: ID!) {
        irrigationRecommendation(id: $id) { ...IrrigationFields }
      }`;
    const data = await graphqlRequest(query, { id });
    return data.irrigationRecommendation;
  },

  getIrrigationRecommendationsByParcel: async (parcelId: any) => {
    const query = `${IRRIGATION_FIELDS}
      query GetIrrigationRecommendationsByParcel($parcelId: ID!) {
        irrigationRecommendationsByParcel(parcelId: $parcelId) { ...IrrigationFields }
      }`;
    const data = await graphqlRequest(query, { parcelId });
    return data.irrigationRecommendationsByParcel;
  },

  getLatestIrrigationRecommendation: async (parcelId: any) => {
    const query = `${IRRIGATION_FIELDS}
      query GetLatestIrrigationRecommendation($parcelId: ID!) {
        latestIrrigationRecommendation(parcelId: $parcelId) { ...IrrigationFields }
      }`;
    const data = await graphqlRequest(query, { parcelId });
    return data.latestIrrigationRecommendation;
  },

  generateIrrigationRecommendation: async (parcelId: any) => {
    const mutation = `${IRRIGATION_FIELDS}
      mutation GenerateIrrigationRecommendation($parcelId: ID!) {
        generateIrrigationRecommendation(parcelId: $parcelId) { ...IrrigationFields }
      }`;
    const data = await graphqlRequest(mutation, { parcelId });
    return data.generateIrrigationRecommendation;
  },

  // Fertilization
  getFertilizationRecommendation: async (id: any) => {
    const query = `${FERTILIZATION_FIELDS}
      query GetFertilizationRecommendation($id: ID!) {
        fertilizationRecommendation(id: $id) { ...FertilizationFields }
      }`;
    const data = await graphqlRequest(query, { id });
    return data.fertilizationRecommendation;
  },

  getFertilizationRecommendationsByCrop: async (cropId: any) => {
    const query = `${FERTILIZATION_FIELDS}
      query GetFertilizationRecommendationsByCrop($cropId: ID!) {
        fertilizationRecommendationsByCrop(cropId: $cropId) { ...FertilizationFields }
      }`;
    const data = await graphqlRequest(query, { cropId });
    return data.fertilizationRecommendationsByCrop;
  },

  generateFertilizationRecommendation: async (cropId: any) => {
    // Note: Your schema shows generateFertilizationRecommendation only takes cropId
    const mutation = `${FERTILIZATION_FIELDS}
      mutation GenerateFertilizationRecommendation($cropId: ID!) {
        generateFertilizationRecommendation(cropId: $cropId) {
          ...FertilizationFields
        }
      }`;
    const data = await graphqlRequest(mutation, { cropId });
    return data.generateFertilizationRecommendation;
  },

  // Treatment
  getTreatmentRecommendation: async (id: any) => {
    const query = `${TREATMENT_FIELDS}
      query GetTreatmentRecommendation($id: ID!) {
        treatmentRecommendation(id: $id) { ...TreatmentFields }
      }`;
    const data = await graphqlRequest(query, { id });
    return data.treatmentRecommendation;
  },

  getTreatmentRecommendationsByCrop: async (cropId: any) => {
    const query = `${TREATMENT_FIELDS}
      query GetTreatmentRecommendationsByCrop($cropId: ID!) {
        treatmentRecommendationsByCrop(cropId: $cropId) { ...TreatmentFields }
      }`;
    const data = await graphqlRequest(query, { cropId });
    return data.treatmentRecommendationsByCrop;
  },

  getUpcomingTreatments: async (cropId: any) => {
    const query = `${TREATMENT_FIELDS}
      query GetUpcomingTreatments($cropId: ID!) {
        upcomingTreatments(cropId: $cropId) { ...TreatmentFields }
      }`;
    const data = await graphqlRequest(query, { cropId });
    return data.upcomingTreatments;
  },

  generateTreatmentRecommendation: async (cropId: any) => {
    const mutation = `${TREATMENT_FIELDS}
      mutation GenerateTreatmentRecommendation($cropId: ID!) {
        generateTreatmentRecommendation(cropId: $cropId) {
          ...TreatmentFields
        }
      }`;
    const data = await graphqlRequest(mutation, { cropId });
    return data.generateTreatmentRecommendation;
  },

  // Crop Plans
  getCropPlan: async (id: any) => {
    const query = `${CROP_PLAN_FIELDS}
      query GetCropPlan($id: ID!) {
        cropPlan(id: $id) { ...CropPlanFields }
      }`;
    const data = await graphqlRequest(query, { id });
    return data.cropPlan;
  },

  getCropPlansByParcel: async (parcelId: any) => {
    const query = `${CROP_PLAN_FIELDS}
      query GetCropPlansByParcel($parcelId: ID!) {
        cropPlansByParcel(parcelId: $parcelId) { ...CropPlanFields }
      }`;
    const data = await graphqlRequest(query, { parcelId });
    return data.cropPlansByParcel;
  },

  getBestCropPlan: async (parcelId: any) => {
    const query = `${CROP_PLAN_FIELDS}
      query GetBestCropPlan($parcelId: ID!) {
        bestCropPlan(parcelId: $parcelId) { ...CropPlanFields }
      }`;
    const data = await graphqlRequest(query, { parcelId });
    return data.bestCropPlan;
  },

  generateCropPlan: async (parcelId: any) => {
    const mutation = `${CROP_PLAN_FIELDS}
      mutation GenerateCropPlan($parcelId: ID!) {
        generateCropPlan(parcelId: $parcelId) { ...CropPlanFields }
      }`;
    const data = await graphqlRequest(mutation, { parcelId });
    return data.generateCropPlan;
  },

  // Complex query for all recommendations
  getAllRecommendationsForParcel: async (parcelId: any) => {
    const query = `
      query GetAllRecommendationsForParcel($parcelId: ID!) {
        allRecommendationsForParcel(parcelId: $parcelId) {
          __typename
          ... on IrrigationRecommendation {
            id
            parcelId
            recommendationDate
            waterAmount
            irrigationFrequency
            optimalTime
            reasoning
            confidenceScore
          }
          ... on FertilizationRecommendation {
            id
            parcelId
            cropId
            recommendationDate
            fertilizerType
            npkRatio
            quantity
            applicationMethod
            reasoning
          }
          ... on TreatmentRecommendation {
            id
            parcelId
            cropId
            recommendationDate
            treatmentType
            productName
            dosage
            targetPest
            applicationTiming
            reasoning
          }
          ... on CropPlan {
            id
            parcelId
            recommendedCrop
            recommendedVariety
            plantingDate
            expectedHarvestDate
            expectedYield
            confidenceScore
            reasoning
          }
        }
      }`;
    const data = await graphqlRequest(query, { parcelId });
    return data.allRecommendationsForParcel;
  },

  // Delete operations
  deleteIrrigationRecommendation: async (id: any) => {
    const mutation = `
      mutation DeleteIrrigationRecommendation($id: ID!) {
        deleteIrrigationRecommendation(id: $id)
      }`;
    const data = await graphqlRequest(mutation, { id });
    return data.deleteIrrigationRecommendation;
  },

  deleteFertilizationRecommendation: async (id: any) => {
    const mutation = `
      mutation DeleteFertilizationRecommendation($id: ID!) {
        deleteFertilizationRecommendation(id: $id)
      }`;
    const data = await graphqlRequest(mutation, { id });
    return data.deleteFertilizationRecommendation;
  },

  deleteTreatmentRecommendation: async (id: any) => {
    const mutation = `
      mutation DeleteTreatmentRecommendation($id: ID!) {
        deleteTreatmentRecommendation(id: $id)
      }`;
    const data = await graphqlRequest(mutation, { id });
    return data.deleteTreatmentRecommendation;
  },

  deleteCropPlan: async (id: any) => {
    const mutation = `
      mutation DeleteCropPlan($id: ID!) {
        deleteCropPlan(id: $id)
      }`;
    const data = await graphqlRequest(mutation, { id });
    return data.deleteCropPlan;
  }
};

export default graphqlClient;