import { Dialog, Grid, Paper } from "@mui/material";
import SideProfile from "./SideProfile";
import ProfileCard from "./ProfileCard";
import { useCallback, useState } from "react";

const ChatBox = ({ children, value, index, friend }) => {
    const [viewProfile, setViewProfile] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState(friend)

    // React pattern to pass a function to a component wrapped with memo 
    const handleOpenFriendProfile = useCallback(() => {
        setSelectedFriend(friend)
        setViewProfile(true)
    }, [friend])

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
                    <SideProfile friend={friend} handleOpenProfile={handleOpenFriendProfile} />
                </Grid>

                <Dialog open={viewProfile} onClose={() => {
                    setViewProfile(false)
                    setSelectedFriend({})
                }}>
                    {/* Prevent some data disapeare before the dialog is closed => increase UX */}
                    {viewProfile && (
                        <ProfileCard friend={selectedFriend} setSelectedFriend={setSelectedFriend} />
                    )}
                </Dialog>
            </Grid >
        )
    );
};


export default ChatBox