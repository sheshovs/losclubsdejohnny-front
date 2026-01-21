import { Box, Button, Divider, Grid, Typography } from "@mui/material"
import Footer from "./Footer"
import Icon from "../common/components/Icon"
import dayjs from "dayjs"
import {
	SELLO_APROBADO,
	SELLO_NO_APROBADO,
	SELLO_PERFECTO,
	SELLO_MEH,
	SELLO_ZZZ,
	SELLO_VALIENTE,
} from "../common/assets"
import { SpotifyAlbumDetailResponse } from "../interfaces/spotify"

const SELLOS = [
	{
		name: "approved",
		alt: "Sello Aprobado",
		img: SELLO_APROBADO,
	},
	{
		name: "not_approved",
		alt: "Sello No Aprobado",
		img: SELLO_NO_APROBADO,
	},
	{
		name: "meh",
		alt: "Sello Meh",
		img: SELLO_MEH,
	},
	{
		name: "perfect",
		alt: "Sello Perfecto",
		img: SELLO_PERFECTO,
	},
	{
		name: "zzz",
		alt: "Sello ZZZ",
		img: SELLO_ZZZ,
	},
]

interface BoletaInformationProps {
	selectedAlbum: SpotifyAlbumDetailResponse
	onSelectAlbum: (album: SpotifyAlbumDetailResponse | null) => void
	albumStamp: string | null
	setAlbumStamp: React.Dispatch<React.SetStateAction<string | null>>
	braveStamp: boolean
	setBraveStamp: React.Dispatch<React.SetStateAction<boolean>>
	disableExport: boolean
	onExportBoleta: () => void
	isResponsive?: boolean
}

