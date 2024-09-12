import { Paper, } from "@mui/material"

const FriendPanel = ({ children, value, index }) => {
    return (
        value === index && (

            <Paper sx={{
                p: 3,
                borderRadius: "0px",
                height: '100%',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
            }}>
                {children}
            </Paper>

        )
    )
}

export default FriendPanel