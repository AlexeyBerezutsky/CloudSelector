import { getLatitude, getLongitude } from "geolib";
import { groupCoordinatesByRegions, calculateRegionCenters, RegionToDistanceGroups, getRegionsCenters, getProvidersToRegionMatrix } from "../reducers/providerToRegionMatrix";
import { Coordinates } from "../tools/geoWrappers";
import { Cloud } from "../types/apps";
import { populateValue, expectArrayEquivalence } from "./tools";

describe('groupCoordinatesByRegions - group clouds by geo_region property', () => {
    const value = {
        cloud_description: 'cloud_description',
        cloud_name: 'test-cloud-name',
        geo_latitude: 0,
        geo_longitude: 0,
        geo_region: 'geo_region',
    };

    test('accept empty array', () => {
        const result = groupCoordinatesByRegions([]);

        expect(result).toMatchObject({});
    });

    test('extract silngle region', () => {
        const clouds: Cloud[] = populateValue(value, 5)
            .map((item, ix) => ({ ...item, geo_latitude: ix, geo_longitude: ix * 2 }));

        const result = groupCoordinatesByRegions(clouds);

        expect(Object.keys(result).length).toBe(1);
        expect(Object.keys(result)[0]).toBe('geo_region');
        expect(result['geo_region'].length).toBe(5);

        const expected: Coordinates[] = [
            { latitude: 0, longitude: 0 },
            { latitude: 1, longitude: 2 },
            { latitude: 2, longitude: 4 },
            { latitude: 3, longitude: 6 },
            { latitude: 4, longitude: 8 },
        ];
        expectArrayEquivalence<Coordinates>(result['geo_region'], expected);
    });

    test('extract several regions', () => {
        const clouds: Cloud[] = populateValue(value, 10);

        clouds[0] = { ...clouds[0], geo_region: '1', geo_latitude: 1, geo_longitude: 1 };
        clouds[9] = { ...clouds[9], geo_region: '1', geo_latitude: 1, geo_longitude: 1 };

        clouds[4] = { ...clouds[4], geo_region: '2', geo_latitude: 2, geo_longitude: 2 };
        clouds[7] = { ...clouds[7], geo_region: '2', geo_latitude: 2, geo_longitude: 2 };
        clouds[8] = { ...clouds[8], geo_region: '2', geo_latitude: 2, geo_longitude: 2 };

        const result = groupCoordinatesByRegions(clouds);

        expect(Object.keys(result).length).toBe(3);
        expect(Object.keys(result)).toContain('1');
        expect(Object.keys(result)).toContain('2');
        expect(Object.keys(result)).toContain('geo_region');

        expect(result['1'].length).toBe(2);
        expect(result['2'].length).toBe(3);
        expect(result['geo_region'].length).toBe(5);

        expectArrayEquivalence<Coordinates>(result['1'], [{ latitude: 1, longitude: 1 }]);
        expectArrayEquivalence<Coordinates>(result['2'], [{ latitude: 2, longitude: 2 }]);
        expectArrayEquivalence<Coordinates>(result['geo_region'], [{ latitude: 0, longitude: 0 }]);
    });
});

