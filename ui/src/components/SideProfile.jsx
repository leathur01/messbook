import { Avatar, Box, Card, CardMedia, Grid, Typography } from "@mui/material";
import StyledBadge from "./StyledBadge";

export default function SideProfile({ friend }) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    const createdAt = new Date(friend.createdAt)
    const memberSince = createdAt.toLocaleDateString('en-us', options)

    return (
        <Card sx={{
            height: '100vh',
            borderRadius: '0px'
        }}>
            <CardMedia
                sx={{
                    height: 140,
                    border: 'solid',
                    borderTop: '0',
                    borderBottom: '1',
                    borderRight: '0',
                    borderLeft: '0',
                    borderColor: 'primary.main'
                }}
                image='/src/assets/avatar/doggo.jpg'
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
                    fontWeight: '500',
                    marginBottom: '5px',
                    fontSize: '35px'
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