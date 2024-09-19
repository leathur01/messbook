import { Avatar, Box, Button, Card, CardMedia, Grid, Stack, Typography } from "@mui/material";
import StyledBadge from "./StyledBadge";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import React, { Fragment, memo, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../provider/AuthProvider";
import { getUserAvatarUrl } from "../services/userClient";

const OptimizedUserAvatar = memo(function OptimizedUserAvatar({ userId }) {
    console.log('render')
    return (
        <StyledBadge dot={false}>
            <Avatar
                alt="Remy Sharp"
                src={getUserAvatarUrl(userId)}
                sx={{
                    width: 90,
                    height: 90,
                    marginTop: '-40px',
                    marginLeft: '10px',
                    border: 'solid ',
                    borderColor: 'primary.main'
                }}
            >
            </Avatar>
        </StyledBadge >
    )
})

const ProfileCard = ({ friend, setSelectedFriend }) => {
    const [profileTab, setProfileTab] = React.useState(0);

    const handleChange = (event, newValue) => {
        setProfileTab(newValue);
    };

    return (
        <Card sx={{
            width: '430px',
            paddingBottom: '20px'
        }}>
            <CardMedia
                component='div'
                sx={{
                    border: 'solid',
                    borderTop: '0',
                    borderBottom: '1',
                    borderRight: '0',
                    borderLeft: '0',
                    borderColor: 'primary.main',
                    width: '100%',
                    height: '150px',
                    backgroundColor: '#2E073F'
                }}
            />
            <OptimizedUserAvatar userId={friend.id} />
            <Box sx={{ margin: '5px 28px' }}>
                <Typography sx={{
                    fontWeight: '400',
                    marginBottom: '5px',
                    fontSize: '35px'
                }}>
                    {friend.nickname}
                </Typography>

                <Box sx={{
                    // margin: '15px 15px',
                    backgroundColor: '#C8A1E0',
                    padding: '10px 0',
                    height: '300px',
                    margin: '0 2px',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                    overflow: 'auto'
                }}>
                    <Tabs value={profileTab} onChange={handleChange} sx={{ marginBottom: '20px' }}>
                        <Tab label={
                            <Typography sx={{
                                textTransform: 'none',
                                fontWeight: '400'
                            }}>
                                About Me
                            </Typography>
                        } />
                        <Tab label={
                            <Typography sx={{
                                textTransform: 'none',
                                fontWeight: '400'
                            }}>
                                Mutual Friends
                            </Typography>
                        } />
                    </Tabs>
                    <ProfileTab value={profileTab} index={0}>
                        <AboutMe friend={friend} />
                    </ProfileTab>
                    <ProfileTab value={profileTab} index={1}>
                        <MutualFriend friend={friend} setSelectedFriend={setSelectedFriend} setProfileTab={setProfileTab} />
                    </ProfileTab>
                </Box>
            </Box>
        </Card >
    )
}

const MutualFriend = ({ friend, setSelectedFriend, setProfileTab }) => {
    const [mutualFriends, setMutualFriends] = useState([])
    const { token } = useAuth()

    useEffect(() => {
        const fetchMutualFriends = async () => {
            const response = await axios.get(
                `http://localhost:8080/users/self/friends/${friend.id}/mutual`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )

            setMutualFriends(response.data)
        }

        fetchMutualFriends()
    }, [])

    return (
        <Fragment>
            {mutualFriends.map((mutual, index) => {
                return (
                    <Button
                        onClick={() => {
                            setSelectedFriend(mutual)
                            setProfileTab(0)
                        }}
                        key={index}
                        variant="contained"
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            marginBottom: '10px'
                        }}>
                        <Stack direction='row' alignItems='center' gap={1}>
                            <StyledBadge dot={true}>
                                <Avatar src={getUserAvatarUrl(mutual.id)}
                                    sx={{ width: 40, height: 40, border: 'solid ', borderColor: 'primary.main' }}
                                />
                            </StyledBadge>

                            <Typography sx={{
                                fontWeight: '400',
                                textTransform: 'none',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}>
                                {mutual.nickname}
                            </Typography>
                        </Stack>
                    </Button>
                )
            })}
        </Fragment >
    )
}

const AboutMe = ({ friend }) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    const createdAt = new Date(friend.createdAt)
    const memberSince = createdAt.toLocaleDateString('en-us', options)

    return (
        <Grid container spacing={2}>
            {friend?.bio && (
                <Grid item xs={12}>
                    <Box>
                        <Typography variant="subtitle11" sx={{ fontWeight: '300' }}>
                            {friend.bio}
                        </Typography>
                    </Box>
                </Grid>
            )}
            <Grid item xs={12}>
                <Box>
                    <Typography variant='subtitle2' sx={{ fontWeight: '400' }}>
                        Member Since
                    </Typography>

                    <Typography variant="subtitle11" sx={{ fontWeight: '300' }}>
                        {memberSince}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    )
}

const ProfileTab = ({ children, value, index }) => {
    return (
        value === index && (
            <Box sx={{ padding: '0px 20px' }}>
                {children}
            </Box>
        )
    )
}

export default ProfileCard

