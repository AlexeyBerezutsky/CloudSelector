import { getDistancesForRegionsWith, getMatrixOfSortedProviders, getProvidersToSortedRegionsMap, getRegionDistanceMatrix, ProviderTuple } from "../reducers/distanceMatrix";
import { ProviderToRegionMatrix } from "../reducers/providerToRegionMatrix";
import { Coordinates } from "../tools/geoWrappers";
import { CalcType } from "../types/apps";
import { populateValue, expectArrayEquivalence, shuffle } from "./tools";

describe('getDistancesForRegionsWith - convert region to distance based on calc method', () => {
    const value = {
        cloud_description: 'cloud_description',
        cloud_name: 'test-cloud-name',
        geo_latitude: 0,
        geo_longitude: 0,
        geo_region: 'geo_region',
    };

    const calcMethod = (field: Coordinates[]) => field.length;

    const methodToTest = getDistancesForRegionsWith(calcMethod);

    test('accept empty value', () => {
        const result = methodToTest({})

        expect(result.length).toBe(0);
    });

    test('accept single value for one region', () => {
        const groups = { geo_region: [value] };
        const result = methodToTest(groups);

        expect(result.length).toBe(1);
        const [region, distance] = result[0];
        expect(region).toBe('geo_region');
        expect(distance).toBe(1);
    });

    test('accept multiple values for single region', () => {
        const clouds = populateValue(value, 10);
        const groups = { geo_region: clouds };
        const result = methodToTest(groups);

        expect(result.length).toBe(1);
        const [region, distance] = result[0];
        expect(region).toBe('geo_region');
        expect(distance).toBe(10);
    });

    test('do not depend on clouds order', () => {
        const clouds = populateValue(value, 10);
        const resultStrait = methodToTest({ geo_region: clouds });
        expect(resultStrait.length).toBe(1);

        const cloudsReverse = clouds.reverse();
        const resultReverse = methodToTest({ geo_region: cloudsReverse });
        expect(resultReverse.length).toBe(1);

        const [regionStrait, distanceStrait] = resultStrait[0];
        const [regionReverse, distanceReverse] = resultStrait[0];

        expect(regionStrait).toBe(regionReverse);
        expect(distanceStrait).toBe(distanceReverse);
    });

    test('accept same value for multiple region', () => {
        const groups = { a: [value], b: [value], c: [value] };
        const result = methodToTest(groups);

        expect(result.length).toBe(3);
        expect(result[0][0]).toBe('a');
        expect(result[1][0]).toBe('b');
        expect(result[2][0]).toBe('c');
    });

    test('do not change order of regions', () => {
        const groups = { c: [value], b: [value], a: [value] };
        const result = methodToTest(groups);

        expect(result[0][0]).toBe('c');
        expect(result[1][0]).toBe('b');
        expect(result[2][0]).toBe('a');
    });

    test('accept multiple value for multiple region', () => {
        const groups = {
            a: populateValue(value, 9),
            b: populateValue(value, 1),
            c: populateValue(value, 5)
        };

        const result = methodToTest(groups);
        expect(result.length).toBe(3);

        expect(result[0][1]).toBe(9);
        expect(result[1][1]).toBe(1);
        expect(result[2][1]).toBe(5);
    });
});

