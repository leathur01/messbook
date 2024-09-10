import Routes from './routes/Routes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthProvider from './provider/AuthProvider.jsx';
import React from 'react';
import { CssBaseline } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./style.css";
// import "react-toastify/dist/ReactToastify.minimal.css";



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

const NotificationContext = React.createContext(null);

export const useNotification = () => {
	const context = React.useContext(NotificationContext);
	return context;
}

function NotificationProvider(props) {
	const [notificationData, setNotificationData] = React.useState({ title: 'context', body: 'context' });

	return <NotificationContext.Provider value={[notificationData, setNotificationData]} {...props} />;
}

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<AuthProvider>
				<NotificationProvider>
					<React.Fragment>
						<CssBaseline />
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<Routes />
							<ToastContainer draggable={true} autoClose={8000} closeButton={false} limit={3} />
						</LocalizationProvider>
					</React.Fragment>
				</NotificationProvider>
			</AuthProvider>
		</ThemeProvider>
	)
}

export default App