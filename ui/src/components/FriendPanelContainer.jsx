import { Typography, Box } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FriendPanel from "./FriendPanel";
import React from "react";

const friendTabLabels = ['Online', 'All', 'Pending', 'Add Friend']

export default function FriendPanelContainer({ value, index}) {
    const [friendValue, setFriendValue] = React.useState(0)

    const handleChange = (event, newValue) => {
        setFriendValue(newValue)
    }  

    return (
        value === index && (
            <Box sx={{
                height: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Tabs
                    value={friendValue}
                    onChange={handleChange}
                    sx={{
                        width: '100%',
                        paddingLeft: '15px',
                    }}>
                    {friendTabLabels.map((label, index) => (
                        <Tab
                            key={index}
                            label={
                                <Typography sx={{
                                    textTransform: 'none',
                                    // fontSize: '16px'                                        
                                }}>
                                    {label}
                                </Typography>
                            }
                        />
                    ))}
                </Tabs>
                
                {friendTabLabels.map((label, index) => (
                    <FriendPanel
                        key={index}
                        value={friendValue}
                        index={index}
                        setFriendValue={setFriendValue}
                    >
                        {label}
                    </FriendPanel>
                ))}
            </Box>
        )
    );
}


