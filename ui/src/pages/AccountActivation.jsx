import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import axios from 'axios';
import { Alert, Collapse, Grid, IconButton, Stack } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../provider/AuthProvider';
import LoadingButton from '../components/LoadingButton';
import Loading from './Loading';

export default function AccountActivation() {
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const { setIsActivated, isActivated } = useAuth()
    const [loadingScreen, setLoadingScreen] = useState(true)    

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget);
        const activationToken = data.get('activationToken')
        if (!activationToken) {
            setErrors({ tokenField: 'Please enter your activation token' })            
        } else {
            axios
                .put('http://localhost:8080/activate', { token: activationToken })
                .then(response => {
                    const user = response.data
                    setIsActivated(user.activated)
                    navigate('/')
                })
                .catch(error => {
                    setErrors(error.response.data.errors)
                })
        }
    }

    setTimeout(() => { setLoadingScreen(false) }, 0.75 * 1000)
    if (loadingScreen) return <Loading />

    return (
        <Box component="main" sx={{
            backgroundColor: 'primary.main',
            height: '100vh',
            padding: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Container sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', width: 600 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <MarkEmailReadOutlinedIcon
                        sx={{ fontSize: 100, color: 'primary.main' }}
                    />
                    {isActivated ? (
                        <Typography component="p" variant="h6">
                            Your account has been activated. Please continue
                            <br />
                        </Typography>
                    ) : (
                        <Typography component="p" variant="subtitle" sx={{ mb: 3 }}>
                            An activation token is sending to your registered email.
                            Enter the token to activate your account.
                            <br />
                        </Typography>
                    )}
                    <Box component="form" noValidate sx={{ width: 1 }} onSubmit={handleSubmit}>
                        {!isActivated && (
                            <TextField
                                required
                                fullWidth
                                name="activationToken"
                                label="Enter your activation token"
                                id="activationToken"
                                error={!!errors.tokenField}
                                helperText={errors.tokenField}
                            />
                        )}
                        <Box sx={{ width: '100%' }}>
                            <Collapse in={!!errors.token}>
                                <Alert
                                    variant="outlined"
                                    severity="error"
                                    sx={{ mt: 2 }}
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setErrors({});
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                >
                                    {errors.token}.
                                    <br />
                                    Click Resend the a new token if your token has been expired (3 days)
                                </Alert>
                            </Collapse>
                        </Box>

                        <Stack direction='row' justifyContent='space-around' sx={{ margin: '20px 0 15px 0' }}>
                            <LoadingButton isLogOut={true} />
                            {isActivated ? (
                                <LoadingButton label='Continue' handleClick={() => { navigate('/') }} />
                            ) : (
                                <LoadingButton isSubmit={true} label='Verify' />
                            )}
                        </Stack>

                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                {!isActivated && (
                                    <Link href="#" variant="body2">
                                        Resend a new token
                                    </Link>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}