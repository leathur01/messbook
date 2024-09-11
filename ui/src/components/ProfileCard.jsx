import { Avatar, Box, Button, Card, CardMedia, Grid, Stack, Typography } from "@mui/material";
import StyledBadge from "./StyledBadge";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import React from "react";

const ProfileCard = ({ friend }) => {
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
            <StyledBadge dot={false}>
                <Avatar
                    alt="Remy Sharp"
                    src="/src/assets/avatar/doggo.jpg"
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
                    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
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
                        <MutualFriend />
                    </ProfileTab>
                </Box>
            </Box>
        </Card >
    )
}

const MutualFriend = () => {
    return (
        <Button
            variant="contained"
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start'
            }}>
            <Stack direction='row' alignItems='center' gap={1}>
                <StyledBadge dot={true}>
                    <Avatar src='/src/assets/avatar/doggo.jpg'
                        sx={{ width: 50, height: 50, border: 'solid ', borderColor: 'primary.main' }}
                    />
                </StyledBadge>

                <Typography sx={{
                    fontWeight: '400',
                    textTransform: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                }}>
                    buidoicholon
                </Typography>
            </Stack>
        </Button>
    )
}

const AboutMe = ({ friend }) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Box>
                    <Typography variant='subtitle2' sx={{ fontWeight: '400' }}>
                        About Me
                    </Typography>

                    <Typography variant="subtitle11" sx={{ fontWeight: '300' }}>
                        {friend.bio}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box>
                    <Typography variant='subtitle2' sx={{ fontWeight: '400' }}>
                        Member Since
                    </Typography>

                    <Typography variant="subtitle11" sx={{ fontWeight: '300' }}>
                        Aug 21, 2023
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

