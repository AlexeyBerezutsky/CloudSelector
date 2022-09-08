import { Grid } from "@mui/material";
import { useState } from "react"
import { Aside } from "../components/Aside";
import { CloudSelectorWithGeolocation } from "../components/CloudSelector";
import { CalcType, Cloud } from "../types/apps";

export function CloudSelectorPage({ clouds }: { clouds: Cloud[] }) {
    const [cloud, setCloud] = useState<Cloud>();
    const [calcType, setCalcType] = useState<CalcType>("Center");

    return (
        <Grid container>
            <Grid item xs={10}>
                <CloudSelectorWithGeolocation clouds={clouds} calcType={calcType} onSelected={(cloud: Cloud) => { setCloud(cloud) }} />
            </Grid>
            <Grid item xs={2}>
                <Aside cloud={cloud} calcType={calcType} setCalcType={(calcType: CalcType) => setCalcType(calcType)} />
            </Grid>
        </Grid>
    )
}
