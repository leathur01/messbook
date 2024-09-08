import { Alert, Box, Collapse, IconButton, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import FetchingButton from "./FetchingButton"
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import { Navigate } from "react-router-dom";

const AddFriendTab = ({ setOutGoingRequests, setInComingRequests, setFriends, inComingRequests }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({ nickname: '' })
    const [serverError, setServerError] = useState(false)
    const { token } = useAuth()

    const isAlreadyReceived = () => {
        return inComingRequests.some(request => request.nickname === formData.nickname)
    }

    const validate = () => {
        const errors = {}
        if (!formData.nickname) errors.nickname = 'Please enter the nickname of the person you want to connect'
        return errors
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        } else {
            setIsLoading(true)
            setIsSuccess(false)
            try {
                await axios.post(
                    'http://localhost:8080/users/self/friends/requests', formData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                // If the user in the sent request has already sent a friend request then the request will be accepted
                // 
                if (isAlreadyReceived()) {
                    var inComingResponse = await axios.get(
                        'http://localhost:8080/users/self/friends/requests?direction=incoming',
                        { headers: { 'Authorization': `Bearer ${token}` } }

                    )
                    setInComingRequests(inComingResponse.data)
                    const friendResponse = await axios.get(
                        `http://localhost:8080/users/self/friends`,
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    )
                    setFriends(friendResponse.data)
                } else {
                    var outGoingResponse = await axios.get(
                        'http://localhost:8080/users/self/friends/requests?direction=outgoing',
                        { headers: { 'Authorization': `Bearer ${token}` } }

                    )
                    setOutGoingRequests(outGoingResponse.data)
                }
                setErrors({})
                setIsSuccess(true)
                setFormData({ nickname: '' })
                setTimeout(() => {
                    setIsLoading(false)
                }, 0.75 * 1000)
            } catch (error) {
                const nicknameError = error.response?.data.errors?.nickname
                if (nicknameError) {
                    setErrors({ nickname: nicknameError })
                    setTimeout(() => { setIsLoading(false) }, 0.75 * 1000)
                } else {
                    setServerError
                }
            }
        }
    }

    if (serverError) return <Navigate to='/500' />

    return (
        <Box>
            <Typography sx={{ fontWeight: '500', fontSize: '18px', marginBottom: '8px' }}>
                ADD FRIEND
            </Typography>
            <Typography>
                You can add friend with their Messbook nickname
            </Typography>
            <Box component='form' noValidate onSubmit={handleSubmit}>
                <Stack gap={0} alignItems='flex-end' sx={{ marginTop: '15px' }}>
                    <TextField
                        name="nickname"
                        label='Messbook Nickname'
                        autoFocus
                        sx={{ width: '100%' }}
                        error={!!errors.nickname}
                        helperText={errors.nickname}
                        onChange={handleInputChange}
                        value={formData.nickname}
                    />
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
                                Your friend request has been sent
                            </Alert>
                        </Collapse>
                    </Box>
                    <FetchingButton
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        label='Send Friend Frequest'
                        extendedStyle={{ width: '200px' }}
                    />
                </Stack>
            </Box>
        </Box>
    )
}

export default AddFriendTab