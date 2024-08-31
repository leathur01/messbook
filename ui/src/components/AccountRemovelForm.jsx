import { Alert, Box, Dialog, Grid, TextField, Typography } from "@mui/material"
import { useState } from "react"
import axios from "axios"
import { useAuth } from "../provider/AuthProvider"
import { jwtDecode } from "jwt-decode"
import { Navigate, useNavigate } from "react-router-dom"
import FetchingButton from "./FetchingButton"

export default function AccountRemovalForm({ open, handleClose }) {
    const initialFormData = {
        password: '',
    }
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState(initialFormData)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false);
    const { token, setToken } = useAuth()
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const validate = () => {
        const errors = {}
        if (!formData.password) errors.password = 'Password is needed to delete your account'
        return errors
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        } else {
            const deleteAccount = async () => {
                setIsError(false)
                setIsLoading(true)
                let decoded = jwtDecode(token)
                try {
                    await axios.delete(
                        `http://localhost:8080/users/${decoded.sub}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        data: {
                            ...formData
                        }
                    })

                    setIsLoading(false)
                    setToken()
                    navigate('/', { replace: true })
                } catch (error) {
                    const passwordError = error.response.data.errors.password
                    if (passwordError) {
                        setErrors({
                            password: passwordError
                        })
                        setTimeout(() => {
                            setIsLoading(false)
                        }, 0.75 * 1000)
                    } else {
                        setIsError(true)
                    }
                }
            }

            deleteAccount()
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
                        Delete your account
                    </Typography>
                    <Alert severity='warning' sx={{ textAlign: 'left', fontSize: '16px', fontWeight: '400' }}>
                        Deleting your account will immediately log you out and you will not be able to log in again
                    </Alert>
                </Box>
                <Box component='form' noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name='password'
                                fullWidth
                                label='Password'
                                type='password'
                                autoFocus
                                error={!!errors.password}
                                helperText={errors.password}
                                onChange={handleInputChange}
                            />
                        </Grid>

                    </Grid>
                    <FetchingButton isLoading={isLoading} label='Delete account' />
                </Box>
            </Box>
        </Dialog>
    )
}