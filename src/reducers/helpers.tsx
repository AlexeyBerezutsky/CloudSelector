import { Cloud } from "../types/apps";
import { DistancesMatrix } from "./distanceMatrix";

export const getProviderName = (cloudName: string) => cloudName.split('-')[0];

export const filterCloudsByProvider = (providerName: string, clouds: Cloud[]) => clouds.filter((cloud) => (getProviderName(cloud.cloud_name) === providerName));

export const extractProviders = (matrix: DistancesMatrix) => {
    return Array.from(matrix).map(([name]) => name);
};

export const extractRegions = (matrix: DistancesMatrix, providerName: string) => {
    const regions = matrix.get(providerName);

    if (!regions) {
        throw new Error(`There is no regions for ${providerName}`);
    }

    return Array.from(regions).map(([name]) => name);
};
