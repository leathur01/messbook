import {  Grid, Paper } from "@mui/material";
import SideProfile from "./SideProfile";

const ChatBox = ({ children, value, index }) => {
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
                    <SideProfile/>
                </Grid>
            </Grid >
        )
    );
};


export default ChatBox