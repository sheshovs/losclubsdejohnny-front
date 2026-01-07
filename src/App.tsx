import { Route, Routes } from "react-router"
import LandingPage from "./pages/Landing/index.tsx"
import LoginPage from "./pages/Login/index.tsx"
import DashboardPage from "./pages/Dashboard/index.tsx"
import NewBillboard from "./pages/Dashboard/New/index.tsx"
import ProtectedRoute from "./pages/ProtectedRoute.tsx"

function App() {
	return (
		<>
			<Routes>
				<Route
					path="/"
					element={<LandingPage />}
				/>
				<Route
					path="/login"
					element={<LoginPage />}
				/>
				<Route element={<ProtectedRoute />}>
					<Route
						path="/dashboard"
						element={<DashboardPage />}
					/>
					<Route
						path="/dashboard/new"
						element={<NewBillboard />}
					/>
				</Route>
			</Routes>
		</>
	)
}

export default App
