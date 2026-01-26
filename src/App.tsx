import { Route, Routes } from "react-router"
import LandingPage from "./pages/Landing/index.tsx"
import LoginPage from "./pages/Login/index.tsx"
import DashboardPage from "./pages/Dashboard/index.tsx"
import NewBillboard from "./pages/Dashboard/New/index.tsx"
import ProtectedRoute from "./pages/ProtectedRoute.tsx"
import ReviewFridayPage from "./pages/ReviewFriday/index.tsx"
import NewReviewFriday from "./pages/ReviewFriday/New/index.tsx"

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
					<Route
						path="/dashboard/edit/:billboardId"
						element={<NewBillboard />}
					/>
					<Route
						path="/review-friday"
						element={<ReviewFridayPage />}
					/>
					<Route
						path="/review-friday/new"
						element={<NewReviewFriday />}
					/>
					<Route
						path="/review-friday/edit/:reviewId"
						element={<NewReviewFriday />}
					/>
				</Route>
			</Routes>
		</>
	)
}

export default App
