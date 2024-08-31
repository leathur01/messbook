import { Button, CircularProgress } from "@mui/material";
import { useAuth } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";

const LoadingButton = ({ isLogOut = false, isSubmit = false, label, handleClick }) => {
    const { setToken } = useAuth()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)


    const handleLogOut = () => {
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
                            setTimeout(()=>{
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
                            setTimeout(()=>{
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