import { Typography, Box, Grid } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FriendPanel from "./FriendPanel";
import React, { useEffect, useState } from "react";
import AddFriendTab from "./AddFriendTab";
import FriendRequestTab from "./FriendRequestTab";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import AllFriendsTab from "./AllFriendsTab";
import { Navigate } from "react-router-dom";
import SideProfile from "./SideProfile";

const friendTabLabels = ['All', 'Pending', 'Add Friend']

export default function FriendPanelContainer({
    user,
    value,
    index,
    setFriends,
    friends,
    setChatTab,
    inComingRequests, setInComingRequests,
    outGoingRequests, setOutGoingRequests,
    handleOpenUserProfile
}) {
    const [friendTab, setFriendTab] = React.useState(0)
    const { token } = useAuth()
    const [serverError, setServerError] = useState(false)

    const handleChange = (event, newValue) => {
        setFriendTab(newValue)
    }

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                let response = await axios.get(
                    'http://localhost:8080/users/self/friends/requests?direction=incoming',
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                setInComingRequests(response.data)
                response = await axios.get(
                    'http://localhost:8080/users/self/friends/requests?direction=outgoing',
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
                setOutGoingRequests(response.data)
            } catch (error) {
                setServerError(true)
            }
        }

        fetchRequests()
    }, [])

    if (serverError) return <Navigate to='/500' replace={true} />

    return (
        value === index && (
            <Grid container>
                <Grid item xs={9}>
                    <Box sx={{
                        height: '100vh',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Tabs
                            value={friendTab}
                            onChange={handleChange}
                            sx={{
                                width: '100%',
                                paddingLeft: '15px',
                            }}>
                            {friendTabLabels.map((label, index) => (
                                <Tab
                                    key={index}
                                    label={
                                        <Typography sx={{
                                            textTransform: 'none',
                                        }}>
                                            {label}
                                        </Typography>
                                    }
                                />
                            ))}
                        </Tabs>

                        <FriendPanel value={friendTab} index={0} setFriendTab={setFriendTab} currentUser={user}>
                            <AllFriendsTab friends={friends} setChatTab={setChatTab} setFriends={setFriends} />
                        </FriendPanel>

                        <FriendPanel value={friendTab} index={1} setFriendTab={setFriendTab} currentUser={user}>
                            <FriendRequestTab
                                inComingRequests={inComingRequests}
                                outGoingRequests={outGoingRequests}
                                setInComingRequests={setInComingRequests}
                                setOutGoingRequests={setOutGoingRequests}
                                setFriends={setFriends}
                            />
                        </FriendPanel>

                        <FriendPanel value={friendTab} index={2} setFriendTab={setFriendTab} currentUser={user}>
                            <AddFriendTab
                                inComingRequests={inComingRequests}
                                setOutGoingRequests={setOutGoingRequests}
                                setInComingRequests={setInComingRequests}
                                setFriends={setFriends} />
                        </FriendPanel>
                    </Box>
                </Grid>

                <Grid item xs={3}>
                    <SideProfile friend={user} handleOpenProfile={handleOpenUserProfile}/>
                </Grid>
            </Grid>

        )
    );
}


