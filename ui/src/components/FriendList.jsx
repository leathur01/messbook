import { Avatar, Button, IconButton, Stack, Typography } from "@mui/material"
import { Fragment, memo } from "react"
import ChatIcon from '@mui/icons-material/Chat';
import StyledBadge from "./StyledBadge";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { getUserAvatarUrl } from "../services/userClient"

const FriendList = memo(function FriendList({ friends, setSelectedFriend, setViewProfile, setChatTab, setIsDeleted }) {
    return (
        <Fragment>
            {friends.map((friend, index) => {
                return (
                    <Stack direction='row' alignItems='center' gap={1} justifyContent='space-between'
                        key={index}
                        sx={{
                            padding: '5px 0',
                        }}>
                        <Button
                            onClick={() => {
                                setSelectedFriend(friend)
                                setViewProfile(true)
                            }}
                            variant='contained'
                            sx={{
                                textTransform: 'none',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'flex-start',
                            }}>
                            <Stack direction='row' gap={1}>
                                <StyledBadge dot={true}>
                                    <Avatar src={getUserAvatarUrl(friend.id)}
                                        sx={{ width: 50, height: 50, border: 'solid ', borderColor: 'primary.main' }}
                                    />
                                </StyledBadge>

                                <Stack justifyContent='center' sx={{ textAlign: 'left' }}>
                                    <Typography sx={{
                                        fontWeight: '400',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {friend.nickname}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '12px',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}>
                                        Offline/Online
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Button>

                        <Stack direction='row' alignItems='center'
                            sx={{
                                height: '64px',
                                borderRadius: '5px',
                                backgroundColor: '#F5F7F8',
                                padding: '0px 10px'
                            }}>
                            <IconButton
                                onClick={() => { setChatTab(friend.id) }}
                                sx={{
                                    width: 40, height: 40,
                                }}>
                                <ChatIcon sx={{ color: 'primary.main' }} />
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
        </Fragment>
    )
})

export default FriendList