describe('calculateRegionCenters - calculate geodata for centers of regions', () => {
    const value = {
        cloud_description: 'cloud_description',
        cloud_name: 'test-cloud-name',
        geo_latitude: 0,
        geo_longitude: 0,
        geo_region: 'geo_region',
    };

    test('accept empty array', () => {
        const result = calculateRegionCenters({});

        expect(result.length).toBe(0);
    });

    test('accept single point', () => {
        const data: RegionToDistanceGroups = {
            geodata: [{ latitude: 1, longitude: 1 }]
        }

        const result = calculateRegionCenters(data);

        expect(result.length).toBe(1);
        expect(result[0].name).toBe('geodata');
        expect(getLatitude(result[0].coordinates)).toBeCloseTo(1);
        expect(getLongitude(result[0].coordinates)).toBeCloseTo(1);
    });

    test('accept multiple points', () => {
        const data: RegionToDistanceGroups = {
            geodata: [{ latitude: 1, longitude: 2 }, { latitude: 3, longitude: 4 }, { latitude: 5, longitude: 6 }]
        }

        const result = calculateRegionCenters(data);

        expect(result.length).toBe(1);
        expect(result[0].name).toBe('geodata');
        expect(getLatitude(result[0].coordinates)).toBeCloseTo(3);
        expect(getLongitude(result[0].coordinates)).toBeCloseTo(4);
    });

    test('accept multiple points', () => {
        const data: RegionToDistanceGroups = {
            geodata: [{ latitude: 1, longitude: 2 }, { latitude: 3, longitude: 4 }, { latitude: 5, longitude: 6 }]
        }

        const result = calculateRegionCenters(data);

        expect(result.length).toBe(1);
        expect(result[0].name).toBe('geodata');
        expect(getLatitude(result[0].coordinates)).toBeCloseTo(3);
        expect(getLongitude(result[0].coordinates)).toBeCloseTo(4);
    });

    test('do not depend on points order (points order chhanged)', () => {
        const data: RegionToDistanceGroups = {
            geodata: [{ latitude: 3, longitude: 4 }, { latitude: 1, longitude: 2 }, { latitude: 5, longitude: 6 }]
        }

        const result = calculateRegionCenters(data);

        expect(result.length).toBe(1);
        expect(result[0].name).toBe('geodata');
        expect(getLatitude(result[0].coordinates)).toBeCloseTo(3);
        expect(getLongitude(result[0].coordinates)).toBeCloseTo(4);
    });

    test('accept multiple regions', () => {
        const data: RegionToDistanceGroups = {
            geodata: [{ latitude: 3, longitude: 4 }, { latitude: 1, longitude: 2 }, { latitude: 5, longitude: 6 }],
            otherGeoData: [{ latitude: 9, longitude: 10 }, { latitude: 11, longitude: 12 }, { latitude: 13, longitude: 14 }]
        }

        const result = calculateRegionCenters(data);

        expect(result.length).toBe(2);
        expect(result[0].name).toBe('geodata');
        expect(getLatitude(result[0].coordinates)).toBeCloseTo(3);
        expect(getLongitude(result[0].coordinates)).toBeCloseTo(4);
        expect(result[1].name).toBe('otherGeoData');
        expect(getLatitude(result[1].coordinates)).toBeCloseTo(11);
        expect(getLongitude(result[1].coordinates)).toBeCloseTo(11.99);
    });

    test('keep order of regions', () => {
        const data: RegionToDistanceGroups = {
            otherGeoData: [{ latitude: 9, longitude: 10 }, { latitude: 11, longitude: 12 }, { latitude: 13, longitude: 14 }],
            geodata: [{ latitude: 3, longitude: 4 }, { latitude: 1, longitude: 2 }, { latitude: 5, longitude: 6 }]
        }

        const result = calculateRegionCenters(data);

        expect(result.length).toBe(2);
        expect(result[1].name).toBe('geodata');
        expect(getLatitude(result[1].coordinates)).toBeCloseTo(3);
        expect(getLongitude(result[1].coordinates)).toBeCloseTo(4);
        expect(result[0].name).toBe('otherGeoData');
        expect(getLatitude(result[0].coordinates)).toBeCloseTo(11);
        expect(getLongitude(result[0].coordinates)).toBeCloseTo(11.99);
    });
});

describe('getRegionsCenters - find centers of regions', () => {
    const value = {
        cloud_description: 'cloud_description',
        cloud_name: 'test-cloud-name',
        geo_latitude: 0,
        geo_longitude: 0,
        geo_region: 'geo_region',
    };

    test('accept empty array', () => {
        const result = getRegionsCenters([]);

        expect(result.length).toBe(0);
    });

    test('accept calculate propper centers', () => {
        const clouds: Cloud[] = populateValue(value, 10);

        clouds[1] = { ...clouds[1], geo_region: '1', geo_latitude: 1, geo_longitude: 2 };
        clouds[8] = { ...clouds[8], geo_region: '1', geo_latitude: 3, geo_longitude: 4 };

        clouds[2] = { ...clouds[2], geo_region: '2', geo_latitude: 5, geo_longitude: 6 };
        clouds[5] = { ...clouds[5], geo_region: '2', geo_latitude: 7, geo_longitude: 8 };

        const result = getRegionsCenters(clouds);

        expect(result.length).toBe(3);

        expect(result[0].name).toBe('1');
        expect(getLatitude(result[0].coordinates)).toBeCloseTo(2);
        expect(getLongitude(result[0].coordinates)).toBeCloseTo(3);
        expect(result[1].name).toBe('2');
        expect(getLatitude(result[1].coordinates)).toBeCloseTo(6);
        expect(getLongitude(result[1].coordinates)).toBeCloseTo(7);
        expect(result[2].name).toBe('geo_region');
        expect(getLatitude(result[2].coordinates)).toBeCloseTo(0);
        expect(getLongitude(result[2].coordinates)).toBeCloseTo(0);
    });

    test('keep alphabetical order', () => {
        const clouds: Cloud[] = populateValue(value, 10);

        clouds[9] = { ...clouds[9], geo_region: '1', geo_latitude: 1, geo_longitude: 2 };
        clouds[2] = { ...clouds[2], geo_region: '1', geo_latitude: 3, geo_longitude: 4 };

        clouds[1] = { ...clouds[1], geo_region: '2', geo_latitude: 5, geo_longitude: 6 };
        clouds[3] = { ...clouds[3], geo_region: '2', geo_latitude: 7, geo_longitude: 8 };

        const result = getRegionsCenters(clouds);

        expect(result.length).toBe(3);

        expect(result[0].name).toBe('1');
        expect(result[1].name).toBe('2');
        expect(result[2].name).toBe('geo_region');
    });
});


