import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Grid,
	IconButton,
	Modal,
	Paper,
	Typography,
} from "@mui/material"
import { LOGO_GLASSES } from "../../common/assets"
import Icon from "../../common/components/Icon"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router"
import { useGetBillboardsQuery } from "../../query/useBillboardQuery"
import dayjs from "dayjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import API from "../../api"
import { API_QUERY_KEYS } from "../../query/keys"
import { BillboardResponse } from "../../interfaces/billboard"
import { useState } from "react"
import { useSnackbar } from "notistack"

const DashboardPage = () => {
	const { enqueueSnackbar } = useSnackbar()
	const navigate = useNavigate()
	const { handleLogout } = useAuth()
	const { data: allBillboards } = useGetBillboardsQuery()

	const [modalOpen, setModalOpen] = useState<string | null>("")

	const onLogout = () => {
		handleLogout()
		navigate("/login")
	}

	const onEditBillboard = (billboardId: string) => {
		navigate(`/dashboard/edit/${billboardId}`)
	}

	const queryClient = useQueryClient()

	const setActiveBillboardMutation = useMutation({
		mutationFn: (billboardId: string) => API.billboard.setActive(billboardId),
		onSuccess: (data) => {
			// update the active billboard in the cache
			const allBillboards = queryClient.getQueryData<BillboardResponse[]>(
				API_QUERY_KEYS.billboard.all(),
			)

			if (allBillboards) {
				const updatedBillboards = allBillboards.map((billboard) => {
					if (billboard.isActive) {
						return {
							...billboard,
							isActive: false,
						}
					}
					return billboard
				})

				const finalBillboards = updatedBillboards.map((billboard) => {
					if (billboard.uuid === data.uuid) {
						return {
							...billboard,
							isActive: true,
						}
					}
					return billboard
				})

				// update the cache
				queryClient.setQueryData(
					API_QUERY_KEYS.billboard.all(),
					finalBillboards,
				)
			}
		},
	})

	const deleteBillboardMutation = useMutation({
		mutationFn: (billboardId: string) => API.billboard.delete(billboardId),
		onSuccess: (_, uuid) => {
			queryClient.setQueryData<BillboardResponse[]>(
				API_QUERY_KEYS.billboard.all(),
				(oldBillboards) =>
					oldBillboards
						? oldBillboards.filter((billboard) => billboard.uuid !== uuid)
						: [],
			)

			enqueueSnackbar(`Cartelera eliminada correctamente`, {
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
						¿Estás seguro de que deseas eliminar esta cartelera?
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
									deleteBillboardMutation.mutate(modalOpen)
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
							onClick={() => navigate("/dashboard/new")}
							sx={{
								backgroundColor: "#28231D",
								paddingX: 3,
								paddingY: 1,
							}}
						>
							Crear cartelera
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
						Carteleras
					</Typography>

					<Grid
						container
						size={12}
						gap={2.4}
					>
						{allBillboards?.map((billboard, index) => (
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
												{`Cartelera ${dayjs(billboard.startDate).format(
													"dddd DD",
												)} - ${dayjs(billboard.endDate).format(
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
														onEditBillboard(billboard.uuid)
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
														setModalOpen(billboard.uuid)
													}}
												>
													<Icon icon="delete" />
												</IconButton>
											</Grid>

											{billboard.isActive ? (
												<Typography
													fontWeight="700"
													sx={{
														fontSize: "calc(16px * 0.8)",
														fontFamily: "'Outfit', sans-serif",
														color: "#4CAF50",
														lineHeight: 1,
													}}
												>
													Activa
												</Typography>
											) : (
												<Button
													variant="outlined"
													onClick={(e) => {
														e.stopPropagation()
														setActiveBillboardMutation.mutate(billboard.uuid)
													}}
													sx={{
														borderColor: "#28231D",
														color: "#28231D",
														padding: 0,
														paddingX: 1,
														fontSize: "14px",
														textTransform: "none",
														fontFamily: "'Outfit', sans-serif",
													}}
												>
													Activar cartelera
												</Button>
											)}
										</Grid>
									</AccordionSummary>
									<AccordionDetails>
										<Grid
											container
											size={12}
											flexDirection="column"
											gap={2}
										>
											{billboard.albums.map(({ date, albumData }, idx) => (
												<Grid
													key={idx}
													container
													size={12}
													justifyContent="space-between"
													alignItems="center"
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
														{dayjs(date).format("dddd DD")}
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
									</AccordionDetails>
								</Accordion>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}

export default DashboardPage
