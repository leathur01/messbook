import { Avatar, Box, Card, CardMedia, Grid, Typography } from "@mui/material";
import { getUserAvatarUrl } from "../services/userClient";
import { memo } from "react";

const SideProfile = ({ friend, handleOpenProfile }) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    const createdAt = new Date(friend.createdAt)
    const memberSince = createdAt.toLocaleDateString('en-us', options)

    return (
        <Card sx={{
            height: '100vh',
            borderRadius: '0px'
        }}>
            <Box sx={{
                height: '140px',
                transition: '.3s ease',
                '&:hover': {
                    height: '150px',
                    cursor: 'pointer',
                }
            }}>
                <CardMedia component='img'
                    onClick={handleOpenProfile}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        border: 'solid',
                        borderTop: '0',
                        borderBottom: '1',
                        borderRight: '0',
                        borderLeft: '0',
                        borderColor: 'primary.main',
                        transition: '.3s ease',                        
                    }}
                    src={getUserAvatarUrl(friend.id)}
                />
            </Box>
            <OptimizedUserAvatar userId={friend.id} handleOpenProfile={handleOpenProfile} />        
            <Box sx={{ margin: '5px 28px' }}>
                <Typography
                    onClick={() => {
                        handleOpenProfile()
                    }}
                    sx={{
                        fontWeight: '500',
                        marginBottom: '5px',
                        fontSize: '35px',
                        '&:hover': {
                            opacity: '0.8',
                            cursor: 'pointer'
                        }
                    }}>
                    {friend.nickname}
                </Typography>

                <Box sx={{
                    // margin: '15px 15px',
                    backgroundColor: '#C8A1E0',
                    padding: 2,
                    margin: '0 2px',
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
                }}>
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
                                    {memberSince}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Card>
    )
}

const OptimizedUserAvatar = memo(function OptimizedUserAvatar({ userId, handleOpenProfile }) {
    return (
        <Avatar
            onClick={handleOpenProfile}
            alt="Remy Sharp"
            src={getUserAvatarUrl(userId)}
            sx={{
                width: 90,
                height: 90,
                marginTop: '-40px',
                marginLeft: '10px',
                border: 'solid ',
                borderColor: 'primary.main',
                transition: '.3s ease',
                '&:hover': {
                    cursor: 'pointer',
                    width: 95,
                    height: 95,
                }
            }}
        >
        </Avatar>
    )
})

export default SideProfile