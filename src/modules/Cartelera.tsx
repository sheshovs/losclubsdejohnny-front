import { Grid, Skeleton, Typography } from "@mui/material"
import dayjs from "dayjs"
import "dayjs/locale/es"
import { SpotifyAlbumDetailResponse } from "../interfaces/spotify"
import { useActiveBillboardQuery } from "../query/useBillboardQuery"
import { useMemo } from "react"

dayjs.locale("es")

interface CarteleraProps {
	onSelectAlbum: (album: SpotifyAlbumDetailResponse) => void
	isResponsive?: boolean
}

const Cartelera = ({ onSelectAlbum, isResponsive }: CarteleraProps) => {
	const { data: billboardData, isLoading } = useActiveBillboardQuery()

	const billboardDate = useMemo(() => {
		if (!billboardData) return null
		return `${dayjs(billboardData.startDate).format("MMMM DD")}–${dayjs(
			billboardData.endDate,
		).format("DD")}`
	}, [billboardData])
	return (
		<Grid
			container
			flex={1}
			gap={{
				xs: 6,
				md: 2.4,
			}}
			justifyContent={{
				xs: "flex-start",
				md: "center",
			}}
			height="100%"
			flexDirection="column"
			zIndex={20}
			position="relative"
		>
			<Grid
				container
				size={12}
				flexDirection="column"
				gap={1.6}
				paddingX={{
					xs: 3,
					md: 0,
				}}
			>
				<Typography
					fontWeight="900"
					sx={{
						fontSize: {
							xs: "24px",
							md: "36px",
						},
						fontFamily: "'Outfit', sans-serif",
						color: "#28231D",
						lineHeight: 1,
					}}
				>
					Cartelera
				</Typography>
				{isLoading || !billboardData ? (
					<Skeleton
						width="30%"
						height={16}
						variant="rounded"
						animation="wave"
					/>
				) : (
					<Typography
						fontWeight="300"
						sx={{
							fontSize: {
								xs: "14px",
								md: "16px",
							},
							fontFamily: "'Outfit', sans-serif",
							color: "#28231D",
							letterSpacing: "8px",
							textTransform: "uppercase",
							lineHeight: 1,
						}}
					>
						{billboardDate}
					</Typography>
				)}
			</Grid>

			<Grid
				container
				size={12}
				flexDirection="column"
				gap={{
					xs: 6,
					md: 2.4,
				}}
			>
				{isLoading || !billboardData
					? [...Array(3)].map((_, index) => (
							<Grid
								key={index}
								container
								size={12}
								sx={{
									gap: 1.9,
									borderRadius: "6px",
								}}
								alignItems="center"
								flexDirection={{
									xs: "row-reverse",
									md: "row",
								}}
								paddingX={{
									xs: 3,
									md: 0,
								}}
								paddingY={{
									xs: 1.5,
									md: 0,
								}}
							>
								<Skeleton
									width={isResponsive ? 150 : 120}
									height={isResponsive ? 150 : 120}
									variant="rounded"
									animation="wave"
								/>

								<Grid
									container
									size={12}
									flex={1}
									flexDirection={{
										xs: "column",
										md: "row",
									}}
									gap={{
										xs: 3,
										md: 1.9,
									}}
								>
									<Grid
										container
										size={12}
										flex={1}
										flexDirection="column"
										justifyContent="center"
										gap={{
											xs: 1.5,
											md: 1.2,
										}}
										paddingY={{
											xs: 0,
											md: 1.8,
										}}
									>
										<Skeleton
											width="40%"
											height={12}
											variant="rounded"
											animation="wave"
										/>
										<Skeleton
											width="80%"
											height={32}
											variant="rounded"
											animation="wave"
										/>
										<Skeleton
											width="60%"
											height={24}
											variant="rounded"
											animation="wave"
										/>
										<Skeleton
											width="20%"
											height={10}
											variant="rounded"
											animation="wave"
										/>
									</Grid>

									<Grid
										container
										size={12}
										flex={0.3}
										flexDirection="column"
										justifyContent="center"
										gap={{
											xs: 1,
											md: 0.8,
										}}
									>
										<Skeleton
											width="60%"
											height={16}
											variant="rounded"
											animation="wave"
										/>
										<Skeleton
											width="40%"
											height={16}
											variant="rounded"
											animation="wave"
										/>
									</Grid>
								</Grid>
							</Grid>
						))
					: null}
				{billboardData?.albums?.map(({ date, albumData: album }, index) => {
					return (
						<Grid
							key={index}
							container
							size={12}
							onClick={() => onSelectAlbum(album)}
							sx={{
								cursor: "pointer",
								gap: 1.9,
								borderRadius: "6px",
								"&:hover": {
									backgroundColor: "#28231D29",
								},
							}}
							alignItems="center"
							flexDirection={{
								xs: "row-reverse",
								md: "row",
							}}
							paddingX={{
								xs: 3,
								md: 0,
							}}
							paddingY={{
								xs: 1.5,
								md: 0,
							}}
						>
							<img
								src={album?.images[0].url}
								alt={album.name}
								style={{
									width: isResponsive ? "calc(150px * 1" : "calc(150px * 0.8)",
									height: isResponsive ? "calc(150px * 1" : "calc(150px * 0.8)",
									borderRadius: isResponsive
										? "calc(6px * 1)"
										: "calc(6px * 0.8)",
									boxShadow:
										"0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)",
								}}
							/>

							<Grid
								container
								size={12}
								flex={1}
								flexDirection={{
									xs: "column",
									md: "row",
								}}
								gap={{
									xs: 3,
									md: 1.9,
								}}
							>
								<Grid
									container
									size={12}
									flex={1}
									flexDirection="column"
									justifyContent="center"
									gap={{
										xs: 1.5,
										md: 1.2,
									}}
									paddingY={{
										xs: 0,
										md: 1.8,
									}}
								>
									<Typography
										sx={{
											fontSize: {
												xs: "12px",
											},
											fontWeight: "300",
											lineHeight: 1,
											color: "#28231D",
											fontFamily: "'Outfit', sans-serif",
										}}
									>
										{dayjs(date).format("dddd DD").charAt(0).toUpperCase() +
											dayjs(date).format("dddd DD").slice(1)}
									</Typography>
									<Typography
										sx={{
											fontSize: {
												xs: "24px",
												md: "32px",
											},
											fontWeight: "900",
											lineHeight: 1,
											color: "#28231D",
											fontFamily: "'Outfit', sans-serif",
											lineClamp: 2,
											overflow: "hidden",
											textOverflow: "ellipsis",
											display: "-webkit-box",
											WebkitLineClamp: 2,
											WebkitBoxOrient: "vertical",
										}}
									>
										{album.name}
									</Typography>
									<Typography
										sx={{
											fontSize: {
												xs: "18px",
												md: "24px",
											},
											fontWeight: "300",
											lineHeight: 1,
											color: "#28231D",
											fontFamily: "'Outfit', sans-serif",
										}}
									>
										{album.artists.map((artist) => artist.name).join(", ")}
									</Typography>
									<Typography
										sx={{
											fontSize: {
												xs: "calc(10px * 1)",
												md: "calc(10px * 0.8)",
											},
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
									flex={0.3}
									flexDirection="column"
									justifyContent="center"
									gap={{
										xs: 1,
										md: 0.8,
									}}
								>
									{/* <Typography
									sx={{
										fontSize: "12px",
										fontWeight: "300",
										lineHeight: 1,
										letterSpacing: "6px",
										textTransform: "uppercase",
										color: "#28231D",
									}}
								>
									{dayjs(date).format("dddd DD")}
								</Typography> */}
									<Typography
										sx={{
											fontSize: {
												xs: "calc(16px * 1)",
												md: "calc(16px * 0.8)",
											},
											fontWeight: "300",
											lineHeight: 1,
											color: "#28231D",
											fontFamily: "'Outfit', sans-serif",
										}}
									>
										{album.total_tracks} canciones
									</Typography>
									<Typography
										sx={{
											fontSize: {
												xs: "calc(16px * 1)",
												md: "calc(16px * 0.8)",
											},
											fontWeight: "300",
											lineHeight: 1,
											color: "#28231DB2",
											fontFamily: "'Outfit', sans-serif",
										}}
									>
										{Math.floor(
											album.tracks.items.reduce(
												(acc, track) => acc + track.duration_ms,
												0,
											) / 60000,
										)}{" "}
										minutos
									</Typography>
								</Grid>
							</Grid>
						</Grid>
					)
				})}
			</Grid>
		</Grid>
	)
}

export default Cartelera
