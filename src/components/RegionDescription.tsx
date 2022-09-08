import { Card, CardContent, Typography } from "@mui/material";

type Props = {
    name: string,
    description: string,
    isActive: boolean
}

export function RegionDescription({ name, description, isActive }: Props) {
    const style = (isActive ? '1px solid royalblue' : '');
    return <Card sx={{ minWidth: 275, border: style, margin: 1 }}>
        <CardContent>
            <Typography variant="h5" color="text.primary" gutterBottom>
                {name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
                {description}
            </Typography>
        </CardContent>
    </Card>
}