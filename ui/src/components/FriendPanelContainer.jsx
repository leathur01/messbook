import { Typography, Box, Badge } from "@mui/material";
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

const friendTabLabels = ['Online',]

export default function FriendPanelContainer({
    value,
    index,
    setFriends,
    friends,
    setChatTab,
    inComingRequests, setInComingRequests,
    outGoingRequests, setOutGoingRequests
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
                                    // fontSize: '16px'                                        
                                }}>
                                    {label}
                                </Typography>
                            }
                        />
                    ))}
                    <Tab
                        label={
                            <Typography sx={{
                                textTransform: 'none',
                            }}>
                                All
                            </Typography>
                        }
                    />
                    <Tab
                        label={
                            <Badge badgeContent={inComingRequests.length} color="error">                                                        
                                <Typography sx={{
                                    textTransform: 'none',
                                }}>
                                    Pending
                                </Typography>
                            </Badge>
                        }
                    />
                    <Tab
                        label={
                            <Typography sx={{
                                textTransform: 'none',
                            }}>
                                Add Friend
                            </Typography>
                        }
                    />
                </Tabs>

                {friendTabLabels.map((label, index) => (
                    <FriendPanel
                        key={index}
                        value={friendTab}
                        index={index}
                        setFriendTab={setFriendTab}
                    >
                        {label}
                    </FriendPanel>
                ))}

                <FriendPanel value={friendTab} index={1} setFriendTab={setFriendTab}>
                    <AllFriendsTab friends={friends} setChatTab={setChatTab} setFriends={setFriends} />
                </FriendPanel>

                <FriendPanel value={friendTab} index={2} setFriendTab={setFriendTab} >
                    <FriendRequestTab
                        inComingRequests={inComingRequests}
                        outGoingRequests={outGoingRequests}
                        setInComingRequests={setInComingRequests}
                        setOutGoingRequests={setOutGoingRequests}
                        setFriends={setFriends}
                    />
                </FriendPanel>

                <FriendPanel value={friendTab} index={3} setFriendTab={setFriendTab}>
                    <AddFriendTab
                        inComingRequests={inComingRequests}
                        setOutGoingRequests={setOutGoingRequests}
                        setInComingRequests={setInComingRequests}
                        setFriends={setFriends} />
                </FriendPanel>
            </Box>
        )
    );
}


