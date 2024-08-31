import { Box, LinearProgress } from "@mui/material"
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';

const Loading = () => {
    return (
        <Box
            sx={{
                width: 1,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Diversity2OutlinedIcon sx={{ fontSize: 150, color: 'primary.main' }} />
            <Box sx={{ width: 125, marginTop: 3 }}>
                <LinearProgress sx={{ color: '#BA0066' }} />
            </Box>
        </Box>
    )
}

export default Loading