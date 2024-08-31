import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { useAuth } from "../provider/AuthProvider"
import { ProtectedRoute } from "./ProtectedRoute"
import Login from "../pages/Login"
import Register from "../pages/Register"
import NotFoundPage from "../pages/NotFoundPage"
import HomePage from "../pages/HomePage"
import ErrorPage from "../pages/ErrorPage"
import AccountActivation from "../pages/AccountActivation"

const Routes = () => {
    const {token} = useAuth()

    // Define public routes accessible to all users
    const routesForPublic = [
        {
            path: "/service",
            element: <div>Service Page</div>,
        },
        {
            path: "/about-us",
            element: <div>About Us</div>,
        },
        {
            path: '/500',
            element: <ErrorPage />,
        },
        {
            path: "*",
            element: <NotFoundPage />,
        },
    ]

    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute />, 
            children: [
                {
                    path: "",
                    element: <HomePage />
                },
                {
                    path: "/login",
                    element: <HomePage />
                },
                {
                    path: "/register",
                    element: <HomePage />
                },
            ],
        },
    ]

    // Can't navigate to this link if we put the element inside the ProtectedRoute element
    // So we declare it outside
    const routesForNotActivatedOnly = [
        {
            path: '/activate',
            element: <AccountActivation />
        }
    ]

    const routesForNotAuthenticatedOnly = [
        {
            path: "/",
            element: <Login />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
    ]

    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNotAuthenticatedOnly : []),
        ...(token ? routesForNotActivatedOnly : []),
        ...routesForAuthenticatedOnly,
    ])

    return <RouterProvider router={router} />
}

export default Routes