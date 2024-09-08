import { Button } from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress';

const FetchingButton = ({
    label,
    isLoading,
    isError = false,
    isSuccess = false,
    extendedStyle,
    handleClick
}) => {
    return (
        <Button
            onClick={handleClick}
            color={isSuccess ? 'success' : (isError ? 'error' : 'primary')}
            type='submit'
            variant='contained'
            sx={{ mt: 3, mb: 2, height: '40px', width: '100%', ...extendedStyle }}
        >
            {isLoading ? (
                <CircularProgress size={20} color='success' sx={{ color: 'white' }} />
            ) : label}
        </Button>
    )
}

export default FetchingButton