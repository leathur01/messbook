import { Button } from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress';

const FetchingButton = ({ isLoading, label }) => {
    return (
        <Button
            type='submit'
            variant='contained'
            sx={{ mt: 3, mb: 2, height: '40px', width: '100%' }}
        >
            {isLoading ? (
                <CircularProgress size={20} color='success' sx={{ color: 'white' }} />
            ) : label}
        </Button>
    )
}

export default FetchingButton