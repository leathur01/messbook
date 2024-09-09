import React, { Fragment, useEffect, useState } from "react";
import { Stack, Tabs, Tab, Typography, Box, styled, Avatar, Dialog, Alert, Snackbar, IconButton } from "@mui/material";
import ConnectWithoutContactOutlinedIcon from '@mui/icons-material/ConnectWithoutContactOutlined';
import StyledBadge from "../components/StyledBadge";
import UserProfile from "./UserProfile";
import ChatBox from "../components/ChatBox";
import ProfileSettingButton from "../components/ProfileSettingButton";
import FriendPanelContainer from "../components/FriendPanelContainer";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import { useAuth } from "../provider/AuthProvider";
import LoadingButton from "../components/LoadingButton";
import NotificationStatus from "../components/NotificationStatus";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../notifications/firebase";
import { ClearIcon } from '@mui/x-date-pickers';

const { VITE_APP_VAPID_KEY } = import.meta.env;

export default function HomePage() {
    const [chatTab, setChatTab] = React.useState(0);
    const [open, setOpen] = useState(false)
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { token, setIsActivated } = useAuth()
    const [isTokenValid, setIsTokenValid] = useState(true)
    const [notificationStatus, setNotificationStatus] = useState(Notification.permission)
    const [friends, setFriends] = useState([])
    const [newNotif, setNewNotif] = useState(false)
    const [notificationData, setNotificationData] = useState({ title: '', body: '' })
    const [inComingRequests, setInComingRequests] = useState([])
    const [outGoingRequests, setOutGoingRequests] = useState([])

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setNewNotif(false);
    }

    onMessage(messaging, (payload) => {
        setNewNotif(true)
        const notification = payload.data
        setNotificationData({ title: notification.title, body: notification.body })
        console.log('Message received. ', payload);

        const fetchIncomingFriendRequests = async () => {
            try {
                let response = await axios.get(
                    'http://localhost:8080/users/self/friends/requests?direction=incoming',
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                setInComingRequests(response.data)
            } catch (error) {
                setIsError(true)
            }
        }

        if (notification.type === 'SEND_FRIEND_REQUEST') {
            fetchIncomingFriendRequests()
        }
    });

    useEffect(() => {
        let decoded = jwtDecode(token)
        const fetchUser = async () => {
            setIsError(false)
            setIsLoading(true)
            try {
                let response = await axios.get(
                    `http://localhost:8080/users/${decoded.sub}`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                setUser(response.data)
                setIsActivated(response.data.activated)

                response = await axios.get(
                    `http://localhost:8080/users/self/friends`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                setFriends(response.data)
            } catch (error) {
                const tokenError = error.response.data.errors.token
                if (tokenError) {
                    setIsTokenValid(false)
                } else {
                    setIsError(true)
                }
            }
            // Make the user flow more ease
            setTimeout(() => {
                setIsLoading(false);
            }, 0.75 * 1000)
        }

        const sendDeviceToken = async () => {
            let permission = Notification.permission
            if (!("Notification" in window)) {
                // Check if the browser supports notifications
                alert("This browser does not support desktop notification");
            } else if (permission === "default") {
                permission = await Notification.requestPermission()
                // Handle Default case, which the browser won't reload after choosing notification setting
                setNotificationStatus(permission)
            }
            if (permission === "granted") {
                try {
                    // Ignore the 404 response from firebase after every notification permission reset or opt-in 
                    // Because Firebase tries to delete the old token when creating a new token but somehow the old token could not be found
                    const deviceToken = await getToken(messaging, { vapidKey: VITE_APP_VAPID_KEY });
                    const response = await axios.post(
                        'http://localhost:8080/users/devices',
                        { deviceToken: deviceToken, userId: decoded.sub },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    )
                    console.log(response.data)
                } catch (error) {
                    setIsError(true)
                }
            }
        }

        sendDeviceToken()
        fetchUser()
    }, [])

    const handleOpen = () => {
        setOpen(true)
    }

    const handleCloseUserProfile = () => {
        setOpen(false)
    }


    if (isError) return <Navigate to='/500' replace={true} />
    if (isLoading) return <Loading />

    return (
        <Fragment>
            <Box component='main'>
                <Stack direction="row" gap={0}>
                    <Stack direction='column' justifyContent='space-between'>
                        <Tabs
                            orientation="vertical"
                            value={chatTab}
                            onChange={(event, newValue) => {
                                console.log(newValue)
                                setChatTab(newValue)
                            }}
                        >
                            <StyledTab
                                sx={{ alignItems: 'flex-start', marginTop: '-1px' }}
                                value={0}
                                label={
                                    <Stack direction='row' gap={1} alignItems='center'>
                                        <ConnectWithoutContactOutlinedIcon fontSize="large" sx={{ color: '#674188', width: 35, height: 35 }} />
                                        <Typography sx={{
                                            textTransform: 'none',
                                            color: '#674188',
                                            fontWeight: '500'
                                        }}>
                                            Friends
                                        </Typography>
                                    </Stack>
                                } />

                            {friends.map((friend, index) => (
                                <StyledTab
                                    sx={{ alignItems: 'flex-start' }}
                                    value={friend.id}
                                    key={index}
                                    label={
                                        <Stack direction='row' gap={1} alignItems='center'>
                                            <StyledBadge dot={true}>
                                                <Avatar
                                                    src='/src/assets/avatar/doggo.jpg'
                                                    sx={{ width: 35, height: 35 }}
                                                >
                                                </Avatar>
                                            </StyledBadge>
                                            <Typography sx={{
                                                textTransform: 'none',
                                            }}>
                                                {friend.nickname}
                                            </Typography>
                                        </Stack>
                                    } />

                            ))}
                        </Tabs>

                        <Stack>
                            <Alert severity="" color='' variant="">
                                <NotificationStatus status={notificationStatus} setNotificationStatus={setNotificationStatus} />
                            </Alert>
                            <ProfileSettingButton handleOpen={handleOpen} user={user} />
                        </Stack>
                    </Stack>


                    <FriendPanelContainer
                        value={chatTab}
                        index={0}
                        setFriends={setFriends}
                        friends={friends}
                        setChatTab={setChatTab}
                        inComingRequests={inComingRequests}
                        setInComingRequests={setInComingRequests}
                        outGoingRequests={outGoingRequests}
                        setOutGoingRequests={setOutGoingRequests}
                    />

                    {/* Index + 1 is used to skip through the first friend tab */}
                    {friends.map((friend, index) => (
                        <ChatBox key={index} value={chatTab} index={friend.id} friend={friend}>
                            {friend.nickname}
                        </ChatBox>
                    ))}
                </Stack>

                <UserProfile
                    open={open}
                    handleClose={handleCloseUserProfile}
                    user={user}
                    setUser={setUser}
                    setIsLoading={setIsLoading}
                    setIsError={setIsError}
                />
            </Box>

            <Dialog open={!isTokenValid}>
                <Box sx={{
                    backgroundColor: 'white',
                    padding: 4,
                    borderRadius: '10px',
                }}>
                    <Typography sx={
                        {
                            fontSize: '25px',
                            fontWeight: '400',
                            textAlign: 'center',
                            marginBottom: '20px'
                        }}>
                        Your token has been expiered
                        <br />
                        or may have become invalid
                    </Typography>
                    <Stack direction='row' justifyContent='space-around'>
                        <LoadingButton isLogOut={true} />
                    </Stack>
                </Box>
            </Dialog>

            <NotificationToast open={newNotif} data={notificationData} handleClose={handleCloseNotification} />
        </Fragment >
    )
}

const NotificationToast = ({ open, handleClose, data }) => {
    return (
        <Snackbar
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            autoHideDuration={8000}
            sx={{
                backgroundColor: 'white',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                padding: '22px 20px 22px 20px',
                borderLeft: '8px solid #674188',
                maxWidth: '400px'
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
                            width: '200px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        }}>
                            {data.title}
                        </Typography>
                        <Typography
                            sx={{
                                width: '200px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}>
                            {data.body}
                        </Typography>
                    </Stack>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            width: 40, height: 40,
                        }}>
                        <ClearIcon color='primary' />
                    </IconButton>
                </Stack>
            </Box>
        </Snackbar >
    )
}


const StyledTab = styled(Tab)(() => ({
    width: '270px',
    padding: '5px 80px 5px 10px',
    margin: '1px 0',
    transition: "all 0.2s ease-in-out",
    "&.Mui-selected": {
        backgroundColor: '#674188',
        "& p": {
            color: 'white',
        },
        "& svg": {
            color: 'white',
        },
    },
}))

