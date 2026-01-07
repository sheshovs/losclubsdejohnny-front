/* eslint-disable react-refresh/only-export-components */
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react"
import { useMutation, UseMutationResult } from "@tanstack/react-query"
import { API_QUERY_KEYS } from "../query/keys"
import API from "../api"
import { useSpotifyToken } from "../query/useSpotifyQuery"

interface AuthContextType {
	userToken: string | null
	spotifyToken: string | null
	isLoading: boolean
	loginMutation: UseMutationResult<
		{ token: string },
		Error,
		{ username: string; password: string },
		unknown
	>
	isAuthenticated: boolean
	isLoadingUser: boolean
	handleLogout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
	children: ReactNode
}

export interface SpotifyTokenResponse {
	access_token: string
	token_type: string
	expires_in: number
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [userToken, setUserToken] = useState<string | null>(null)
	const [spotifyToken, setSpotifyToken] = useState<string | null>(null)
	const [expirationTime, setExpirationTime] = useState<number | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoadingUser, setIsLoadingUser] = useState(true)

	const { data: spotifyData } = useSpotifyToken()

	const handleLogout = () => {
		setUserToken(null)
		localStorage.removeItem("user_token")
	}

	useEffect(() => {
		const userTokenStored = localStorage.getItem("user_token")
		if (userTokenStored) {
			setUserToken(userTokenStored)
			setIsAuthenticated(true)
			setIsLoadingUser(false)
		} else {
			setIsLoadingUser(false)
		}
		const storedToken = localStorage.getItem("spotify_access_token")
		const expiration = localStorage.getItem("spotify_token_expiration")
		if (storedToken && expiration) {
			const expirationTime = parseInt(expiration, 10)
			if (Date.now() < expirationTime) {
				setSpotifyToken(storedToken)
				setIsLoading(false)
				setExpirationTime(expirationTime)
				return
			} else {
				localStorage.removeItem("spotify_access_token")
				localStorage.removeItem("spotify_token_expiration")
			}
		}
	}, [])

	useEffect(() => {
		if (spotifyData) {
			const expirationTime = Date.now() + spotifyData.expires_in * 1000
			localStorage.setItem("spotify_access_token", spotifyData.access_token)
			localStorage.setItem(
				"spotify_token_expiration",
				expirationTime.toString()
			)
			setSpotifyToken(spotifyData.access_token)
			setIsLoading(false)
			setExpirationTime(expirationTime)
		}
	}, [spotifyData])

	//revisar expiration time en local storage, si esta vencido, limpiar token y expiration time y pedir nuevo token
	useEffect(() => {
		if (expirationTime && Date.now() >= expirationTime) {
			setSpotifyToken(null)
			setExpirationTime(null)
			localStorage.removeItem("spotify_access_token")
			localStorage.removeItem("spotify_token_expiration")
		}
	}, [expirationTime])

	const loginMutation = useMutation({
		mutationKey: API_QUERY_KEYS.login(),
		mutationFn: ({
			username,
			password,
		}: {
			username: string
			password: string
		}) => API.login(username, password),
		onSuccess: (data) => {
			// Handle successful login, e.g., store token, redirect, etc.
			setUserToken(data.token)
			localStorage.setItem("user_token", data.token)
			setIsAuthenticated(true)
			setIsLoadingUser(false)
		},
		onError: (error) => {
			// Handle login error
			console.error("Login failed:", error)
			alert("Error al iniciar sesión. Por favor, verifique sus credenciales.")
		},
	})

	const value: AuthContextType = {
		userToken,
		spotifyToken,
		isLoading,
		loginMutation,
		isAuthenticated,
		isLoadingUser,
		handleLogout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
