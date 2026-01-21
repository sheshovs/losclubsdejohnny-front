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
import { BillboardPayload } from "../../../interfaces/billboard"
import API from "../../../api"
import { LOGO_GLASSES } from "../../../common/assets"
import Icon from "../../../common/components/Icon"
import { useBillboardByUuidQuery } from "../../../query/useBillboardQuery"

interface StateProps {
	startDate: Dayjs | null
	endDate: Dayjs | null
	albums: {
		date: Dayjs | null
		albumId: string
		albumData: SpotifyAlbumItem
	}[]
}

const NewBillboard = () => {
	const params = useParams()
	const billboardId = params.billboardId || null
	const { enqueueSnackbar } = useSnackbar()
	const navigate = useNavigate()
	const { handleLogout } = useAuth()

	const { data: billboardData, isLoading } = useBillboardByUuidQuery(
		billboardId!,
	)

	const [state, setState] = useState<StateProps>({
		startDate: null,
		endDate: null,
		albums: [],
	})

	const { startDate, endDate, albums } = state

	const [searchTerm, setSearchTerm] = useState("")
	const searchText = useDebounce(searchTerm, 500)

	useEffect(() => {
		if (billboardData) {
			setState({
				startDate: dayjs(billboardData.startDate),
				endDate: dayjs(billboardData.endDate),
				albums: billboardData.albums.map((album) => ({
					date: dayjs(album.date),
					albumId: album.albumId,
					albumData: album.albumData,
				})),
			})
		}
	}, [billboardData])

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

	const handleAlbumDateChange = (index: number, date: Dayjs) => {
		const updatedAlbums = albums.map((item, i) =>
			i === index ? { ...item, date } : item,
		)
		setState((prevState) => ({
			...prevState,
			albums: updatedAlbums.sort((a, b) => a.date!.unix() - b.date!.unix()),
		}))
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

	const isDisabledCreateBillboard =
		!startDate || !endDate || albums.length === 0

	const { mutate: billboardMutation, isPending: isCreatingBillboard } =
		useMutation({
			mutationFn: (payload: BillboardPayload) => API.billboard.create(payload),
			onSuccess: () => {
				navigate("/dashboard")
				enqueueSnackbar(`Cartelera creada correctamente`, {
					variant: `success`,
				})
			},
			onError: (error) => {
				console.log(error)
				enqueueSnackbar(`Error al crear la cartelera`, { variant: `error` })
			},
		})

	const { mutate: updateBillboardMutation, isPending: isUpdatingBillboard } =
		useMutation({
			mutationFn: (payload: BillboardPayload) =>
				API.billboard.update(billboardId!, payload),
			onSuccess: () => {
				navigate("/dashboard")
				enqueueSnackbar(`Cartelera actualizada correctamente`, {
					variant: `success`,
				})
			},
			onError: (error) => {
				console.log(error)
				enqueueSnackbar(`Error al actualizar la cartelera`, {
					variant: `error`,
				})
			},
		})

	const handleCreateBillboard = () => {
		const payload: BillboardPayload = state

		if (billboardId) {
			return updateBillboardMutation(payload)
		}
		billboardMutation(payload)
	}

	const handleGoBack = () => {
		navigate("/dashboard")
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
			<Grid
				container
				size={12}
				height="60px"
				sx={{
					paddingX: 4,
					alignItems: "center",
					boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
				}}
			>
				<Grid
					container
					flex={0.5}
				>
					<img
						src={LOGO_GLASSES}
						width={32}
						height={16}
					/>
				</Grid>
				<Grid
					container
					flex={1}
					justifyContent="center"
				>
					<Typography
						fontWeight="900"
						sx={{
							fontSize: "calc(32px * 0.8)",
							fontFamily: "'Outfit', sans-serif",
							color: "#28231D",
							lineHeight: 1,
						}}
					>
						Johnny’s Foolclub
					</Typography>
				</Grid>
				<Grid
					container
					justifyContent="flex-end"
					flex={0.5}
				>
					<IconButton
						onClick={onLogout}
						sx={{
							padding: 1,
							borderRadius: 0.5,
						}}
					>
						<Icon
							icon="logout"
							sx={{
								color: "#28231D",
							}}
						/>
					</IconButton>
				</Grid>
			</Grid>

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
							{billboardId ? "Editar cartelera" : "Nueva cartelera"}
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

							{albums.map(({ date, albumData }, index) => {
								const showSelectedAlbum = dayjs(date).isValid() && albumData.id
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
											width="fit-content"
											alignItems="center"
											gap={1}
										>
											<Icon
												icon="calendar"
												sx={{
													color: "#28231D",
													fontSize: "16px",
												}}
											/>
											<Typography
												sx={{
													fontSize: "calc(16px * 0.8)",
													fontWeight: "300",
													lineHeight: 1,
													letterSpacing: "calc(5px * 0.8)",
													textTransform: "uppercase",
													color: "#28231D",
													fontFamily: "'Outfit', sans-serif",
												}}
											>
												{dayjs(date).format("dddd DD").toLocaleUpperCase()}
											</Typography>
										</Grid>
										<Grid
											container
											flex={1}
											gap={2.4}
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
												flex={1}
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
												flex={0.5}
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
										</Grid>
									</Grid>
								) : (
									<Grid
										container
										width={500}
										justifyContent="space-between"
										paddingRight={1}
										key={index}
									>
										<LocalizationProvider
											dateAdapter={AdapterDayjs}
											adapterLocale="es"
										>
											<DatePicker
												label="Dia de la semana"
												value={date}
												onChange={(newValue) =>
													handleAlbumDateChange(index, newValue!)
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

							{albums.length <= 2 ? (
								<Grid
									container
									size={12}
									onClick={() => {
										// si existe un album sin seleccionar, no agregar otro
										const hasEmptyAlbum = albums.some(
											(item) => !item.albumId || !dayjs(item.date).isValid(),
										)
										if (hasEmptyAlbum) return
										// Add new album logic
										setState((prevState) => ({
											...prevState,
											albums: [
												...prevState.albums,
												{
													date: null,
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
							) : (
								<Button
									loading={
										billboardId ? isUpdatingBillboard : isCreatingBillboard
									}
									disabled={isDisabledCreateBillboard}
									variant="contained"
									fullWidth
									sx={{
										backgroundColor: "#28231D",
									}}
									onClick={handleCreateBillboard}
								>
									{billboardId ? "Guardar cambios" : "Crear cartelera"}
								</Button>
							)}
						</Grid>
					</Grid>
				</Grid>
			)}
		</Grid>
	)
}

export default NewBillboard
