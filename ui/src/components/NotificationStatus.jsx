import { Button, Stack, Typography } from "@mui/material"
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';

const NotificationStatus = ({ status, setNotificationStatus }) => {
    const handlePermissionRequest = async () => {
        const permission = await Notification.requestPermission()
        setNotificationStatus(permission)
    }

    if (status === 'granted') {
        return (
            <Stack direction='row' alignItems='center' gap={1}>
                <NotificationsActiveIcon color='success' />
                <Typography sx={{ fontWeight: '400' }}>
                    Notifications Allowed
                </Typography>
            </Stack>
        )
    } else if (status === 'denied') {
        return (
            <Stack direction='row' alignItems='center' gap={1}>
                <NotificationsOffIcon color='error' />
                <Typography sx={{ fontWeight: '400' }}>
                    Notifications Denied
                </Typography>
            </Stack>
        )
    } else {
        return (
            <Button sx={{ textTransform: 'none' }} onClick={handlePermissionRequest}>
                <Stack direction='row' alignItems='center' gap={1}>
                    <NotificationAddIcon color='' />
                    <Typography sx={{ fontWeight: '400' }}>
                        Allow notification?
                    </Typography>
                </Stack>
            </Button>
        )
    }
}

export default NotificationStatus