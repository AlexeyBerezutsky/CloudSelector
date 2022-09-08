import { Tabs, Tab } from "@mui/material";
import { SyntheticEvent } from "react";

type Props = {
    regions: string[],
    currentRegionName?: string,
    setCurrentRegionName: (name: string) => void
};

export function RegionTabs({ regions, currentRegionName, setCurrentRegionName }: Props) {
    return (
        <>
            <Tabs value={currentRegionName}
                onChange={(event: SyntheticEvent, regionName: string) => setCurrentRegionName(regionName)}
                aria-label="region tabs" variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile>
                {regions.map((regionName) => <Tab value={regionName} key={regionName} label={regionName} />)}
            </Tabs>
        </>
    )
}