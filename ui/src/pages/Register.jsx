import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import WhiteWrapper from '../components/WhiteWrapper';
import CircularProgress from '@mui/material/CircularProgress';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function Register() {
    const navigate = useNavigate()
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        nickname: '',
        phoneNumber: '',
        email: '',
        password: '',
        dateOfBirth: null,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateEmpty = () => {
        const newErrors = {};
        if (!formData.nickname) newErrors.nickname = 'Please enter your nickname';
        if (!formData.email) newErrors.email = 'Please enter your email';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Please enter your phone number';
        if (!formData.password) newErrors.password = 'Please enter your password';
        if (!dateOfBirth) newErrors.dateOfBirth = 'Please enter your date of birth';
        return newErrors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validateEmpty();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setIsLoading(true)
            setIsError(false)
            var selectedDateOfBirth
            if (dateOfBirth) {
                selectedDateOfBirth = dateOfBirth.toISOString().split('T')[0]
            }

            const registeredData = {
                ...formData,
                dateOfBirth: selectedDateOfBirth
            };

            axios
                .post('http://localhost:8080/register', registeredData)
                .then(() => {
                    setIsSuccess(true)
                    setErrors({})
                    // Make time for user to read the success message
                    setTimeout(() => {
                        navigate('/login')
                    }, 2.5 * 1000)
                })
                .catch(error => {
                    if (error.response.data) {
                        setErrors(error.response.data.errors)                        
                        setTimeout(() => {
                            setIsLoading(false)
                        }, 0.75 * 1000)
                    } else {
                        setIsError(true)
                    }
                })
        }
    };

    if (isError) return <Navigate to='/500' />

    return (
        <Box component="main" sx={{
            backgroundColor: 'primary.main',
            height: '100vh',
            padding: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <WhiteWrapper>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Diversity2OutlinedIcon color="primary" sx={{ fontSize: 50, mb: 1 }} />
                    <Typography component="h1" variant="h5">
                        Create an account
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <TextField
                                    name="nickname"
                                    required
                                    fullWidth
                                    label="Nickname"
                                    error={!!errors.nickname}
                                    helperText={errors.nickname}
                                    onChange={handleInputChange}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="phoneNumber"
                                    fullWidth
                                    label="Phone Number"
                                    autoComplete='off'
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                    onChange={handleInputChange}
                                    defaultValue={'+84'}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    autoComplete="new-password"
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Date of birth"
                                    name="dateOfBirth"
                                    value={dateOfBirth}
                                    onChange={(dateOfBirth) => setDateOfBirth(dateOfBirth)}
                                    error={!!errors.dateOfBirth}
                                />
                                <Typography color='error' sx={{
                                    fontSize: '13px',
                                    marginTop: '5px',
                                    marginLeft: '12px'
                                }}
                                >
                                    {errors.dateOfBirth}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Box sx={{ width: '100%' }}>
                            <Collapse in={isSuccess}>
                                <Alert
                                    variant="outlined"
                                    severity="success"
                                    sx={{ mt: 2, fontSize: '16px', textTransform: 'capitalize' }}
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setIsSuccess(false)
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                >
                                    Sign up successfully!
                                </Alert>
                            </Collapse>
                        </Box>
                        {isSuccess ? (
                            <Button
                                variant='contained'
                                color='success'
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    width: '100%',
                                    height: '40px'
                                }}>
                                Moving to login page <CircularProgress size={20} color='success' sx={{ color: 'white', marginLeft: '10px' }} />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    width: '100%',
                                    height: '40px'
                                }}>
                                {isLoading ? (
                                    <CircularProgress size={20} color='success' sx={{ color: 'white' }} />
                                ) : 'Sign up'}
                            </Button>
                        )}
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account?
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </WhiteWrapper>

        </Box>
    );
}