const BoletaInformation = ({
	selectedAlbum,
	onSelectAlbum,
	albumStamp,
	setAlbumStamp,
	braveStamp,
	setBraveStamp,
	disableExport,
	onExportBoleta,
	isResponsive,
}: BoletaInformationProps) => {
	const handleGoBack = () => {
		onSelectAlbum(null)
	}

	return (
		<>
			{/* Volver */}
			<Grid
				container
				size={12}
				flexDirection="column"
				gap={1.6}
			>
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
							fontSize: {
								xs: "calc(12px * 1)",
								md: "calc(16px * 0.8)",
							},
							letterSpacing: "calc(8px * 0.8)",
							fontFamily: "'Outfit', sans-serif",
							color: "#28231D",
							lineHeight: 1,
						}}
					>
						REGRESAR AL INICIO
					</Typography>
				</Button>
			</Grid>
			{/* Album Data */}
			<Grid
				container
				size={12}
				alignItems="center"
				gap={3.6}
			>
				<Grid
					container
					size={12}
					flex={1}
					flexDirection="column"
					justifyContent="center"
					gap={1.2}
				>
					<Typography
						sx={{
							fontSize: {
								xs: "24px",
							},
							fontWeight: "900",
							lineHeight: 1,
							color: "#28231D",
							fontFamily: "'Outfit', sans-serif",
						}}
					>
						{selectedAlbum.name}
					</Typography>
					<Typography
						sx={{
							fontSize: {
								xs: "16px",
								md: "18px",
							},
							fontWeight: "300",
							lineHeight: 1,
							color: "#28231D",
							fontFamily: "'Outfit', sans-serif",
						}}
					>
						{selectedAlbum.artists.map((artist) => artist.name).join(", ")}
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
						{dayjs(selectedAlbum.release_date).format("YYYY")}
					</Typography>
				</Grid>

				<Grid
					container
					size={12}
					flex={selectedAlbum.name.length > 20 ? 0.5 : 1}
					flexDirection="column"
					justifyContent="center"
					gap={0.8}
				>
					<Typography
						sx={{
							fontSize: {
								xs: "12px",
								md: "calc(16px * 0.8)",
							},
							fontWeight: "300",
							lineHeight: 1,
							color: "#28231D",
							fontFamily: "'Outfit', sans-serif",
						}}
					>
						{selectedAlbum.total_tracks} canciones
					</Typography>
					<Typography
						sx={{
							fontSize: {
								xs: "12px",
								md: "calc(16px * 0.8)",
							},
							fontWeight: "300",
							lineHeight: 1,
							color: "#28231DB2",
							fontFamily: "'Outfit', sans-serif",
						}}
					>
						{Math.floor(
							selectedAlbum.tracks.items.reduce(
								(acc, track) => acc + track.duration_ms,
								0,
							) / 60000,
						)}{" "}
						minutos
					</Typography>
				</Grid>
			</Grid>

			{!isResponsive ? (
				<Divider
					orientation="horizontal"
					sx={{
						borderWidth: "-0.5px",
						borderColor: "#28231D",
					}}
				/>
			) : null}
			{/* Sellos */}
			<Grid
				container
				size={12}
				flexDirection="column"
				gap={{
					xs: 1.5,
					md: 1.2,
				}}
			>
				<Typography
					fontWeight={400}
					sx={{
						fontSize: {
							xs: "18px",
						},
						fontFamily: "'Outfit', sans-serif",
						color: "#28231D",
						lineHeight: 1,
					}}
				>
					Escoje un sello
				</Typography>

				<Grid
					container
					gap={{
						xs: 3,
						md: 2.4,
					}}
					flexWrap="nowrap"
					sx={{
						width: "100%",
						overflowX: "auto",
						paddingRight: {
							xs: 3,
							md: 0,
						},
					}}
					paddingBottom={{
						xs: 1.6,
						md: 0,
					}}
				>
					{SELLOS.map((sello, index) => (
						<Box
							key={index}
							sx={{
								paddingX: 0.8,
								width: isResponsive ? "80px" : "72px",
								height: isResponsive ? "80px" : "72px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								cursor: "pointer",
								borderRadius: "50%",
								transition: "all 0.3s ease",
								backgroundColor:
									albumStamp === sello.name ? "#ffffff" : "transparent",
								border:
									albumStamp === sello.name ? "1px dashed #28231D" : "none",
								"&:hover": {
									backgroundColor: "#FFFFFF",
									border: "1px dashed #28231D",
								},
							}}
							onClick={() => setAlbumStamp(sello.name)}
						>
							<img
								src={sello.img}
								alt={sello.alt}
								width={isResponsive ? 72 : 64}
								height={isResponsive ? 72 : 64}
								style={{
									cursor: "pointer",
									borderRadius: "50%",
								}}
							/>
						</Box>
					))}
				</Grid>
			</Grid>

			<Grid
				container
				size={12}
				flex={1}
				flexDirection="column"
				gap={{
					xs: 1.5,
					md: 1.2,
				}}
			>
				<Typography
					fontWeight={400}
					sx={{
						fontSize: {
							xs: "18px",
						},
						fontFamily: "'Outfit', sans-serif",
						color: "#28231D",
						lineHeight: 1,
					}}
				>
					¿Necesitaste valentía?
				</Typography>

				<Grid
					container
					size={12}
				>
					<img
						src={SELLO_VALIENTE}
						alt="Sello El Valiente"
						width="auto"
						height="96px"
						style={{
							cursor: "pointer",
							boxShadow:
								"0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)",

							border: braveStamp ? "1px solid #000" : "none",
							borderRadius: "4px",
						}}
						onClick={() => setBraveStamp((prev) => !prev)}
					/>
				</Grid>
			</Grid>

			{!isResponsive ? (
				<>
					{/* Download */}
					<Grid
						container
						size={12}
						position="relative"
						zIndex={40}
					>
						<Button
							onClick={onExportBoleta}
							disabled={disableExport}
							variant="contained"
							sx={{
								backgroundColor: "#28231D",
								borderRadius: "3.2px",
								paddingY: "6.4px",
								paddingX: "9.6px",
								textTransform: "none",
								width: "132px",
								height: "26px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								"&:hover": {
									backgroundColor: "#000000",
								},
							}}
						>
							<Typography
								fontWeight={400}
								sx={{
									fontSize: "calc(16px * 0.8)",
									fontFamily: "'Outfit', sans-serif",
									color: "#ffffff",
									lineHeight: 1,
								}}
							>
								Descarga tu boleta
							</Typography>
						</Button>
					</Grid>
					{/* Footer */}
					<Footer />
				</>
			) : null}
		</>
	)
}

export default BoletaInformation