describe('getProvidersToSortedRegionsMap - sort regions by distance for provider', () => {
    const value = {
        cloud_description: 'cloud_description',
        cloud_name: 'test-cloud-name',
        geo_latitude: 0,
        geo_longitude: 0,
        geo_region: 'geo_region',
    };

    const calcMethod = (field: Coordinates[]) => field.length;
    const mapMethod = getDistancesForRegionsWith(calcMethod);
    const methodToTest = getProvidersToSortedRegionsMap(mapMethod);

    test('accept empty value', () => {
        const result = methodToTest({})

        expect(result.length).toBe(0);
    });

    test('single provider, single region, single cloud', () => {
        const matrix = { 'provider': { 'region': [value] } }
        const result = methodToTest(matrix);

        expect(result.length).toBe(1);
        expect(result[0][0]).toBe('provider');
        expect(result[0][1].get('region')).toBe(1);
    });

    test('expect sorted regions for: single provider, multiple region, multiple cloud', () => {
        const matrix = {
            'provider':
            {
                'region10': populateValue(value, 10),
                'region1': populateValue(value, 1),
                'region2': populateValue(value, 2)
            }
        }

        const result = methodToTest(matrix);

        expect(result.length).toBe(1);
        expect(result[0][0]).toBe('provider');
        const resultRegions = Array.from(result[0][1]);
        expect(resultRegions[0][0]).toBe('region1');
        expect(resultRegions[1][0]).toBe('region2');
        expect(resultRegions[2][0]).toBe('region10');
    });

    test('expect output order for: single provider, multiple region, multiple cloud', () => {
        const matrix = {
            'provider':
            {
                'region10': populateValue(value, 10),
                'region1': populateValue(value, 1),
                'region2': populateValue(value, 2),
                'region4': populateValue(value, 4)
            }
        };

        const result = methodToTest(matrix);

        const matrixShuffle = {
            'provider':
            {
                'region4': populateValue(value, 4),
                'region10': populateValue(value, 10),
                'region2': populateValue(value, 2),
                'region1': populateValue(value, 1)
            }
        };

        const resultShuffle = methodToTest(matrixShuffle);

        const resultRegions = Array.from(result[0][1]);
        const resultRegionsShuffle = Array.from(resultShuffle[0][1]);
        expect(resultRegions[0][0]).toBe(resultRegionsShuffle[0][0]);
        expect(resultRegions[1][0]).toBe(resultRegionsShuffle[1][0]);
        expect(resultRegions[2][0]).toBe(resultRegionsShuffle[2][0]);
    });

    test('expect sorted regions for: multiple provider, multiple region, multiple cloud', () => {
        const matrix = {
            'provider3':
            {
                'region10': populateValue(value, 10),
                'region1': populateValue(value, 1),
                'region2': populateValue(value, 2)
            },
            'provider2':
            {
                'region4': populateValue(value, 4),
                'region1': populateValue(value, 1),
            },
            'provider1':
            {
                'region5': populateValue(value, 5),
                'region6': populateValue(value, 6),
            }
        };

        const result = methodToTest(matrix);

        expect(result.length).toBe(3);
        expectArrayEquivalence<string>(result.map(([name]) => name), ['provider1', 'provider2', 'provider3']);

        let resultRegions = Array.from(result[0][1]);
        expect(resultRegions[0][0]).toBe('region1');
        expect(resultRegions[1][0]).toBe('region2');
        expect(resultRegions[2][0]).toBe('region10');

        resultRegions = Array.from(result[1][1]);
        expect(resultRegions[0][0]).toBe('region1');
        expect(resultRegions[1][0]).toBe('region4');

        resultRegions = Array.from(result[2][1]);
        expect(resultRegions[0][0]).toBe('region5');
        expect(resultRegions[1][0]).toBe('region6');
    });
});

describe('getMatrixOfSortedProviders - sort providers by first sorted region', () => {
    const value = {
        cloud_description: 'cloud_description',
        cloud_name: 'test-cloud-name',
        geo_latitude: 0,
        geo_longitude: 0,
        geo_region: 'geo_region',
    };

    const mapMethod = (output: ProviderTuple[]) => (matrix: ProviderToRegionMatrix) => {
        return output;
    };

    test('accept empty value', () => {
        const providers: ProviderTuple[] = [];
        const result = getMatrixOfSortedProviders(mapMethod(providers))({});

        expect(result).toMatchObject(new Map());
    });

    test('Sort providers by first region', () => {
        const providers: ProviderTuple[] = [
            ['provider2', new Map<string, number>([['region10', 20], ['region2', 1]])],
            ['provider3', new Map<string, number>([['region20', 30], ['region2', 0]])],
            ['provider1', new Map<string, number>([['region30', 10], ['region2', 5]])],
        ];
        const result = getMatrixOfSortedProviders(mapMethod(providers))({});

        expect(result.size).toBe(3);
        const providerNames = Array.from(result).map(([name]) => name);

        expect(providerNames).toStrictEqual(['provider1', 'provider2', 'provider3']);
    });

    test('do not depend on initial order', () => {
        const providers: ProviderTuple[] = [
            ['provider2', new Map<string, number>([['region10', 20], ['region2', 1]])],
            ['provider3', new Map<string, number>([['region20', 30], ['region2', 0]])],
            ['provider1', new Map<string, number>([['region30', 10], ['region2', 5]])],
        ];

        const result = getMatrixOfSortedProviders(mapMethod(providers))({});

        const providersShuffle: ProviderTuple[] = shuffle(providers);

        const resultShuffle = getMatrixOfSortedProviders(mapMethod(providersShuffle))({});

        const providerNames = Array.from(result).map(([name]) => name);
        const providerNamesShuffle = Array.from(resultShuffle).map(([name]) => name);

        expect(providerNames).toStrictEqual(providerNamesShuffle);
    });
});

