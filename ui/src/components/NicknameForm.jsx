import { Box, Dialog, Grid, TextField, Typography } from "@mui/material"
import { useState } from "react"
import axios from "axios"
import { useAuth } from "../provider/AuthProvider"
import { jwtDecode } from "jwt-decode"
import { Navigate } from "react-router-dom"
import FetchingButton from "./FetchingButton"

export default function NicknameForm({ open, handleClose, setUser, user }) {
    const initalFormData = {
        newNickname: user.nickname,
        password: '',
    }

    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState(initalFormData)
    const { token } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false);

    const validateEmpty = () => {
        const newErrors = {}
        if (!formData.newNickname) newErrors.newNickname = 'Please enter your new nickname'
        if (!formData.password) newErrors.password = 'Please enter your password'
        return newErrors
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const validationErrors = validateEmpty()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        } else {
            const updateNickname = async () => {
                setIsLoading(true)
                setIsError(false)
                let decoded = jwtDecode(token)
                try {
                    const response = await axios.put(
                        `http://localhost:8080/users/${decoded.sub}/nickname`, formData,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    )

                    setErrors({})
                    handleClose()
                    setFormData(initalFormData)
                    setIsLoading(false)
                    setUser(response.data)
                } catch (error) {
                    const nickNameError = error.response.data.errors.nickname
                    const passwordError = error.response.data.errors.password
                    if (nickNameError || passwordError) {
                        setErrors({
                            newNickname: nickNameError,
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

            updateNickname()
        }
    }

    if (isError) return <Navigate to='/500' />

    return (
        <Dialog open={open} onClose={() => {
            handleClose()
            setFormData(initalFormData)
            setErrors({})
        }} >
            <Box sx={{
                backgroundColor: 'white',
                padding: 5,
                borderRadius: '8px',
                boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant='h5' sx={{ marginBottom: '10px' }}>
                        Change your nickname
                    </Typography>
                    <Typography>
                        Enter your new nickname and your current password
                    </Typography>
                </Box>
                <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="newNickname"
                                fullWidth
                                label="New Nickname"
                                autoFocus
                                error={!!errors.newNickname}
                                helperText={errors.newNickname}
                                onChange={handleInputChange}
                                defaultValue={user.nickname}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                error={!!errors.password}
                                helperText={errors.password}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <FetchingButton isLoading={isLoading} label='Change'/>
                </Box>
            </Box>
        </Dialog>
    )
}