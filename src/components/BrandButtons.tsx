import { Box } from "@mui/material";
import { BrandButton } from "./BrandButton";

type Props = { providers: string[], currentProvider?: string, setCurrentProvider: (name: string) => void };

export function BrandButtons({ providers, currentProvider, setCurrentProvider }: Props) {
    return (
        <Box sx={{ display: 'flex', flexWrap: 'nowrap', minWidth: 300, width: '100%' }}>
            {providers.map((providerName) => {
                return <Box sx={{
                    border: providerName === currentProvider ? '3px solid royalblue' : '',
                    margin: 2,
                }}
                    key={providerName} >
                    <BrandButton
                        key={providerName}
                        name={providerName}
                        onClick={() => setCurrentProvider(providerName)} /></Box>
            })}
        </Box>
    )
}