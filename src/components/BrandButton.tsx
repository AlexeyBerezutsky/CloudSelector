import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getCloudProvider } from '../tools/providers.constants';
import { Button } from '@mui/material';

const ImageSrc = styled('img')({
});

const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
}));

type Props = {
    name: string;
    onClick: () => void
}

export function BrandButton({ name, onClick }: Props) {
    const attributes = getCloudProvider(name);

    return (<Button
        sx={{
            height: '200px',
            width: '200px'
        }}
        onClick={onClick}

    >
        <ImageSrc src={attributes.image} />
        <ImageBackdrop />
        <Image>
            <Typography variant="subtitle1">
                {attributes.name}
            </Typography>
        </Image>
    </Button >)
}

