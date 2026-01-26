import {
	Autocomplete,
	Box,
	Button,
	CircularProgress,
	Grid,
	IconButton,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material"
import { useNavigate, useParams } from "react-router"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { useEffect, useMemo, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/es"
import { useMutation } from "@tanstack/react-query"
import { useSnackbar } from "notistack"
import { SpotifyAlbumItem } from "../../../interfaces/spotify"
import { useAuth } from "../../../context/AuthContext"
import useDebounce from "../../../hooks/useDebounce"
import { useSpotifyAlbumsByArtist } from "../../../query/useSpotifyQuery"
import API from "../../../api"
import Icon from "../../../common/components/Icon"
import HeaderDashboard from "../../../common/components/HeaderDashboard"
import { ReviewPayload } from "../../../interfaces/review"
import { useReviewByUuidQuery } from "../../../query/useReviewQuery"

interface StateProps {
	startDate: Dayjs | null
	endDate: Dayjs | null
	albums: {
		albumId: string
		albumData: SpotifyAlbumItem
	}[]
}

const NewReviewFriday = () => {
	const params = useParams()
	const reviewId = params.reviewId || null
	const { enqueueSnackbar } = useSnackbar()
	const navigate = useNavigate()
	const { handleLogout } = useAuth()

	const { data: reviewData, isLoading } = useReviewByUuidQuery(reviewId!)

	const [state, setState] = useState<StateProps>({
		startDate: null,
		endDate: null,
		albums: [],
	})

	const { startDate, endDate, albums } = state

	const [searchTerm, setSearchTerm] = useState("")
	const searchText = useDebounce(searchTerm, 500)

	useEffect(() => {
		if (reviewData) {
			setState({
				startDate: dayjs(reviewData.startDate),
				endDate: dayjs(reviewData.endDate),
				albums: reviewData.albums.map((album) => ({
					albumId: album.albumId,
					albumData: album.albumData,
				})),
			})
		}
	}, [reviewData])

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value)
	}

	const { data: artistAlbumsData, isLoading: isLoadingData } =
		useSpotifyAlbumsByArtist({
			artist: searchText,
		})

	const artistAlbumOptions = useMemo(() => {
		if (!artistAlbumsData) return []
		return artistAlbumsData.items.map((album) => ({
			label: `${album.name} - ${album.artists
				.map((artist) => artist.name)
				.join(", ")}`,
			value: album.id,
			img: album.images[0]?.url || "",
		}))
	}, [artistAlbumsData])

	const handleDateChange = (name: string, value: Dayjs) => {
		setState((prevState) => ({
			...prevState,
			[name]: value,
		}))
	}

	const handleSelectAlbum = (index: number, albumId: string) => {
		const albumData =
			artistAlbumsData?.items.find((album) => album.id === albumId) ||
			({} as SpotifyAlbumItem)
		const updatedAlbums = albums.map((item, i) =>
			i === index ? { ...item, albumId, albumData } : item,
		)
		setState((prevState) => ({
			...prevState,
			albums: updatedAlbums,
		}))
		setSearchTerm("")
	}

	const handleRemoveAlbum = (index: number) => {
		const updatedAlbums = albums.filter((_, i) => i !== index)
		setState((prevState) => ({
			...prevState,
			albums: updatedAlbums,
		}))
	}

	const onLogout = () => {
		handleLogout()
		navigate("/login")
	}

	const isDisabledCreateReview =
		!startDate ||
		!endDate ||
		albums.length === 0 ||
		albums.some((album) => !album.albumData.id)

	const { mutate: reviewMutation, isPending: isCreatingReview } = useMutation({
		mutationFn: (payload: ReviewPayload) => API.review.create(payload),
		onSuccess: () => {
			navigate("/review-friday")
			enqueueSnackbar(`Review creado correctamente`, {
				variant: `success`,
			})
		},
		onError: (error) => {
			console.log(error)
			enqueueSnackbar(`Error al crear review`, { variant: `error` })
		},
	})

	const { mutate: updateReviewMutation, isPending: isUpdatingReview } =
		useMutation({
			mutationFn: (payload: ReviewPayload) =>
				API.review.update(reviewId!, payload),
			onSuccess: () => {
				navigate("/review-friday")
				enqueueSnackbar(`Review actualizado correctamente`, {
					variant: `success`,
				})
			},
			onError: (error) => {
				console.log(error)
				enqueueSnackbar(`Error al actualizar el review`, {
					variant: `error`,
				})
			},
		})

	const handleCreateReview = () => {
		const payload: ReviewPayload = state

		if (reviewId) {
			return updateReviewMutation(payload)
		}
		reviewMutation(payload)
	}

	const handleGoBack = () => {
		navigate("/review-friday")
	}

	return (
		<Grid
			container
			size={12}
			height="100dvh"
			minHeight={800}
			bgcolor="#F7F4EF"
			justifyContent="center"
			flexDirection="column"
			sx={{
				overflow: "hidden",
				flexWrap: "nowrap",
			}}
		>
			{/* Header */}
			<HeaderDashboard onLogout={onLogout} />

			{/* Content */}
			{isLoading ? (
				<Grid
					container
					size={12}
					justifyContent="center"
					alignItems="center"
					flex={1}
				>
					<CircularProgress
						sx={{
							color: "#28231D",
						}}
					/>
				</Grid>
			) : (
				<Grid
					container
					size={12}
					flex={1}
					justifyContent="center"
					paddingTop={6}
					paddingBottom={4}
					paddingX={3}
					sx={{
						overflowY: "auto",
						flexWrap: "nowrap",
					}}
				>
					<Grid
						width={500}
						container
						gap={5}
						flexDirection="column"
						sx={{
							flexWrap: "nowrap",
							overflowY: "auto",
							overflowX: "hidden",
						}}
					>
						{/* Volver */}
						<Button
							onClick={handleGoBack}
							variant="text"
							startIcon={
								<Icon
									icon="arrowLeft"
									sx={{
										color: "#28231D",
										height: 16 * 0.8,
									}}
								/>
							}
							sx={{
								width: "fit-content",
								padding: 0,
								alignItems: "center",
								display: "flex",
								gap: 1.6,
								span: {
									margin: 0,
								},
								"&:hover": {
									backgroundColor: "transparent",
								},
							}}
						>
							<Typography
								fontWeight="300"
								sx={{
									fontSize: "calc(16px * 0.8)",
									letterSpacing: "calc(8px * 0.8)",
									fontFamily: "'Outfit', sans-serif",
									color: "#28231D",
									lineHeight: 1,
								}}
							>
								REGRESAR
							</Typography>
						</Button>
						<Typography
							fontWeight="900"
							sx={{
								fontSize: "calc(48px * 0.8)",
								fontFamily: "'Outfit', sans-serif",
								color: "#28231D",
								lineHeight: 1,
							}}
						>
							{reviewId ? "Editar Review Friday" : "Nuevo Review Friday"}
						</Typography>

						<Grid
							container
							gap={3}
							flexDirection="column"
							justifyContent="center"
						>
							<Typography
								fontWeight="400"
								sx={{
									fontSize: "calc(24px * 0.8)",
									fontFamily: "'Outfit', sans-serif",
									color: "#28231D",
									lineHeight: 1,
								}}
							>
								Seleccionar fecha de inicio y fin
							</Typography>

							<Grid
								container
								gap={2}
							>
								<LocalizationProvider
									dateAdapter={AdapterDayjs}
									adapterLocale="es"
								>
									<DatePicker
										label="Fecha de inicio"
										value={startDate}
										onChange={(newValue) =>
											handleDateChange("startDate", newValue!)
										}
										sx={{
											width: "200px",
											height: "40px",
											label: {
												fontSize: "14px",
												top: "-6px",
											},
											"label[data-shrink='true']": {
												top: "1px",
											},
											div: {
												fontSize: "14px",
												height: "40px",
												div: {
													padding: 0,
													alignItems: "center",
												},
											},
										}}
									/>
									<DatePicker
										label="Fecha de fin"
										value={endDate}
										onChange={(newValue) =>
											handleDateChange("endDate", newValue!)
										}
										sx={{
											width: "200px",
											height: "40px",
											label: {
												fontSize: "14px",
												top: "-6px",
											},
											"label[data-shrink='true']": {
												top: "1px",
											},
											div: {
												fontSize: "14px",
												height: "40px",
												div: {
													padding: 0,
													alignItems: "center",
												},
											},
										}}
									/>
								</LocalizationProvider>
							</Grid>
						</Grid>

						<Grid
							container
							flexDirection="column"
							justifyContent="center"
							gap={3}
						>
							<Typography
								fontWeight="400"
								sx={{
									fontSize: "calc(24px * 0.8)",
									fontFamily: "'Outfit', sans-serif",
									color: "#28231D",
									lineHeight: 1,
								}}
							>
								Agregar albumes
							</Typography>

							{albums.map(({ albumData }, index) => {
								const showSelectedAlbum = albumData.id
								const album = albumData
								return showSelectedAlbum ? (
									<Grid
										key={index}
										container
										width={500}
										gap={1}
										padding={1}
										flexDirection="column"
									>
										<Grid
											container
											flex={1}
											gap={{
												xs: 1.5,
												md: 2.4,
											}}
											alignItems="center"
										>
											<Box
												sx={{
													width: "64px",
													height: "64px",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<img
													src={album.images[0].url}
													alt={album.name}
													style={{
														width: "64px",
														height: "64px",
														borderRadius: "4px",
													}}
												/>
											</Box>
											<Grid
												container
												size={12}
												flex={{
													xs: 0.3,
													md: 1,
												}}
												flexDirection="column"
												justifyContent="center"
												gap={0.4}
											>
												<Typography
													sx={{
														fontSize: "calc(24px * 0.8)",
														fontWeight: "900",
														lineHeight: 1,
														color: "#28231D",
														fontFamily: "'Outfit', sans-serif",
													}}
												>
													{album.name.length > 40
														? album.name.slice(0, 37) + "..."
														: album.name}
												</Typography>
												<Typography
													sx={{
														fontSize: "calc(16px * 0.8)",
														fontWeight: "300",
														lineHeight: 1,
														color: "#28231D",
														fontFamily: "'Outfit', sans-serif",
													}}
												>
													{album.artists
														.map((artist) => artist.name)
														.join(", ")}
												</Typography>
												<Typography
													sx={{
														fontSize: "calc(10px * 0.8)",
														fontWeight: "300",
														lineHeight: 1,
														letterSpacing: "calc(5px * 0.8)",
														textTransform: "uppercase",
														color: "#28231D",
														fontFamily: "'Outfit', sans-serif",
													}}
												>
													{dayjs(album.release_date).format("YYYY")}
												</Typography>
											</Grid>

											<Grid
												container
												size={12}
												width={{
													xs: "fit-content",
												}}
												flex={{
													md: 0.5,
												}}
												flexDirection="column"
												justifyContent="center"
											>
												<Typography
													sx={{
														fontSize: "calc(16px * 0.8)",
														fontWeight: "300",
														lineHeight: 1,
														color: "#28231D",
														fontFamily: "'Outfit', sans-serif",
													}}
												>
													{album.total_tracks} canciones
												</Typography>
											</Grid>

											<Grid
												flex={{
													xs: 0.1,
												}}
												container
												justifyContent="center"
												alignItems="center"
												width="fit-content"
											>
												<IconButton
													onClick={() => {
														handleRemoveAlbum(index)
													}}
													sx={{
														padding: {
															xs: 0.5,
															md: 1,
														},
														borderRadius: 1,
													}}
												>
													<Icon
														icon="delete"
														sx={{
															color: "#28231D4D",
														}}
													/>
												</IconButton>
											</Grid>
										</Grid>
									</Grid>
								) : (
									<Grid
										container
										width={500}
										justifyContent="space-between"
										key={index}
									>
										<Autocomplete
											options={artistAlbumsData ? artistAlbumOptions : []}
											loading={isLoadingData}
											renderInput={(params) => (
												<TextField
													{...params}
													label="Buscar álbum"
													onChange={handleChange}
												/>
											)}
											renderOption={(
												props,
												option: { label: string; value: string; img: string },
											) => (
												<MenuItem
													{...props}
													key={option.value}
													sx={{
														display: "flex",
														gap: 1,
													}}
												>
													<img
														src={option.img}
														alt={option.label}
														style={{
															width: "calc(50px * 0.8)",
															height: "calc(50px * 0.8)",
															borderRadius: "2px",
															boxShadow:
																"0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 3px 1px rgba(0, 0, 0, 0.1)",
														}}
													/>
													<Typography
														sx={{
															fontSize: "14px",
															fontWeight: "500",
															lineHeight: 1,
															color: "#28231D",
															fontFamily: "'Outfit', sans-serif",
														}}
													>
														{option.label.length > 30
															? option.label.slice(0, 27) + "..."
															: option.label}
													</Typography>
												</MenuItem>
											)}
											inputValue={
												Object.keys(albumData).length > 0
													? `${album.name} - ${album.artists[0].name}`
													: searchTerm
											}
											onChange={(_, newValue) => {
												handleSelectAlbum(index, newValue?.value || "")
											}}
											sx={{
												width: "calc(100% - 48px)",
												height: "40px",
												label: {
													fontSize: "14px",
													top: "-6px",
												},
												"label[data-shrink='true']": {
													top: "1px",
												},
												div: {
													fontSize: "14px",
													height: "40px",
													div: {
														padding: 0,
														alignItems: "center",
													},
												},
												"& .MuiAutocomplete-endAdornment": {
													display: "flex",
												},
											}}
											slotProps={{
												paper: {
													sx: {
														width: "fit-content",
													},
												},
											}}
										/>

										<IconButton
											onClick={() => {
												handleRemoveAlbum(index)
											}}
											sx={{
												padding: 1,
												borderRadius: 1,
											}}
										>
											<Icon
												icon="delete"
												sx={{
													color: "#28231D4D",
												}}
											/>
										</IconButton>
									</Grid>
								)
							})}

							<Grid
								container
								size={12}
								onClick={() => {
									// Add new album logic
									setState((prevState) => ({
										...prevState,
										albums: [
											...prevState.albums,
											{
												albumId: "",
												albumData: {} as SpotifyAlbumItem,
											},
										],
									}))
								}}
								sx={{
									cursor: "pointer",
									gap: 1.9,
									borderRadius: "6px",
									"&:hover": {
										backgroundColor: "#28231D29",
									},
								}}
								alignItems="center"
							>
								<IconButton
									sx={{
										"&:hover": {
											backgroundColor: "transparent",
										},
									}}
								>
									<Icon
										icon="add"
										sx={{
											color: "#28231D",
										}}
									/>
								</IconButton>
								<Grid
									container
									size={12}
									flex={1}
									flexDirection="column"
									justifyContent="center"
									gap={1.2}
									paddingY={1.8}
								>
									<Typography
										sx={{
											fontSize: {
												xs: "calc(16px * 0.8)",
												md: "calc(20px * 0.8)",
												lg: "calc(24px * 0.8)",
											},
											fontWeight: "300",
											lineHeight: 1,
											color: "#28231D",
											fontFamily: "'Outfit', sans-serif",
										}}
									>
										Agregar nuevo álbum
									</Typography>
								</Grid>
							</Grid>

							<Button
								loading={reviewId ? isUpdatingReview : isCreatingReview}
								disabled={isDisabledCreateReview}
								variant="contained"
								fullWidth
								sx={{
									backgroundColor: "#28231D",
								}}
								onClick={handleCreateReview}
							>
								{reviewId ? "Guardar cambios" : "Crear Review Friday"}
							</Button>
						</Grid>
					</Grid>
				</Grid>
			)}
		</Grid>
	)
}

export default NewReviewFriday
