export type Cloud = {
    cloud_description: string;
    cloud_name: string;
    geo_latitude: number;
    geo_longitude: number;
    geo_region: string;
}

export type Error = {
    message: string,
    more_info: string,
    status: number
}

export type CloudReturnType = {
    clouds: Cloud[];
    errors: Error[];
    message: "string";
}

export type CalcType = "Center" | "Nearest"