import { Avatar, Box, Button, Dialog, IconButton, Stack, Typography } from "@mui/material"
import { ClearIcon } from '@mui/x-date-pickers';
import CheckIcon from '@mui/icons-material/Check';
import axios from "axios";
import { useAuth } from "../provider/AuthProvider";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import ProfileCard from "./ProfileCard";

const FriendRequestTab = ({ inComingRequests, outGoingRequests, setFriends, setInComingRequests, setOutGoingRequests }) => {
    const { token } = useAuth()
    const [serverError, setServerError] = useState(false)
    const total = inComingRequests.length + outGoingRequests.length
    const [selectedFriend, setSelectedFriend] = useState({})
    const [viewProfile, setViewProfile] = useState(false)

    const handleAccept = async (senderId) => {
        try {
            await axios.post(
                `http://localhost:8080/users/self/friends/requests/${senderId}/accept`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            let response = await axios.get(
                `http://localhost:8080/users/self/friends`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            setFriends(response.data)
            response = await axios.get(
                'http://localhost:8080/users/self/friends/requests?direction=incoming',
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            setInComingRequests(response.data)
        } catch (error) {
            console.log(error)
            setServerError(true)
        }
    }

    const handleDeny = async (senderId) => {
        try {
            await axios.post(
                `http://localhost:8080/users/self/friends/requests/${senderId}/deny`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            const response = await axios.get(
                'http://localhost:8080/users/self/friends/requests?direction=incoming',
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            setInComingRequests(response.data)
        } catch (error) {
            setServerError(serverError)
        }
    }

    const handleCancel = async (receiverId) => {
        try {
            await axios.post(
                `http://localhost:8080/users/self/friends/requests/${receiverId}/cancel`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            const response = await axios.get(
                'http://localhost:8080/users/self/friends/requests?direction=outgoing',
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            setOutGoingRequests(response.data)
        } catch (error) {
            setServerError(serverError)
        }
    }


    if (serverError) return <Navigate to='/500' />

    return (
        <Box>
            <Typography sx={{ fontWeight: '500', fontSize: '18px', marginBottom: '8px' }}>
                {'PENDING - ' + total}
            </Typography>
            {inComingRequests.map((inComingRequest, index) => {
                return (
                    <Stack direction='row' alignItems='center' gap={1} justifyContent='space-between'
                        key={index}
                        sx={{
                            padding: '5px 0'
                        }}>
                        <Button
                            onClick={() => {
                                setSelectedFriend(inComingRequest)
                                setViewProfile(true)
                            }}
                            variant='contained'
                            sx={{
                                textTransform: 'none',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'flex-start',
                            }}>
                            <Stack direction='row' gap={1}>
                                <Avatar src='/src/assets/avatar/doggo.jpg'
                                    sx={{ width: 50, height: 50, border: 'solid ', borderColor: 'primary.main' }}
                                />
                                <Stack justifyContent='center' sx={{ textAlign: 'left' }}>
                                    <Typography sx={{
                                        fontWeight: '400',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {inComingRequest.nickname}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '12px',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}>
                                        Incoming Friend request
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Button>
                        <Stack direction='row' alignItems='center' justifyContent='flex-end'
                            sx={{
                                height: '64px',
                                borderRadius: '5px',
                                padding: '0px 10px',
                                width: 'auto',
                                backgroundColor: '#F5F7F8'
                            }}>
                            <IconButton
                                onClick={() => { handleAccept(inComingRequest.id) }}
                                sx={{
                                    width: 40, height: 40,
                                }}>
                                <CheckIcon color='success' />
                            </IconButton>
                            <IconButton
                                onClick={() => { handleDeny(inComingRequest.id) }}
                                sx={{
                                    width: 40, height: 40,
                                }}>
                                <ClearIcon color='error' />
                            </IconButton>
                        </Stack>
                    </Stack >
                )
            })}


            {
                outGoingRequests.map((outGoingRequest, index) => {
                    return (
                        <Stack direction='row' alignItems='center' gap={1} justifyContent='space-between'
                            key={index}
                            sx={{
                                padding: '5px 0'
                            }}>
                            <Button
                                onClick={() => {
                                    setSelectedFriend(outGoingRequest)
                                    setViewProfile(true)
                                }}
                                variant='contained'
                                sx={{
                                    textTransform: 'none',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                }}>
                                <Stack direction='row' gap={1}>
                                    <Avatar src='/src/assets/avatar/doggo.jpg'
                                        sx={{ width: 50, height: 50, border: 'solid ', borderColor: 'primary.main' }}
                                    />
                                    <Stack justifyContent='center' sx={{ textAlign: 'left' }}>
                                        <Typography sx={{
                                            fontWeight: '400',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {outGoingRequest.nickname}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: '12px',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                            }}>
                                            Outgoing Friend Request
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Button>

                            <Stack direction='row' alignItems='center' justifyContent='flex-end'
                                sx={{
                                    height: '64px',
                                    borderRadius: '5px',
                                    padding: '0px 10px',
                                    width: 'auto',
                                    backgroundColor: '#F5F7F8'
                                }}>
                                <IconButton
                                    onClick={() => { handleCancel(outGoingRequest.id) }}
                                    sx={{
                                        width: 40, height: 40,
                                    }}>
                                    <ClearIcon color='error' />
                                </IconButton>
                            </Stack>
                        </Stack>
                    )
                })
            }

            <Dialog open={viewProfile} onClose={() => {
                setViewProfile(false)
                // Prevent some data disapeare before the dialog is closed => increase UX
                setTimeout(() => {
                    setSelectedFriend({})
                }, 0.1 * 1000)
            }}>
                <ProfileCard friend={selectedFriend} />
            </Dialog>
        </Box >
    )
}

export default FriendRequestTab