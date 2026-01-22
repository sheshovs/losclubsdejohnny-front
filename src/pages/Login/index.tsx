import {
	Button,
	Checkbox,
	Grid,
	Paper,
	TextField,
	Typography,
} from "@mui/material"
import React, { useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { Link, useNavigate } from "react-router"

const LoginPage = () => {
	const navigate = useNavigate()
	const { loginMutation } = useAuth()
	const [state, setState] = React.useState({
		username: "",
		password: "",
	})
	const [rememberMe, setRememberMe] = React.useState(false)

	const { username, password } = state

	useEffect(() => {
		const rememberedUsername = localStorage.getItem("rememberedUsername")
		if (rememberedUsername) {
			setState((prevState) => ({
				...prevState,
				username: rememberedUsername,
			}))
			setRememberMe(true)
		}
	}, [])

	useEffect(() => {
		if (rememberMe) {
			localStorage.setItem("rememberedUsername", username)
		} else {
			localStorage.removeItem("rememberedUsername")
		}
	}, [rememberMe, username])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setState((prevState) => ({
			...prevState,
			[name]: value,
		}))
	}

	const handleLogin = () => {
		// Implement login logic here
		if (!username || !password) {
			alert("Por favor, ingrese usuario y contraseña")
			return
		}
		// Call API to login
		loginMutation.mutate(
			{ username, password },
			{
				onSuccess: () => {
					navigate("/dashboard")
				},
			},
		)
	}

	return (
		<Grid
			container
			size={12}
			height="100dvh"
			minHeight={800}
			bgcolor="#F7F4EF"
			alignItems="center"
			justifyContent="center"
			sx={{
				padding: 2,
			}}
		>
			<Paper
				elevation={3}
				sx={{
					display: "flex",
					flexDirection: "column",
					padding: {
						xs: 6,
						md: 10,
					},
					gap: 2,
				}}
			>
				<Grid
					container
					size={12}
					flexDirection="column"
					alignItems="center"
					gap={1.6}
				>
					<Typography
						fontWeight="300"
						sx={{
							fontSize: "calc(24px * 0.8)",
							fontFamily: "'Outfit', sans-serif",
							color: "#28231DB2",
							lineHeight: 1,
						}}
					>
						Iniciar sesión en
					</Typography>
					<Link
						to="/"
						style={{ textDecoration: "none", textAlign: "center" }}
					>
						<Typography
							fontWeight="900"
							sx={{
								fontSize: "calc(48px * 0.8)",
								fontFamily: "'Outfit', sans-serif",
								color: "#28231D",
								lineHeight: 1,
							}}
						>
							Johnny’s Foolclub
						</Typography>
					</Link>
				</Grid>

				<Grid
					container
					size={12}
				>
					<TextField
						value={username}
						onChange={handleInputChange}
						name="username"
						label="Usuario"
						variant="outlined"
						fullWidth
						margin="normal"
					/>
					<TextField
						value={password}
						onChange={handleInputChange}
						name="password"
						label="Contraseña"
						type="password"
						variant="outlined"
						fullWidth
						margin="normal"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleLogin()
							}
						}}
					/>
					<Grid
						container
						alignItems="center"
						onClick={() => setRememberMe(!rememberMe)}
						sx={{
							cursor: "pointer",
							userSelect: "none",
						}}
					>
						<Checkbox
							checked={rememberMe}
							disableRipple
							sx={{
								color: "#28231D",
								"&.Mui-checked": { color: "#28231D" },
							}}
						/>
						<Typography
							sx={{
								width: "fit-content",
								fontSize: "16px",
								fontFamily: "'Outfit', sans-serif",
								color: "#28231D",
							}}
						>
							Recuérdame
						</Typography>
					</Grid>
				</Grid>
				<Button
					loading={loginMutation.isPending}
					onClick={handleLogin}
					variant="contained"
					fullWidth
					sx={{
						marginTop: 2,
						padding: 1.5,
						fontSize: "calc(16px * 0.8)",
						fontWeight: "600",
						fontFamily: "'Outfit', sans-serif",
						backgroundColor: "#28231D",
					}}
				>
					Iniciar Sesión
				</Button>
			</Paper>
		</Grid>
	)
}

export default LoginPage
