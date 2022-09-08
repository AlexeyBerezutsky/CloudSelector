import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { Coordinates } from "../tools/geoWrappers";

export type RegionGeoData = { name: string, coordinates: Coordinates };

type GeolocationProps = {
    onChanged: (coordinates?: Coordinates) => void;
    list: RegionGeoData[]
};

export function RegionsList({ onChanged, list }: GeolocationProps) {
    const [selected, setSelected] = useState<string>('');

    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string;
        setSelected(value);

        const region = list.find((item) => item.name === value);
        onChanged(region?.coordinates);
    };

    return (
        <Box sx={{ minWidth: 300, width: '50%' }}>
            <FormControl fullWidth>
                <Select
                    value={selected}
                    onChange={handleChange}
                >
                    {list.map((item) => (<MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>))}
                </Select>
            </FormControl>
        </Box>
    );


}