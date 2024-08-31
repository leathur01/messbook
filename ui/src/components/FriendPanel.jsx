import { Paper, Grid, } from "@mui/material";
import FriendPanelCallOut from "./FriendPanelCallOut";

const FriendPanel = ({ children, value, index, setFriendValue }) => {
    return (
        value === index && (
            <Grid container sx={{ flex: '1' }}>
                <Grid item xs={9}>
                    <Paper sx={{
                        p: 3,
                        borderRadius: "0px",
                        height: '100%',
                        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
                    }}>
                        {children}
                    </Paper>
                </Grid>

                <Grid item xs={3}>
                    <FriendPanelCallOut setFriendValue={setFriendValue}/>
                </Grid>
            </Grid >
        )
    )
}

export default FriendPanel