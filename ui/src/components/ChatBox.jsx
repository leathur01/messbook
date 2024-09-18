import { Dialog, Grid, Paper } from "@mui/material";
import SideProfile from "./SideProfile";
import ProfileCard from "./ProfileCard";
import { useState } from "react";

const ChatBox = ({ children, value, index, friend }) => {
    const [viewProfile, setViewProfile] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState(friend)

    const handleOpenFriendProfile = () => {
        setSelectedFriend(friend)
        setViewProfile(true)
    }

    return (
        value === index && (
            <Grid container spacing={0}>
                <Grid item xs={9}>
                    <Paper elevation={1} sx={{
                        p: 3,
                        borderRadius: "0px",
                        height: '100vh',
                        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
                    }}>
                        {children}
                    </Paper>
                </Grid>

                <Grid item xs={3}>
                    <SideProfile friend={friend} handleOpenProfile={handleOpenFriendProfile}/>
                </Grid>

                <Dialog open={viewProfile} onClose={() => {
                    setViewProfile(false)
                    // Prevent some data disapeare before the dialog is closed => increase UX
                    setTimeout(() => {
                        setSelectedFriend({})
                    }, 0.1 * 1000)
                }}>
                    <ProfileCard friend={selectedFriend} setSelectedFriend={setSelectedFriend} />
                </Dialog>
            </Grid >
        )
    );
};


export default ChatBox