import { Alert, Avatar, Box, Button, Dialog, Fab, Grid, Snackbar, Stack, Typography } from "@mui/material"
import WhiteWrapper from "../components/WhiteWrapper"
import ProfileField from "../components/ProfileField";
import StyledBadge from "../components/StyledBadge";
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import NicknameForm from "../components/NicknameForm";
import PasswordForm from "../components/PasswordForm";
import AccountRemovalForm from "../components/AccountRemovelForm";

const UserProfile = ({ open = true, handleClose, user, setIsLoading, setIsError, setUser }) => {
    const { token } = useAuth()
    const [nicknameForm, setNicknameFormOpen] = useState(false)
    const [passwordForm, setPasswordFormOpen] = useState(false)
    const [RemovalForm, setRemovalFormOpen] = useState(false)
    const [initialBio] = useState(user.bio)
    const [currentBio, setcurrentBio] = useState(user.bio)
    const [isChanged, setIsChanged] = useState(false)

    const handleUpdate = () => {
        const updatedUser = {
            bio: currentBio.trim()
        }

        const updateUser = async () => {
            setIsError(false)
            setIsLoading(true)

            let decoded = jwtDecode(token)
            try {
                const response = await axios.put(
                    `http://localhost:8080/users/${decoded.sub}`, updatedUser,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                )

                setUser(response.data)
            } catch (error) {
                setIsError(true)
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 0.75 * 1000)
        }

        updateUser()
    }

    const handleBioChange = (e) => {
        if (e.target.value !== initialBio) {
            setIsChanged(true)
            setcurrentBio(e.target.value)
        } else {
            setIsChanged(false)
            setcurrentBio(e.target.value)
        }
    }

    return (
        <Dialog open={open} component='main' sx={{
            backgroundColor: 'primary.main',
            height: '100vh',
            padding: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <WhiteWrapper >
                <Fab
                    size='small'
                    color='primary'
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        border: 'solid white',
                        top: '8px',
                        right: '8px',
                    }}>
                    <ClearIcon />
                </Fab>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '20px'
                }}>
                    <Box>
                        <StyledBadge dot={false}>
                            <Avatar
                                alt="Remy Sharp"
                                src="/src/assets/avatar/doggo.jpg"
                                sx={{
                                    width: 100,
                                    height: 100,
                                    border: 'solid ',
                                    borderColor: 'primary.main'
                                }}
                            >
                            </Avatar>
                        </StyledBadge >

                        <Typography variant="body" component="h1" sx={{
                            fontWeight: '300',
                            marginTop: '10px',
                            marginLeft: '10px',
                            marginBottom: '5px'
                        }}>
                            {user.nickname}
                        </Typography>
                    </Box>

                    <label>
                        <Typography variant='subtitle2' sx={{ fontWeight: '400' }}>
                            ABOUT ME
                        </Typography>
                        <textarea
                            value={currentBio}
                            onChange={handleBioChange}
                            style={{
                                resize: 'none',
                                width: '',
                                height: '100px',
                                backgroundColor: '#F7EFE5',
                                borderWidth: '0',
                                borderRadius: '2px',
                                boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                                padding: '8px 10px'

                            }} />
                    </label>
                </Box>

                <Box sx={{
                    backgroundColor: '#C8A1E0',
                    padding: 2,
                    borderRadius: '8px',
                    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
                }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <ProfileField field='NICKNAME' value={user.nickname} button='EDIT' handleClick={() => { setNicknameFormOpen(true) }} />
                        </Grid>
                        <Grid item xs={12}>
                            <ProfileField field='EMAIL' value={user.email} hasButton={false} />
                        </Grid>
                        <Grid item xs={12}>
                            <ProfileField field='PASSWORD' value='' button='CHANGE PASSWORD' handleClick={() => { setPasswordFormOpen(true) }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <Box>
                                    <Typography variant='subtitle2' sx={{ fontWeight: '400' }}>
                                        ACCOUNT REMOVAL
                                    </Typography>
                                </Box>

                                {/* The Box element is needed to use the size prop */}
                                <Box>
                                    <Button variant='contained' size='small' color="error" onClick={() => { setRemovalFormOpen(true) }}>
                                        Delete Account
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </WhiteWrapper >

            <Snackbar
                open={isChanged}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity=""
                    color='warning'
                    variant="filled"
                    sx={{
                        width: '100%',
                        minWidth: '420px',
                    }}
                >
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography sx={{ marginRight: '25px' }}>
                            You are changing your profile
                        </Typography>
                        <Button onClick={() => {
                            setcurrentBio(initialBio)
                            setIsChanged(false)
                        }}>
                            Reset
                        </Button>
                        <Button onClick={handleUpdate}>
                            Update
                        </Button>
                    </Stack>
                </Alert>
            </Snackbar>

            <NicknameForm
                open={nicknameForm}
                handleClose={() => { setNicknameFormOpen(false) }}
                setUser={setUser}
                user={user}
            />

            <PasswordForm
                open={passwordForm}
                handleClose={() => { setPasswordFormOpen(false) }}
            />

            <AccountRemovalForm
                open={RemovalForm}
                handleClose={() => { setRemovalFormOpen(false) }}
            />
        </Dialog >
    )
}

export default UserProfile