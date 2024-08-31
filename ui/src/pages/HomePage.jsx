import React, { Fragment, useEffect, useState } from "react";
import { Stack, Tabs, Tab, Typography, Box, styled, Avatar, Dialog } from "@mui/material";
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

const tabData = [
    {
        nickname: 'doggo',
        avatar: '/src/assets/avatar/doggo.jpg'
    },
    {
        nickname: 'ha',
        avatar: '/src/assets/avatar/doggo.jpg'
    },
    {
        nickname: 'KN',
        avatar: '/src/assets/avatar/doggo.jpg'
    },
];

export default function HomePage() {
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = useState(false)
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const { token, setIsActivated } = useAuth()
    const [isTokenValid, setIsTokenValid] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            setIsError(false)
            setIsLoading(true)

            let decoded = jwtDecode(token)
            try {
                const response = await axios.get(
                    `http://localhost:8080/users/${decoded.sub}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                )
                setUser(response.data)
                setIsActivated(response.data.activated)
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

        fetchUser()
    }, [])

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
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
                            value={value}
                            onChange={(_event, newValue) => {
                                setValue(newValue)
                            }}
                        >
                            <StyledTab
                                sx={{ alignItems: 'flex-start', marginTop: '-1px' }}
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

                            {tabData.map((tab, index) => (
                                <StyledTab
                                    sx={{ alignItems: 'flex-start' }}
                                    key={index}
                                    label={
                                        <Stack direction='row' gap={1} alignItems='center'>
                                            <StyledBadge dot={true}>
                                                <Avatar
                                                    src={tab.avatar}
                                                    sx={{ width: 35, height: 35 }}
                                                >
                                                </Avatar>
                                            </StyledBadge>
                                            <Typography sx={{
                                                textTransform: 'none',
                                            }}>
                                                {tab.nickname}
                                            </Typography>
                                        </Stack>
                                    } />

                            ))}
                        </Tabs>

                        <ProfileSettingButton handleOpen={handleOpen} user={user} />
                    </Stack>


                    <FriendPanelContainer value={value} index={0} />

                    {/* Index + 1 is used to skip through the first friend tab */}
                    {tabData.map((tab, index) => (
                        <ChatBox key={index} value={value} index={index + 1}>
                            {tab.nickname}
                        </ChatBox>
                    ))}
                </Stack>

                <UserProfile
                    open={open}
                    handleClose={handleClose}
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
                        <br/>
                        or may have become invalid
                    </Typography>
                    <Stack direction='row' justifyContent='space-around'>                      
                        <LoadingButton isLogOut={true} />
                    </Stack>
                </Box>
            </Dialog>
        </Fragment >


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

