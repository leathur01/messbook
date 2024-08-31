import axios from 'axios'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'


const AuthContext = createContext()

const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(localStorage.getItem('token'))
	const [isActivated, setIsActivated] = useState(JSON.parse(localStorage.getItem('isActivated')))

	useEffect(() => {
		if (token && !isTokenExpired(token)) {
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
			localStorage.setItem('token', token)
			localStorage.setItem('isActivated', isActivated)
		} else {
			delete axios.defaults.headers.common['Authorization']
			localStorage.removeItem('token')
			localStorage.removeItem('isActivated')
		}
	}, [token, isActivated])

	const contextValue = useMemo(
		() => ({
			token,
			setToken,
			isActivated,
			setIsActivated
		}),
		[token, isActivated]
	)

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	)
}

const isTokenExpired = (token) => {
	if (!token) return true
	try {
		const decodedToken = jwtDecode(token)
		const currentTime = Date.now() / 1000
		return decodedToken.exp < currentTime
	} catch (error) {
		console.error('Error decoding token:', error)
		return true
	}
}

export const useAuth = () => {
	return useContext(AuthContext)
}

export default AuthProvider