describe('getProvidersToRegionMatrix - matrix for fast search clouds by provider/region', () => {
    const value = {
        cloud_description: 'cloud_description',
        cloud_name: 'test-cloud-name',
        geo_latitude: 0,
        geo_longitude: 0,
        geo_region: 'geo_region',
    };

    test('accept empty array', () => {
        const result = getProvidersToRegionMatrix([]);

        expect(result).toMatchObject({});
    });

    test('accept single region and single provider', () => {
        const result = getProvidersToRegionMatrix([value]);

        expect(Object.keys(result).length).toBe(1);
        expect(Object.keys(result)[0]).toBe('test');
        expect(Object.keys(result['test']).length).toBe(1);
        expect(Object.keys(result['test'])[0]).toBe('geo_region');
        expect(result['test']['geo_region'].length).toBe(1);
        expect(result['test']['geo_region'][0]).toMatchObject(value);
    });

    test('accept multiple region and multiple providers', () => {
        const clouds = populateValue(value, 10);

        clouds[1] = { ...clouds[1], geo_region: '1', cloud_name: 'provider1-test' };
        clouds[2] = { ...clouds[2], geo_region: '1', cloud_name: 'provider2-test' };
        clouds[3] = { ...clouds[3], geo_region: '2', cloud_name: 'provider1-test' };
        clouds[4] = { ...clouds[3], geo_region: '2', cloud_name: 'provider1-test' };
        clouds[5] = { ...clouds[5], cloud_name: 'provider2-test' };

        const result = getProvidersToRegionMatrix(clouds);

        expect(Object.keys(result)).toStrictEqual(['test', 'provider1', 'provider2']);
        expect(Object.keys(result['test'])).toStrictEqual(['geo_region']);
        expect(Object.keys(result['provider1'])).toStrictEqual(['1', '2']);
        expect(Object.keys(result['provider2'])).toStrictEqual(['1', 'geo_region']);

        expect(result['test']['1']).toBeUndefined;
        expect(result['provider1']['1'].length).toBe(1);
        expect(result['provider2']['1'].length).toBe(1);

        expect(result['test']['2']).toBeUndefined;
        expect(result['provider1']['2'].length).toBe(2);
        expect(result['provider2']['2']).toBeUndefined();

        expect(result['test']['geo_region'].length).toBe(5);
        expect(result['provider1']['geo_region']).toBeUndefined();
        expect(result['provider2']['geo_region'].length).toBe(1);
    });

    test('order does not affect on result', () => {
        const clouds = populateValue(value, 10);

        clouds[5] = { ...clouds[5], geo_region: '1', cloud_name: 'provider1-test' };
        clouds[4] = { ...clouds[4], geo_region: '1', cloud_name: 'provider2-test' };
        clouds[3] = { ...clouds[3], geo_region: '2', cloud_name: 'provider1-test' };
        clouds[2] = { ...clouds[2], geo_region: '2', cloud_name: 'provider1-test' };
        clouds[1] = { ...clouds[1], cloud_name: 'provider2-test' };

        const result = getProvidersToRegionMatrix(clouds);

        expect(Object.keys(result)).toStrictEqual(['test', 'provider2', 'provider1']);
        expect(Object.keys(result['test'])).toStrictEqual(['geo_region']);
        expect(Object.keys(result['provider1'])).toStrictEqual(['1', '2']);
        expect(Object.keys(result['provider2'])).toStrictEqual(['1', 'geo_region']);

        expect(result['test']['1']).toBeUndefined;
        expect(result['provider1']['1'].length).toBe(1);
        expect(result['provider2']['1'].length).toBe(1);

        expect(result['test']['2']).toBeUndefined;
        expect(result['provider1']['2'].length).toBe(2);
        expect(result['provider2']['2']).toBeUndefined();

        expect(result['test']['geo_region'].length).toBe(5);
        expect(result['provider1']['geo_region']).toBeUndefined();
        expect(result['provider2']['geo_region'].length).toBe(1);
    });
});