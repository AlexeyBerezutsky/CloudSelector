import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { isEmpty } from "lodash";
import { useState, useEffect } from "react";
import { ModalProvider } from "./hooks/useModal";
import { CloudSelectorPage } from "./pages/CloudSelectorPage";
import { cloudsUrl } from "./settings";
import { Cloud, CloudReturnType } from "./types/apps";

const FallBack = () => <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>

export default function App() {
    const [clouds, setClouds] = useState<Cloud[]>([]);
    useEffect(() => {
        (async () => {
            const answer = await axios.get<CloudReturnType>(cloudsUrl);
            const clouds = answer.data.clouds;
            setClouds(clouds);
        })()
    }, []);

    const render = isEmpty(clouds) ? <FallBack /> : <CloudSelectorPage clouds={clouds} />;

    return (
        <ModalProvider>
            {render}
        </ModalProvider>
    );
}