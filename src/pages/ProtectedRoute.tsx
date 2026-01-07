import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/AuthContext"

type ProtectedRouteProps = {
	redirectPath?: string
	children?: React.ReactNode
}

const ProtectedRoute = ({
	redirectPath = "/",
	children,
}: ProtectedRouteProps) => {
	const { isAuthenticated, isLoadingUser } = useAuth()

	if (isLoadingUser) {
		return null
	}

	if (!isAuthenticated) {
		return (
			<Navigate
				to={redirectPath}
				replace
			/>
		)
	}

	return children ? children : <Outlet />
}

export default ProtectedRoute
