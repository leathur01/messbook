import { Button, CircularProgress } from "@mui/material";
import { useAuth } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const LoadingButton = ({ isLogOut = false, isSubmit = false, label, handleClick }) => {
    const { setToken, token } = useAuth()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)


    const handleLogOut = () => {
        const decoded = jwtDecode(token)
        const currentDeviceToken = localStorage.getItem('deviceToken')
        axios.delete(
            'http://localhost:8080/users/devices', {
            headers: { 'Authorization': `Bearer ${token}` },
            data: { deviceToken: currentDeviceToken, userId: decoded.sub }
        })
        setToken()
        navigate('/', { replace: true })
    }

    return (
        <Fragment>
            {isSubmit ? (
                <Button
                    type='submit'
                    color={isLogOut ? 'error' : 'primary'}
                    variant='contained'
                    onClick={() => {
                        setIsLoading(true)
                        if (isLogOut) {
                            setTimeout(handleLogOut, 0.75 * 1000);
                        } else {
                            setTimeout(() => {
                                setIsLoading(false)
                            }, 0.75 * 1000)
                        }
                    }}
                    sx={{ width: '100px', height: '40px' }}
                >
                    {isLoading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                    ) : isLogOut ? 'Log out' : label}
                </Button>
            ) : (
                <Button
                    color={isLogOut ? 'error' : 'primary'}
                    variant='contained'
                    onClick={() => {
                        setIsLoading(true)
                        if (isLogOut) {
                            setTimeout(handleLogOut, 0.75 * 1000);
                        } else {
                            setTimeout(() => {
                                handleClick()
                                setIsLoading(false)
                            }, 0.75 * 1000)
                        }
                    }}
                    sx={{ width: '100px', height: '40px' }}
                >
                    {isLoading ? (
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                    ) : isLogOut ? 'Log out' : label}
                </Button>
            )}
        </Fragment>
    )
}

export default LoadingButton