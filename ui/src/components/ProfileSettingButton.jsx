import { Stack, Typography, Avatar, Button, Menu, MenuItem, ListItemIcon, Box, Dialog } from "@mui/material"
import StyledBadge from "./StyledBadge"
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import React, { Fragment, useState } from "react"
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import LoadingButton from "./LoadingButton";

export default function ProfileSettingButton({ handleOpen, user }) {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [isLogOut, setIsLogOut] = useState(false)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <Fragment>
            <Button
                onClick={handleClick}
                sx={{

                    color: 'white',
                    padding: '0',
                    margin: '0',
                    display: 'block',
                    backgroundColor: '#674188',
                    borderRadius: '0px',
                    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                    '&:hover': {
                        opcaity: '0.9',
                        color: '#674188'
                    },
                }}>
                <Stack
                    direction='row'
                    spacing={1}
                    alignItems='center'
                    justifyContent='space-between'
                    sx={{ padding: '10px 30px 10px 10px' }}
                >
                    <Stack
                        direction='row'
                        gap={2}
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <StyledBadge dot={true}>
                            <Avatar
                                src='/src/assets/avatar/doggo.jpg'
                                sx={{ width: 40, height: 40 }}
                            >
                            </Avatar>
                        </StyledBadge>

                        <Typography sx={{
                            textTransform: 'none',
                            fontWeight: '500',
                            fontSize: '16px',
                            width: '80px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            textAlign: 'left'
                        }}>
                            {user.nickname}
                        </Typography>
                    </Stack>

                    <ManageAccountsIcon sx={{ justifySelf: 'flex-end', width: 30, height: 30 }} />
                </Stack>
            </Button>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Box>
                    <MenuItem onClick={() => {
                        handleClose()
                        handleOpen()
                    }}>
                        <ListItemIcon>
                            <EditIcon sx={{ color: '#674188' }} />
                        </ListItemIcon>
                        <Typography color='primary.main' sx={{ fontSize: '18px', fontWeight: '400' }}>Edit profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { setIsLogOut(true) }}>
                        <ListItemIcon>
                            <LogoutIcon color='error' sx={{ color: 'error' }} />
                        </ListItemIcon>
                        <Typography color='error' sx={{ fontSize: '18px', fontWeight: '400' }}>Log out</Typography>
                    </MenuItem>
                </Box>
            </Menu>

            <Dialog open={isLogOut} onClose={() => { setIsLogOut(false) }}>
                <Box sx={{
                    backgroundColor: 'white',
                    padding: 4,
                    borderRadius: '10px',
                }}>
                    <Typography sx={
                        {
                            fontSize: '25px',
                            fontWeight: '400',
                            textAlign: 'center',
                            marginBottom: '20px'
                        }}>
                        Are you sure you want to log out?
                    </Typography>
                    <Stack direction='row' justifyContent='space-around'>
                        <Button
                            onClick={() => { setIsLogOut(false) }}
                            sx={{
                                fontWeight: '500',
                                color: '#686868'
                            }}>
                            Cancle
                        </Button>
                        <LoadingButton isLogOut={true}/>
                    </Stack>
                </Box>
            </Dialog>
        </Fragment >

    )
}
