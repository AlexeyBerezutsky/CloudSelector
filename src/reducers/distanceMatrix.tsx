import { Coordinates, distanceToCenter, distanceToNearest } from "../tools/geoWrappers";
import { CalcType, Cloud } from "../types/apps";
import { ProviderToRegionMatrix } from "./providerToRegionMatrix";

export type DistancesMatrix = Map<string, Map<string, number>>;
export type RegionToCloudsGroups = { [name: string]: Cloud[] };
export type ProviderTuple = [string, Map<string, number>]
type RegionTuple = [string, number];

const sortByDistance = ([, distanceLeft]: RegionTuple, [, distanceRight]: RegionTuple) => (distanceLeft - distanceRight);
const sortByRegionDistance = ([, regionsLeft]: ProviderTuple, [, regionsRight]: ProviderTuple) => {
    const leftRegionDistance = regionsLeft.values().next().value;
    const rightRegionDistance = regionsRight.values().next().value;
    return leftRegionDistance - rightRegionDistance;
}

const getCalcMethod = (calcType: CalcType, coordinates: Coordinates) => calcType === "Center" ? distanceToCenter(coordinates) : distanceToNearest(coordinates)

export const getDistancesForRegionsWith = (calculateDistance: (field: Coordinates[]) => number) => (regions: RegionToCloudsGroups): RegionTuple[] => {
    const regionsAsEntries = Object.entries(regions);

    const regionToDistanceEntries: [string, number][] = regionsAsEntries.map(([regionName, clouds]) => {
        const regionCloudsCoordinates = clouds.map((cloud) => ({ longitude: cloud.geo_longitude, latitude: cloud.geo_latitude }));

        const distance = calculateDistance(regionCloudsCoordinates);

        return [regionName, distance];
    });

    return regionToDistanceEntries;
}

export const getProvidersToSortedRegionsMap = (calculateRegionsMap: (regions: RegionToCloudsGroups) => RegionTuple[]) => (matrix: ProviderToRegionMatrix) => {
    const providerEntries = Object.entries(matrix);

    return providerEntries.map(([providerName, regions]): [string, Map<string, number>] => {
        const regionToDistance = calculateRegionsMap(regions);
        const regionToDistanceSorted = regionToDistance.sort(sortByDistance);
        const regionsMap = new Map<string, number>(regionToDistanceSorted);
        return [providerName, regionsMap]
    });
}

export const getMatrixOfSortedProviders = (calculateProvidersMap: (matrix: ProviderToRegionMatrix) => ProviderTuple[]) => (matrix: ProviderToRegionMatrix) => {
    const providerEntries = calculateProvidersMap(matrix);

    const providerEntriesSorted = providerEntries.sort(sortByRegionDistance)

    return new Map(providerEntriesSorted);
}

export const getRegionDistanceMatrix = (matrix: ProviderToRegionMatrix, coordinates: Coordinates, calcType: CalcType): DistancesMatrix => {
    //TODO: Pipe it?
    const calcMethod = getCalcMethod(calcType, coordinates);
    const getDistancesForRegions = getDistancesForRegionsWith(calcMethod);
    const getProviders = getProvidersToSortedRegionsMap(getDistancesForRegions);
    const distanceMatrix = getMatrixOfSortedProviders(getProviders)(matrix)

    return distanceMatrix;
}