import { Alert, Box, Button, Collapse, Dialog, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import PasswordRecoveryForm from './PasswordRecoveryForm';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import FetchingButton from './FetchingButton';

const PasswordRequestForm = ({ forgotPassword, setForgotPassword }) => {
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState({});
    const [hasPasswordToken, setHasPasswordToken] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const validateEmpty = () => {
        const newErrors = {}
        if (!email) newErrors.email = 'Your email address cannot be empty'
        return newErrors
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const validationErrors = validateEmpty();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setIsLoading(true)
            setErrors({})
            try {
                let response = await axios.post('http://localhost:8080/password-reset', { email: email })
                console.log(response.data)
                setIsSuccess(true)
                setTimeout(() => {
                    setHasPasswordToken(true)
                    setForgotPassword(false)
                    // Give time for the user to read the success message
                    setIsLoading(false)
                }, 2.5 * 1000)
            } catch (error) {
                const emailError = error.response?.data.errors?.email
                if (emailError) {
                    setErrors({ email: emailError })
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 0.75 * 1000)
                } else {
                    setIsError(true)
                }
            }
        }
    }

    const handleClose = () => {
        setEmail('')
        setErrors({})
        setIsSuccess(false)
        setForgotPassword(false)
    }


    if (isError) return <Navigate to='/500' replace={true} />

    return (
        <Fragment>
            <Dialog open={forgotPassword} onClose={handleClose}>
                <Box sx={{
                    backgroundColor: 'white',
                    padding: 5,
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
                }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant='h5' sx={{ marginBottom: '10px' }}>
                            Reset your password
                        </Typography>
                        <Typography>
                            Enter your email and we will send you a code to reset your password
                        </Typography>
                    </Box>
                    <Box component='form' noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name='email'
                                    fullWidth
                                    label='Email Address'
                                    autoFocus
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    onChange={(event) => { setEmail(event.target.value) }}
                                    autoComplete='none'
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ width: '100%' }}>
                            <Collapse in={isSuccess}>
                                <Alert
                                    variant="outlined"
                                    severity="success"
                                    sx={{ mt: 2, fontSize: '16px', textTransform: 'none' }}
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setIsSuccess(false)
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                >
                                    We will send you an email to reset your password
                                </Alert>
                            </Collapse>
                        </Box>
                        <FetchingButton isLoading={isLoading} label='Send code to email' isSuccess={isSuccess} />
                        <Stack direction='row' justifyContent='flex-end'>
                            <Button onClick={() => {
                                setHasPasswordToken(true)
                                handleClose()
                            }}>
                                Received the code?
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Dialog>

            <PasswordRecoveryForm
                hasPasswordToken={hasPasswordToken}
                setHasPasswordToken={setHasPasswordToken}
                handlePreviousFormClose={handleClose} />
        </Fragment>
    )
}

export default PasswordRequestForm