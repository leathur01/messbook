import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import { Alert, Collapse, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Fragment, useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';
import Loading from './Loading';
import CircularProgress from '@mui/material/CircularProgress';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
	const initialFormData = {
		email: '',
		password: '',
	}
	const navigate = useNavigate()

	// Hide the left side when the screen is smaller than 600px
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [errors, setErrors] = useState({});
	const [formData, setFormData] = useState(initialFormData)
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState(false)
	const [loadingScreen, setLoadingScreen] = useState(true)
	const { setToken, setIsActivated } = useAuth();

	// Access the website
	setTimeout(() => {
		setLoadingScreen(false);
	}, 0.75 * 1000)

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value
		})
	}

	const validateEmpty = () => {
		const newErrors = {}
		if (!formData.email) newErrors.email = 'Please enter your email address'
		if (!formData.password) newErrors.password = 'Please enter your password'
		return newErrors
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const validationErrors = validateEmpty();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
		} else {
			setIsLoading(true)
			setIsError(false)
			const login = async () => {
				try {
					let response = await axios.post('http://localhost:8080/log-in', formData)
					const token = response.data.authenticationToken
					let decoded = jwtDecode(token)
					response = await axios.get(
						`http://localhost:8080/users/${decoded.sub}`,
						{
							headers: {
								'Authorization': `Bearer ${token}`
							}
						}
					)
					const user = response.data
					setIsActivated(user.activated)
					setToken(token)
					navigate('/')
					setIsLoading(false)
				} catch (error) {
					const loginErrors = error.response.data.errors.error
					if (loginErrors) {
						setErrors({ error: loginErrors })
						setFormData({ ...formData, password: '' })
						setTimeout(() => {
							setIsLoading(false)
						}, 0.75 * 1000)
						// Close the error feedback after 4s
						setTimeout(() => {
							setErrors({})
						}, 4 * 1000)
					} else {						
						setIsError(true)
					}
				}
			}

			login()
		}
	};

	if (isError) return <Navigate to='/500' replace={true} />

	return (
		<Fragment>
			{loadingScreen ? (
				<Loading />
			) : (
				<Grid container component="main" sx={{ height: '100vh' }}>
					<Grid
						item
						xs={false}
						sm={4}
						md={7}
						sx={{
							backgroundColor: 'primary.main',
							backgroundSize: 'cover',
							backgroundPosition: 'left',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						{!isSmallScreen && (
							<Diversity1OutlinedIcon sx={{ fontSize: 150, color: 'white' }} />
						)}
					</Grid>
					<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square
						sx={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<Box
							sx={{
								my: 8,
								mx: 4,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								width: '600px'
							}}
						>
							<Diversity2OutlinedIcon color="primary" sx={{ fontSize: 80 }} />
							<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
								<Box sx={{ width: '100%' }}>
									<Collapse in={!!errors.error}>
										<Alert
											variant="filled"
											severity="error"
											sx={{ mt: 2, fontSize: '16px', textTransform: 'capitalize' }}
											action={
												<IconButton
													aria-label="close"
													color="inherit"
													size="small"
													onClick={() => {
														setErrors({});
													}}
												>
													<CloseIcon fontSize="inherit" />
												</IconButton>
											}
										>
											{errors.error}.
										</Alert>
									</Collapse>
								</Box>
								<TextField
									margin="normal"
									fullWidth
									label="Email Address"
									name="email"
									autoComplete="email"
									autoFocus
									onChange={handleInputChange}
									error={!!errors.email}
									helperText={errors.email}
									value={formData.email}
								/>
								<TextField
									margin="normal"
									fullWidth
									name="password"
									label="Password"
									type="password"
									autoComplete="password"
									onChange={handleInputChange}
									value={formData.password}
									error={!!errors.password}
									helperText={errors.password}
								/>
								<FormControlLabel
									control={<Checkbox value="remember" color="primary" />}
									label="Remember me"
								/>
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
										<CircularProgress size={20} sx={{ color: 'white' }} />
									) : 'Log in'}
								</Button>
								<Grid container>
									<Grid item xs>
										<Link href="#" variant="body2">
											Forgot password?
										</Link>
									</Grid>
									<Grid item>
										<Link href="/register" variant="body2">
											{"Don't have an account? Register now"}
										</Link>
									</Grid>
								</Grid>
							</Box>
						</Box>
					</Grid>
				</Grid>
			)}
		</Fragment>

	);
}

export default Login