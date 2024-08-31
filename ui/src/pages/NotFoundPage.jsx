import { Box, Button, Container, Typography } from "@mui/material"
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)

    setTimeout(() => {
        setIsLoading(false);
    }, 0.75 * 1000)


    return (
        <Fragment>
            {isLoading ? (
                <Loading />
            ) : (
                <Container maxWidth="sm" component='main' sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100vh',
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
                            fontWeight: '300',
                            textAlign: 'center',
                            marginBottom: '15px'
                        }}>
                        The page you are looking for does not exist!
                    </Typography>
                    <Box sx={{ marginBottom: '10px' }}>
                        <Button
                            variant='contained'
                            size='small'
                            onClick={() => { navigate('/') }}
                        >
                            Go to your homepage
                        </Button>
                    </Box>
                </Container>
            )}
        </Fragment>

    )
}

export default NotFoundPage