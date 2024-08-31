import { Box, Button, Container, Typography } from "@mui/material"
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useAuth } from "../provider/AuthProvider";
import LoadingButton from "../components/LoadingButton";

const ErrorPage = () => {
    const navigate = useNavigate();
    const [loadingScreen, setloadingScreen] = useState(true)
    const { token } = useAuth()

    setTimeout(() => {
        setloadingScreen(false);
    }, 0.75 * 1000)

    return (
        <Fragment>
            {loadingScreen ? (
                <Loading />
            ) : (
                <Container maxWidth="sm" component='main' sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100vh',
                    justifyContent: 'center',
                }}>
                    <img
                        src="src/assets/sadness-crying.jpg"
                        alt="A crying Inside Out character"
                        style={{
                            maxWidth: '70%',
                            height: 'auto',
                            display: 'block',
                            margin: '0 auto'
                        }} />

                    <Typography variant='body' component='h1' sx={
                        {
                            fontWeight: '300',
                            textAlign: 'center',
                            marginBottom: '15px'
                        }}>
                        Something is wrong with our server...
                    </Typography>
                    <Box sx={{ marginBottom: '30px' }}>
                        <Button
                            variant='contained'
                            size='small'
                            onClick={() => { navigate('/') }}
                        >
                            Go to your homepage
                        </Button>
                    </Box>
                    {token && (
                        <LoadingButton isLogOut={true} />
                    )}
                </Container>
            )}
        </Fragment>
    )
}

export default ErrorPage