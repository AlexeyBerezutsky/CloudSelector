import { Box, Container, Switch, Typography } from "@mui/material";
import { ChangeEvent } from "react";
import { CalcType, Cloud } from "../types/apps";

type Props = {
    cloud?: Cloud,
    calcType: CalcType,
    setCalcType: (calcType: CalcType) => void
};

export function Aside({ cloud, calcType, setCalcType }: Props) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Typography>
                Compute type
            </Typography>
            <Switch defaultChecked onChange={(event: ChangeEvent<HTMLInputElement>) => setCalcType(event.target.checked ? "Center" : "Nearest")} />
            <Typography>
                {calcType}
            </Typography>
            <Typography>
                {cloud?.cloud_description}
            </Typography>
        </Box>
    );
}