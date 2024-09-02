import { Alert, Box, Collapse, Dialog, Grid, IconButton, TextField, Typography } from '@mui/material';
import FetchingButton from './FetchingButton';
import { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const PasswordRecoveryForm = ({ hasPasswordToken, setHasPasswordToken, handlePreviousFormClose }) => {
    const initialFormData = {
        token: '',
        newPassword: '',
        confirmedPassword: ''
    }
    const [formData, setFormData] = useState(initialFormData)
    const [errors, setErrors] = useState({})
    // serverError is the same as isError state => refactore later for more understandable code
    const [serverError, setServerError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const validate = () => {
        const errors = {}
        if (!formData.token) errors.token = 'You need the code that we sent to your email to reset your password'
        if (!formData.newPassword) errors.newPassword = 'Your new password cannot be empty'
        if (!formData.confirmedPassword) errors.confirmedPassword = 'Please confirm your new password'
        if (!('confirmedPassword' in errors) && formData.newPassword !== formData.confirmedPassword) {
            errors.confirmedPassword = 'Passwords do not match'
        }
        return errors
    }

    console.log(serverError)
    const handleSubmit = async (event) => {   
        event.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        } else {
            setIsLoading(true)
            try {
                await axios.put('http://localhost:8080/users/reset-password', { token: formData.token, password: formData.newPassword })
                setErrors({})
                setTimeout(() => {
                    setIsLoading(false)
                }, 0.75 * 1000)
                setIsSuccess(true)
                setFormData(initialFormData)
            } catch (error) {
                // The optional operator for the key 'data' is to handle ERR_CONNECTION_REFUSE
                const tokenError = error.response?.data.errors?.token
                const passwordError = error.response?.data.errors?.password
                if (tokenError || passwordError) {
                    setErrors({ token: tokenError, newPassword: passwordError })
                    setTimeout(() => { setIsLoading(false) }, 0.75 * 1000)
                } else {
                    setServerError(true)
                }
            }
        }
    }

    const handleClose = () => {
        handlePreviousFormClose()
        setErrors({})
        setFormData(initialFormData)
        setHasPasswordToken(false)
        setIsSuccess(false)
    }

    if (serverError) return <Navigate to='/500' />

    return (
        <Dialog open={hasPasswordToken} onClose={() => { handleClose() }}>
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
                        Enter the code that we have sent to your email and your new password
                    </Typography>
                </Box>
                <Box component='form' noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name='token'
                                fullWidth
                                label='Code'
                                autoFocus
                                error={!!errors.token}
                                helperText={errors.token}
                                onChange={handleInputChange}
                                value={formData.token}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name='newPassword'
                                label='New Password'
                                type='password'
                                error={!!errors.newPassword}
                                helperText={errors.newPassword}
                                onChange={handleInputChange}
                                value={formData.newPassword}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name='confirmedPassword'
                                fullWidth
                                label='Confirm New Password'
                                type='password'
                                error={!!errors.confirmedPassword}
                                helperText={errors.confirmedPassword}
                                onChange={handleInputChange}
                                value={formData.confirmedPassword}
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
                                Your password has been updated
                            </Alert>
                        </Collapse>
                    </Box>
                    <FetchingButton
                        label='Update'
                        isSubmit={true}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                    />
                </Box>
            </Box>
        </Dialog>
    )
}

export default PasswordRecoveryForm