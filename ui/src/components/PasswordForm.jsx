import { Box, Dialog, Grid, TextField, Typography } from "@mui/material"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useState } from "react"
import { useAuth } from "../provider/AuthProvider"
import { Navigate } from "react-router-dom"
import FetchingButton from "./FetchingButton"

export default function PasswordForm({ open, handleClose }) {
    const initialFormData = {
        currentPassword: '',
        newPassword: '',
        confirmedPassword: ''
    }
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState(initialFormData)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false);
    const { token } = useAuth()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const validate = () => {
        const errors = {}
        if (!formData.currentPassword) errors.currentPassword = 'Your current password cannot be empty'
        if (!formData.newPassword) errors.newPassword = 'Your new password cannot be empty'
        if (!formData.confirmedPassword) errors.confirmedPassword = 'Please confirm your new password'
        if (!('confirmedPassword' in errors) && formData.newPassword !== formData.confirmedPassword) {
            errors.confirmedPassword = 'Passwords do not match'
        }
        return errors
    }

    const handleSubmit = (event) => {

        event.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        } else {
            const updatePassword = async () => {
                setIsError(false)
                setIsLoading(true)
                let decoded = jwtDecode(token)
                const { ...body } = formData
                delete body.confirmedPassword
                try {
                    await axios.put(
                        `http://localhost:8080/users/${decoded.sub}/password`, body,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    )

                    setIsLoading(false)
                    handleClose()
                    setFormData(initialFormData)
                    setErrors({})
                } catch (error) {
                    const currentPasswordError = error.response.data.errors.password
                    const newPasswordError = error.response.data.errors.newPassword
                    if (currentPasswordError || newPasswordError) {
                        setErrors({
                            currentPassword: currentPasswordError,
                            newPassword: newPasswordError
                        })
                        setTimeout(() => {
                            setIsLoading(false)
                        }, 0.75 * 1000)
                    } else {
                        setIsError(true)
                    }
                }
            }

            updatePassword()
        }
    }

    if (isError) return <Navigate to='/500' />

    return (
        <Dialog
            open={open}
            onClose={() => {
                handleClose()
                setFormData(initialFormData)
                setErrors({})
            }}
        >
            <Box sx={{
                backgroundColor: 'white',
                padding: 5,
                borderRadius: '8px',
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ marginBottom: '10px' }}>
                        Update your password
                    </Typography>
                    <Typography>
                        Enter your current password and a new password
                    </Typography>
                </Box>
                <Box component='form' noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name='currentPassword'
                                fullWidth
                                label='Current Password'
                                type='password'
                                autoFocus
                                error={!!errors.currentPassword}
                                helperText={errors.currentPassword}
                                onChange={handleInputChange}
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
                            />
                        </Grid>
                    </Grid>
                    <FetchingButton isLoading={isLoading} label='Update'/>
                </Box>
            </Box>
        </Dialog>
    )
}