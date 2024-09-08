import { Avatar, Box, Button, Dialog, IconButton, Stack, Typography } from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import StyledBadge from "./StyledBadge";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useState } from "react";
import FetchingButton from "./FetchingButton";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";

const AllFriendsTab = ({ friends, setChatTab, setFriends }) => {
    const [isDeleted, setIsDeleted] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState({})
    const { token } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const total = friends.length

    const handleRemove = async () => {
        setIsLoading(true)
        try {
            await axios.delete(
                `http://localhost:8080/users/self/friends/${selectedFriend.id}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )

            const response = await axios.get(
                `http://localhost:8080/users/self/friends`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            setFriends(response.data)
            setTimeout(() => {
                setIsDeleted(false)
                setIsLoading(false)
            }, 0.75 * 1000)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box>
            <Typography sx={{ fontWeight: '500', fontSize: '18px', marginBottom: '8px' }}>
                {'ALL FRIENDS - ' + total}
            </Typography>
            {friends.map((friend, index) => {
                return (
                    <Stack direction='row' alignItems='center' justifyContent='space-between'
                        key={index}
                        sx={{
                            borderTop: '1px solid #674188',
                            padding: '10px 0'
                        }}>
                        <Stack direction='row' gap={2}>
                            <StyledBadge dot={true}>
                                <Avatar src='/src/assets/avatar/doggo.jpg'
                                    sx={{ width: 50, height: 50, border: 'solid ', borderColor: 'success.light' }}
                                />
                            </StyledBadge>
                            <Stack>
                                <Typography sx={{
                                    fontWeight: '500',
                                    width: '200px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                }}>
                                    {friend.nickname}
                                </Typography>
                                <Typography
                                    sx={{
                                        width: '200px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}>
                                    Offline/Online
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack direction='row'>
                            <IconButton
                                onClick={() => { setChatTab(friend.id) }}
                                sx={{
                                    width: 40, height: 40,
                                }}>
                                <ChatIcon color='primary' />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    setSelectedFriend(friend)
                                    setIsDeleted(true)
                                }}
                                sx={{
                                    width: 40, height: 40,
                                }}>
                                <PersonRemoveIcon color='error' />
                            </IconButton>
                        </Stack>

                    </Stack>
                )
            })}

            <Dialog open={isDeleted}
                onClose={() => {
                    setIsDeleted(false)
                    setSelectedFriend({})
                }}>
                <Box sx={{
                    backgroundColor: 'white',
                    padding: '20px 20px',
                    borderRadius: '10px',
                    width: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                }}>
                    <Typography sx={
                        {
                            fontSize: '25px',
                            fontWeight: '400',
                            textAlign: 'center',
                            marginBottom: '10px'
                        }}>
                        Remove &apos;{selectedFriend.nickname}&apos;
                    </Typography>
                    <Typography>
                        Are you sure you want to remove
                        <Typography component={'span'} sx={{ display: 'inline', fontWeight: '500' }}>
                            &nbsp;{selectedFriend.nickname}&nbsp;
                        </Typography>
                        from your friends permanently?
                    </Typography>
                    <Stack direction='row' justifyContent='space-around' spacing={3}
                        sx={{ alignSelf: 'flex-end', marginTop: '30px' }}>
                        <Button
                            onClick={() => { setIsDeleted(false) }}
                            sx={{
                                fontWeight: '500',
                                color: '#686868',
                            }}>
                            Cancle
                        </Button>
                        <FetchingButton
                            label='Remove Friend'
                            isError={true}
                            handleClick={handleRemove}
                            isLoading={isLoading}
                            extendedStyle={{ width: '150px' }}
                        />
                    </Stack>
                </Box>
            </Dialog>
        </Box>
    )
}

export default AllFriendsTab