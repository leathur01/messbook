import { Stack, Typography, Box, Avatar, IconButton } from "@mui/material";
import { ClearIcon } from '@mui/x-date-pickers';

const NotificationToast = ({ title, body, closeToast }) => {
    return (
        <Box
            style={{
                backgroundColor: 'white',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                padding: '22px 20px 22px 20px',
                borderLeft: '8px solid #674188',
            }}>
            {/* Passing the Stack directly to the snackbar results in a materialUI bug, so we wrap it with the Box component*/}
            <Box>
                <Stack gap={3} alignItems='center' direction='row'>
                    <Avatar
                        src='/src/assets/avatar/doggo.jpg'
                        sx={{ width: 60, height: 60 }}
                    >
                    </Avatar>
                    <Stack gap={0}>
                        <Typography sx={{
                            fontSize: '20px', fontWeight: '500',
                            textTransform: 'capitalize',
                            color: 'black'
                        }}>
                            {title}
                        </Typography>
                        <Typography
                            sx={{
                                width: '250px',
                                textWrap: 'wrap',
                                color: 'black'
                            }}>
                            {body}
                        </Typography>
                    </Stack>
                    <IconButton
                        onClick={closeToast}
                        sx={{
                            width: 40, height: 40,
                        }}>
                        <ClearIcon color='primary' />
                    </IconButton>
                </Stack>
            </Box>
        </Box>
    )
}

export default NotificationToast