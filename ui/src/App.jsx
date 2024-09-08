import Routes from './routes/Routes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthProvider from './provider/AuthProvider.jsx';
import React, { useState } from 'react';
import { Alert, Avatar, Box, CssBaseline, IconButton, Snackbar, Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { onMessage } from 'firebase/messaging';
import { messaging } from './notifications/firebase.js';
import { ClearIcon } from '@mui/x-date-pickers';

const theme = createTheme({
	palette: {
		primary: {
			main: "#674188"
		},
		secondary: {
			main: "#EAE8DC"
		}
	},

});

const App = () => {
	const [newNotif, setNewNotif] = useState(false)
	const [notificationData, setNotificationData] = useState({ title: '', body: '' })

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}

		setNewNotif(false);
	}

	onMessage(messaging, (payload) => {
		setNewNotif(true)
		setNotificationData({ title: payload.data.title, body: payload.data.body })
		console.log('Message received. ', payload);
	});

	return (
		<ThemeProvider theme={theme}>
			<AuthProvider>
				<React.Fragment>
					<CssBaseline />
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Routes />
						<Notification open={newNotif} data={notificationData} handleClose={handleClose} />
					</LocalizationProvider>
				</React.Fragment>
			</AuthProvider>
		</ThemeProvider>
	)
}

export default App

const Notification = ({ open, handleClose, data }) => {
	return (
		<Snackbar
			open={open}
			onClose={handleClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			autoHideDuration={8000}
			sx={{
				backgroundColor: 'white',
				boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
				padding: '22px 20px 22px 20px',
				borderLeft: '8px solid #674188',
				maxWidth: '400px'
			}}>
			{/* Passing the Stack directly to the snackbar results in a materialUI bug, so we wrap it with the Box component*/}
			<Box>
				<Stack gap={3} alignItems='center' direction='row'>
					<Avatar
						src='/src/assets/avatar/doggo.jpg'
						sx={{ width: 60, height: 60 }}
					>
					</Avatar>
					<Stack gap={0}>
						<Typography sx={{
							fontSize: '20px', fontWeight: '500',
							width: '200px',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
						}}>
							{data.title}
						</Typography>
						<Typography
							sx={{
								width: '200px',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis',
							}}>
							{data.body} wanna say hi
						</Typography>
					</Stack>
					<IconButton
						onClick={handleClose}
						sx={{
							width: 40, height: 40,
						}}>
						<ClearIcon color='primary' />
					</IconButton>
				</Stack>
			</Box>
		</Snackbar >
	)
}
