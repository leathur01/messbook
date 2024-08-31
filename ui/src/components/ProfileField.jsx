import { Box, Button, Typography } from "@mui/material"

const ProfileField = ({field, value, hasButton=true, button, handleClick}) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <Box>
                <Typography variant='subtitle2' sx={{ fontWeight: '400' }}>
                    {field}
                </Typography>

                <Typography variant="subtitle11" sx={{ fontWeight: '300' }}>
                    {value}
                </Typography>
            </Box>

            {hasButton && (
                // The Box element is needed to use the size prop
                <Box>
                    <Button variant='contained' size='small' onClick={handleClick}>
                        {button}
                    </Button>
                </Box>
            )}          
        </Box>
    )
}

export default ProfileField