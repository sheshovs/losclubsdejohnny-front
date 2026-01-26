import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Grid,
	IconButton,
	Modal,
	Paper,
	Skeleton,
	Typography,
} from "@mui/material"
import Icon from "../../common/components/Icon"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router"
import { useGetReviewsQuery } from "../../query/useReviewQuery"
import dayjs from "dayjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import API from "../../api"
import { API_QUERY_KEYS } from "../../query/keys"
import { ReviewResponse } from "../../interfaces/review"
import { useMemo, useState } from "react"
import { useSnackbar } from "notistack"
import useDownloadBoleta from "../../modules/hooks/useDownloadBoleta"
import NewBoleta from "../../modules/NewBoleta"
import download from "downloadjs"
import html2canvas from "html2canvas"
import JSZip from "jszip"
import HeaderDashboard from "../../common/components/HeaderDashboard"
import Sidebar from "../../common/components/Sidebar"
import { useSidebarStore } from "../../store/SidebarStore"

const ReviewFridayPage = () => {
	const { enqueueSnackbar } = useSnackbar()
	const navigate = useNavigate()
	const { handleLogout } = useAuth()
	const { isOpen } = useSidebarStore()
	const { data: allReviews, isLoading } = useGetReviewsQuery()

	const [modalOpen, setModalOpen] = useState<string | null>("")
	const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
	const [currentAlbumIndex, setCurrentAlbumIndex] = useState<number>(0)
	const [isDownloading, setIsDownloading] = useState<boolean>(false)

	const selectedAlbums = useMemo(() => {
		if (!selectedReviewId || !allReviews) return []
		const review = allReviews.find((review) => review.uuid === selectedReviewId)
		if (!review) return []
		return review.albums.map((albumEntry) => albumEntry.albumData)
	}, [selectedReviewId, allReviews])

	const { boletaRef, albumsData } = useDownloadBoleta({
		selectedAlbums,
	})

	const handleDownloadBoletas = async (reviewId: string) => {
		setIsDownloading(true)
		setSelectedReviewId(reviewId)

		// Esperar un poco para que React actualice el estado y luego descargar
		setTimeout(async () => {
			const review = allReviews?.find((b) => b.uuid === reviewId)
			if (!review || !review.albums.length) {
				setIsDownloading(false)
				return
			}

			// Crear un nuevo ZIP
			const zip = new JSZip()

			// Generar todas las boletas y agregarlas al ZIP
			for (let i = 0; i < review.albums.length; i++) {
				setCurrentAlbumIndex(i)

				// Esperar un poco para que el componente se actualice
				await new Promise((resolve) => setTimeout(resolve, 500))

				// Capturar la boleta actual
				if (boletaRef.current) {
					boletaRef.current.style.opacity = "1"

					try {
						const canvas = await html2canvas(boletaRef.current, {
							scale: 2,
							useCORS: true,
							backgroundColor: null,
						})

						// Convertir canvas a blob
						const dataUrl = canvas.toDataURL("image/jpeg", 0.95)
						const base64Data = dataUrl.split(",")[1] // Remover el prefijo data:image/jpeg;base64,

						// Agregar la imagen al ZIP
						const fileName = `boleta-${review.albums[i].albumData.name}.jpeg`
						zip.file(fileName, base64Data, { base64: true })

						console.log(
							`Boleta ${i + 1}/${review.albums.length} agregada al ZIP: ${fileName}`,
						)
					} catch (err) {
						console.error(
							`Error generating boleta for ${review.albums[i].albumData.name}:`,
							err,
						)
					}

					boletaRef.current.style.opacity = "0"
				}
			}

			// Generar y descargar el archivo ZIP
			try {
				const zipBlob = await zip.generateAsync({ type: "blob" })
				const zipFileName = `boletas-review-friday-${dayjs(review.startDate).format("DD-MM")}-${dayjs(review.endDate).format("DD-MM")}.zip`
				download(zipBlob, zipFileName)

				enqueueSnackbar(
					`${review.albums.length} boletas descargadas en ${zipFileName}`,
					{
						variant: "success",
					},
				)
			} catch (err) {
				console.error("Error generating ZIP file:", err)
				enqueueSnackbar("Error al generar el archivo ZIP", {
					variant: "error",
				})
			}

			// Reset
			setCurrentAlbumIndex(0)
			setSelectedReviewId(null)
			setIsDownloading(false)
		}, 100)
	}

	const onLogout = () => {
		handleLogout()
		navigate("/login")
	}

	const onEditReview = (reviewId: string) => {
		navigate(`/review-friday/edit/${reviewId}`)
	}

	const queryClient = useQueryClient()

	const deleteReviewMutation = useMutation({
		mutationFn: (reviewId: string) => API.review.delete(reviewId),
		onSuccess: (_, uuid) => {
			queryClient.setQueryData<ReviewResponse[]>(
				API_QUERY_KEYS.review.all(),
				(oldReviews) =>
					oldReviews ? oldReviews.filter((review) => review.uuid !== uuid) : [],
			)

			enqueueSnackbar(`Review friday eliminado correctamente`, {
				variant: `success`,
			})
			setModalOpen(null)
		},
	})

	return (
		<>
			<Modal
				open={!!modalOpen}
				onClose={() => {
					setModalOpen(null)
				}}
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					padding: 2,
				}}
			>
				<Paper
					elevation={3}
					sx={{
						width: "400px",
						paddingX: 4,
						paddingTop: 6,
						paddingBottom: 3,
						gap: 4,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Icon
						icon="delete"
						sx={{ color: " #FF0000cc", fontSize: "64px" }}
					/>

					<Typography
						sx={{
							fontSize: "18px",
							fontFamily: "'Outfit', sans-serif",
							color: "#28231D",
							lineHeight: 1,
							textAlign: "center",
						}}
					>
						¿Estás seguro de que deseas eliminar este review friday?
					</Typography>
					<Grid
						container
						size={12}
						flexDirection={{
							xs: "column-reverse",
							sm: "row",
						}}
						gap={{
							xs: 2,
							sm: 4,
						}}
					>
						<Button
							variant="outlined"
							sx={{
								color: "#28231Db3",
								borderColor: "#28231Db3",
							}}
							onClick={() => {
								setModalOpen(null)
							}}
						>
							Cancelar
						</Button>
						<Button
							variant="contained"
							color="error"
							onClick={() => {
								if (modalOpen) {
									deleteReviewMutation.mutate(modalOpen)
								}
							}}
						>
							Si, eliminar
						</Button>
					</Grid>
				</Paper>
			</Modal>
			<Grid
				container
				size={12}
				height="100dvh"
				minHeight={800}
				bgcolor="#F7F4EF"
				justifyContent="center"
				alignItems="center"
				flexDirection="column"
				sx={{
					overflow: "hidden",
					flexWrap: "nowrap",
				}}
			>
				{/* Header */}
				<HeaderDashboard onLogout={onLogout} />

				<Grid
					container
					size={12}
					flex={1}
					overflow="hidden"
					justifyContent="center"
					paddingLeft={{
						xs: isOpen ? 27.5 : 8,
					}}
					sx={{
						transition: "padding-left 0.3s ease",
					}}
				>
					<Sidebar />

					{/* Content */}
					<Grid
						container
						size={12}
						flex={1}
						alignItems="center"
						flexDirection="column"
						paddingTop={6}
						paddingX={{
							xs: 2,
						}}
						maxWidth={1000}
						gap={3}
						paddingBottom={4}
						sx={{
							overflowY: "auto",
							flexWrap: "nowrap",
						}}
					>
						<Grid
							container
							size={12}
							justifyContent="flex-end"
						>
							<Button
								variant="contained"
								onClick={() => navigate("/review-friday/new")}
								sx={{
									backgroundColor: "#28231D",
									paddingX: 3,
									paddingY: 1,
									textTransform: "none",
									fontFamily: "'Outfit', sans-serif",
								}}
							>
								Crear review
							</Button>
						</Grid>
						<Typography
							fontWeight="900"
							sx={{
								fontSize: "calc(48px * 0.8)",
								fontFamily: "'Outfit', sans-serif",
								color: "#28231D",
								lineHeight: 1,
							}}
						>
							Review Friday
						</Typography>

						<Grid
							container
							size={12}
							gap={2.4}
						>
							{isLoading ? (
								// Skeleton loader mientras carga
								Array.from({ length: 5 }).map((_, index) => (
									<Grid
										key={index}
										container
										size={12}
										alignItems="center"
										justifyContent="space-between"
									>
										<Skeleton
											variant="rectangular"
											animation="wave"
											width="100%"
											height={56}
											sx={{ borderRadius: 1 }}
										/>
									</Grid>
								))
							) : !allReviews || allReviews.length === 0 ? (
								// Mensaje cuando no hay reviews
								<Grid
									container
									size={12}
									flexDirection="column"
									alignItems="center"
									gap={3}
									sx={{ mt: 4 }}
								>
									<Typography
										sx={{
											fontSize: "calc(24px * 0.8)",
											fontFamily: "'Outfit', sans-serif",
											color: "#28231D",
											textAlign: "center",
											lineHeight: 1.5,
										}}
									>
										No existen elementos todavía, ¿quieres crear uno?
									</Typography>
									<Button
										variant="contained"
										onClick={() => navigate("/review-friday/new")}
										sx={{
											backgroundColor: "#28231D",
											paddingX: 4,
											paddingY: 1.5,
											fontSize: "calc(16px * 0.9)",
											fontFamily: "'Outfit', sans-serif",
											textTransform: "none",
											"&:hover": {
												backgroundColor: "#1a1611",
											},
										}}
									>
										Crear primer review
									</Button>
								</Grid>
							) : (
								allReviews.map((review, index) => (
									<Grid
										key={index}
										container
										size={12}
										alignItems="center"
										justifyContent="space-between"
									>
										<Accordion sx={{ width: "100%" }}>
											<AccordionSummary>
												<Grid
													container
													size={12}
													justifyContent="space-between"
													alignItems="center"
													minHeight={30}
													gap={2}
													sx={{
														"&:hover": {
															// select first child div
															"& > div:first-of-type": {
																opacity: 1,
															},
														},
													}}
												>
													<Typography
														fontWeight="500"
														sx={{
															fontSize: "calc(24px * 0.8)",
															fontFamily: "'Outfit', sans-serif",
															color: "#28231D",
															lineHeight: 1,
														}}
													>
														{`Review ${dayjs(review.startDate).format(
															"dddd DD",
														)} - ${dayjs(review.endDate).format(
															"dddd DD [de] MMMM",
														)}`}
													</Typography>

													<Grid
														container
														flex={1}
														justifyContent="flex-end"
														alignItems="center"
														gap={1}
														sx={{
															opacity: 0.5,
															transition: "opacity 0.2s",
														}}
													>
														<IconButton
															sx={{
																padding: 0,
																borderRadius: 0.5,
																svg: {
																	padding: 0.5,
																	width: "32px",
																	height: "32px",
																	color: "#28231D66",
																	transition: "color 0.2s",
																	"&:hover": {
																		color: "#28231D",
																	},
																},
															}}
															onClick={(e) => {
																e.stopPropagation()
																onEditReview(review.uuid)
															}}
														>
															<Icon icon="edit" />
														</IconButton>
														<IconButton
															sx={{
																padding: 0,
																borderRadius: 0.5,
																svg: {
																	padding: 0.5,
																	width: "32px",
																	height: "32px",
																	transition: "color 0.2s",
																	color: "#28231D66",
																	"&:hover": {
																		color: "#FF0000",
																	},
																},
															}}
															onClick={(e) => {
																e.stopPropagation()
																setModalOpen(review.uuid)
															}}
														>
															<Icon icon="delete" />
														</IconButton>
													</Grid>
												</Grid>
											</AccordionSummary>
											<AccordionDetails>
												<Grid
													container
													size={12}
													flexDirection="column"
													gap={2}
												>
													{review.albums.map(({ albumData }, idx) => (
														<Grid
															key={idx}
															container
															size={12}
															alignItems="center"
															gap={1}
														>
															<Typography
																fontWeight="400"
																sx={{
																	fontSize: "calc(16px * 0.8)",
																	fontFamily: "'Outfit', sans-serif",
																	color: "#28231D",
																	lineHeight: 1,
																	textTransform: "capitalize",
																}}
															>
																{idx + 1}.
															</Typography>
															<Typography
																fontWeight="600"
																sx={{
																	fontSize: "calc(16px * 0.8)",
																	fontFamily: "'Outfit', sans-serif",
																	color: "#28231D",
																	lineHeight: 1,
																}}
															>
																{albumData.name} -{" "}
																{albumData.artists
																	.map((artist) => artist.name)
																	.join(", ")}
															</Typography>
														</Grid>
													))}
												</Grid>

												<Grid
													container
													size={12}
													marginTop={2}
													justifyContent="center"
												>
													<Button
														variant="contained"
														loading={isDownloading}
														disabled={isDownloading}
														onClick={async (e) => {
															e.stopPropagation()
															await handleDownloadBoletas(review.uuid)
														}}
														sx={{
															backgroundColor: "#28231D",
															paddingX: 2,
															textTransform: "none",
															fontFamily: "'Outfit', sans-serif",
														}}
													>
														Descargar boletas
													</Button>
												</Grid>
											</AccordionDetails>
										</Accordion>
									</Grid>
								))
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			{/* Componente NewBoleta oculto para html2canvas */}
			{albumsData &&
				albumsData.length > 0 &&
				currentAlbumIndex < albumsData.length && (
					<div style={{ position: "absolute", top: -9999, left: -9999 }}>
						<NewBoleta
							boletaRef={boletaRef}
							selectedAlbum={albumsData[currentAlbumIndex].album}
							tracksOfAlbum={albumsData[currentAlbumIndex].tracksOfAlbum}
							trackRatings={albumsData[currentAlbumIndex].trackRatings}
							heartsAverage={albumsData[currentAlbumIndex].heartsAverage}
							starsAverage={albumsData[currentAlbumIndex].starsAverage}
							totalAverage={albumsData[currentAlbumIndex].totalAverage}
							albumScore={albumsData[currentAlbumIndex].albumScore}
							albumStampImage={
								albumsData[currentAlbumIndex].albumStampImage || ""
							}
							albumStamp={albumsData[currentAlbumIndex].albumStamp}
							braveStamp={albumsData[currentAlbumIndex].braveStamp}
						/>
					</div>
				)}
		</>
	)
}

export default ReviewFridayPage
