import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Grid,
	IconButton,
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

const DashboardPage = () => {
	const navigate = useNavigate()
	const { handleLogout } = useAuth()
	const { data: allBillboards } = useGetBillboardsQuery()

	const onLogout = () => {
		handleLogout()
		navigate("/login")
	}

	const queryClient = useQueryClient()

	const setActiveBillboardMutation = useMutation({
		mutationFn: (billboardId: string) => API.billboard.setActive(billboardId),
		onSuccess: (data) => {
			// update the active billboard in the cache
			const allBillboards = queryClient.getQueryData<BillboardResponse[]>(
				API_QUERY_KEYS.billboard.all()
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
					finalBillboards
				)
			}
		},
	})

	return (
		<Grid
			container
			size={12}
			height="100dvh"
			minHeight={800}
			bgcolor="#F7F4EF"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
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
				maxWidth={1000}
				gap={3}
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
										height={30}
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
												"dddd DD"
											)} - ${dayjs(billboard.endDate).format(
												"dddd DD [de] MMMM"
											)}`}
										</Typography>
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
	)
}

export default DashboardPage
