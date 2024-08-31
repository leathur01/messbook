import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../provider/AuthProvider"

export const ProtectedRoute = () => {
	const { token, isActivated } = useAuth()

	if (!token) {
		return <Navigate to="/login" replace />
	}

	if (!isActivated) {		
		return <Navigate to='/activate' replace />
	}

	return <Outlet />
}