describe('getRegionDistanceMatrix - keeps order of providers and regions and distances to resions', () => {
    const value = {
        cloud_description: 'cloud_description',
        cloud_name: 'test-cloud-name',
        geo_latitude: 0,
        geo_longitude: 0,
        geo_region: 'geo_region',
    };

    const coordinates: Coordinates = {
        latitude: 1,
        longitude: 1
    }

    const calcType: CalcType = 'Center'

    test('accept empty value', () => {
        const result = getRegionDistanceMatrix({}, coordinates, calcType);

        expect(result).toMatchObject(new Map());
    });

    test('multiple provider, multiple region, multiple cloud', () => {
        const matrix: ProviderToRegionMatrix = {
            'provider1': {
                'region1': [{ ...value, geo_latitude: 10, geo_longitude: 20 }, { ...value, geo_latitude: 30, geo_longitude: 40 }, { ...value, geo_latitude: 50, geo_longitude: 60 }, { ...value, geo_latitude: 70, geo_longitude: 80 }],
                'region2': [{ ...value, geo_latitude: 40, geo_longitude: 50 }, { ...value, geo_latitude: 60, geo_longitude: 70 }, { ...value, geo_latitude: 0, geo_longitude: 0 }]
            },

            'provider2': {
                'region1': [{ ...value, geo_latitude: 1, geo_longitude: 2 }, { ...value, geo_latitude: 3, geo_longitude: 4 }, { ...value, geo_latitude: 5, geo_longitude: 6 }],
                'region2': [{ ...value, geo_latitude: 4, geo_longitude: 5 }, { ...value, geo_latitude: 6, geo_longitude: 7 }, { ...value, geo_latitude: 0, geo_longitude: 0 }]
            }
        };

        const result = getRegionDistanceMatrix(matrix, coordinates, calcType);

        const providers = Array.from(result).map(([name]) => name);

        expect(providers).toStrictEqual(['provider2', 'provider1']);
    });

    test('do not depend on order for multiple provider, multiple region, multiple cloud', () => {
        const matrix: ProviderToRegionMatrix = {
            'provider1': {
                'region1': [{ ...value, geo_latitude: 10, geo_longitude: 20 }, { ...value, geo_latitude: 30, geo_longitude: 40 }, { ...value, geo_latitude: 50, geo_longitude: 60 }, { ...value, geo_latitude: 70, geo_longitude: 80 }],
                'region2': [{ ...value, geo_latitude: 40, geo_longitude: 50 }, { ...value, geo_latitude: 60, geo_longitude: 70 }, { ...value, geo_latitude: 0, geo_longitude: 0 }]
            },

            'provider2': {
                'region1': [{ ...value, geo_latitude: 1, geo_longitude: 2 }, { ...value, geo_latitude: 3, geo_longitude: 4 }, { ...value, geo_latitude: 5, geo_longitude: 6 }],
                'region2': [{ ...value, geo_latitude: 4, geo_longitude: 5 }, { ...value, geo_latitude: 6, geo_longitude: 7 }, { ...value, geo_latitude: 0, geo_longitude: 0 }]
            }
        };

        const result = getRegionDistanceMatrix(matrix, coordinates, calcType);

        const matrixShuffle: ProviderToRegionMatrix = {
            'provider2': {
                'region1': [{ ...value, geo_latitude: 1, geo_longitude: 2 }, { ...value, geo_latitude: 3, geo_longitude: 4 }, { ...value, geo_latitude: 5, geo_longitude: 6 }],
                'region2': [{ ...value, geo_latitude: 4, geo_longitude: 5 }, { ...value, geo_latitude: 6, geo_longitude: 7 }, { ...value, geo_latitude: 0, geo_longitude: 0 }]
            },

            'provider1': {
                'region1': [{ ...value, geo_latitude: 10, geo_longitude: 20 }, { ...value, geo_latitude: 30, geo_longitude: 40 }, { ...value, geo_latitude: 50, geo_longitude: 60 }, { ...value, geo_latitude: 70, geo_longitude: 80 }],
                'region2': [{ ...value, geo_latitude: 40, geo_longitude: 50 }, { ...value, geo_latitude: 60, geo_longitude: 70 }, { ...value, geo_latitude: 0, geo_longitude: 0 }]
            },
        };

        const resultShuffle = getRegionDistanceMatrix(matrixShuffle, coordinates, calcType);

        const providers = Array.from(result).map(([name]) => name);
        const providersShuffle = Array.from(resultShuffle).map(([name]) => name);

        expect(providers).toStrictEqual(providersShuffle);
    });
});