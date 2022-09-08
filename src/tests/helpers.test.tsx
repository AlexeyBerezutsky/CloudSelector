import { getProviderName, filterCloudsByProvider } from "../reducers/helpers";
import { Cloud } from "../types/apps";
import { populateValue } from "./tools";

describe('getProviderName - extract provider name from raw data', () => {
    test('Split name with - and get first one', () => {
        expect(getProviderName('aws-af-south-1')).toBe('aws');
    });

    test('Accept names without -', () => {
        expect(getProviderName('aws')).toBe('aws');
    });

    test('Accept empty value', () => {
        expect(getProviderName('')).toBe('');
    });

    test('Accept empty value', () => {
        expect(getProviderName('test-aws')).toBe('test');
    });
});

describe('filterByProvider - filter list of clouds by provider name', () => {
    const value = {
        cloud_description: 'cloud_description',
        cloud_name: 'test-cloud-name',
        geo_latitude: 0,
        geo_longitude: 0,
        geo_region: 'geo_region',
    };

    test('accept empty array', () => {
        const result = filterCloudsByProvider('some provider name', [])
        expect(result.length).toBe(0);
    });

    test('extract cloud value', () => {
        const result = filterCloudsByProvider('test', [value])
        expect(result.length).toEqual(1);
        expect(result[0]).toMatchObject(value);
    });

    test('extract correct cloud values from array', () => {
        const clouds = populateValue(value, 7).map((item, ix) => ({ ...item, cloud_description: String(ix) }));

        clouds[0].cloud_name = 'SMTH-cloud_name';
        clouds[5].cloud_name = 'SMTH-cloud_name';

        const result = filterCloudsByProvider('SMTH', clouds);
        expect(result.length).toEqual(2);
        expect(result[0].cloud_description).toBe('0');
        expect(result[1].cloud_description).toBe('5');
    });

    test('return empty array if nothing found', () => {
        const clouds: Cloud[] = populateValue(value, 7);
        const result = filterCloudsByProvider('smth', clouds)
        expect(result.length).toEqual(0);
    });
});