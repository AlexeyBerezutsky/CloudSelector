import { Box } from "@mui/material";

type TabPanelProps<T> = {
    children?: React.ReactNode;
    index: T;
    value: T;
}

export function TabPanel<T = string>(props: TabPanelProps<T>) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}