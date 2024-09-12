import { Typography, Box, Button, Container } from "@mui/material";

const FriendPanelCallOut = ({ setFriendTab }) => {
    return (
        <Container maxWidth="sm" component='main' sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center'
        }}>
            <img
                src="src/assets/sadness.jpg"
                alt="A crying Inside Out character"
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto'
                }} />
            <Typography variant='body' component='h1' sx={
                {
                    fontWeight: '400',
                    textAlign: 'center',
                    marginBottom: '15px'
                }}>
                Go add more friends!
            </Typography>
            <Box sx={{ marginBottom: '10px' }}>
                <Button
                    color='success'
                    variant='contained'
                    size='small'
                    onClick={() => { setFriendTab(2) }}
                >
                    Add Friend
                </Button>
            </Box>
        </Container>
    )
}

export default FriendPanelCallOut