import { Button, Grid, Typography, useMediaQuery } from "@mui/material"
import useBoleta from "../../modules/hooks/useBoleta"
import Insignias from "../../common/components/Insignias"
import NewBoleta from "../../modules/NewBoleta"
import Cartelera from "../../modules/Cartelera"
import BoletaInformation from "../../modules/BoletaInformation"
import AlbumSearch from "../../modules/AlbumSearch"
import Footer from "../../modules/Footer"

function LandingPage() {
	const {
		boletaRef,
		setSpotifyAlbumId,
		disableExport,
		selectedAlbum,
		handleSelectAlbum,
		tracksOfAlbum,
		trackRatings,
		heartsAverage,
		starsAverage,
		totalAverage,
		albumScore,
		albumStampImage,
		albumStamp,
		setAlbumStamp,
		braveStamp,
		setBraveStamp,
		handleScoreChange,
		handleFavoriteChange,
		handleHighlightChange,
		handleScoreAlbumChange,
		onExportBoleta,
	} = useBoleta()

	const isResponsive = useMediaQuery("(max-width: 900px)")

	return (
		<Grid
			container
			size={12}
			height={isResponsive ? "auto" : "100dvh"}
			minHeight={isResponsive ? "100dvh" : 800}
			bgcolor="#F7F4EF"
			alignItems={{
				xs: "flex-start",
				md: "center",
			}}
			flexWrap="nowrap"
			sx={{
				position: "relative",
				overflowY: {
					xs: "auto",
					md: "hidden",
				},
				overflowX: "hidden",
			}}
		>
			{/* Imágen Insignias */}
			<Insignias isResponsive={isResponsive} />

			{selectedAlbum ? (
				<NewBoleta
					boletaRef={boletaRef}
					selectedAlbum={selectedAlbum}
					tracksOfAlbum={tracksOfAlbum}
					trackRatings={trackRatings}
					heartsAverage={heartsAverage}
					starsAverage={starsAverage}
					totalAverage={totalAverage}
					albumScore={albumScore}
					albumStampImage={albumStampImage}
					albumStamp={albumStamp}
					braveStamp={braveStamp}
					handleScoreChange={handleScoreChange}
					handleFavoriteChange={handleFavoriteChange}
					handleHighlightChange={handleHighlightChange}
					handleScoreAlbumChange={handleScoreAlbumChange}
				/>
			) : null}

			{isResponsive ? (
				<Grid
					container
					size={12}
					flexDirection="column"
					flexWrap="nowrap"
				>
					<Grid
						container
						gap={3}
						flexDirection="column"
						padding={{
							xs: 4.5,
							md: 0,
						}}
						position="relative"
						zIndex={30}
						sx={{
							backgroundColor: "#EFE9DB",
						}}
					>
						{selectedAlbum ? (
							<BoletaInformation
								selectedAlbum={selectedAlbum}
								onSelectAlbum={handleSelectAlbum}
								albumStamp={albumStamp}
								setAlbumStamp={setAlbumStamp}
								braveStamp={braveStamp}
								setBraveStamp={setBraveStamp}
								disableExport={disableExport}
								onExportBoleta={onExportBoleta}
								isResponsive={isResponsive}
							/>
						) : (
							<AlbumSearch
								setSpotifyAlbumId={setSpotifyAlbumId}
								isResponsive={isResponsive}
							/>
						)}
					</Grid>

					<Grid
						container
						size={12}
						flex={1}
						paddingY={6}
						paddingX={{
							xs: selectedAlbum ? 2.25 : 0,
						}}
						sx={{
							position: "relative",
							zIndex: 20,
						}}
					>
						{selectedAlbum ? (
							<NewBoleta
								selectedAlbum={selectedAlbum}
								tracksOfAlbum={tracksOfAlbum}
								trackRatings={trackRatings}
								heartsAverage={heartsAverage}
								starsAverage={starsAverage}
								totalAverage={totalAverage}
								albumScore={albumScore}
								albumStampImage={albumStampImage}
								albumStamp={albumStamp}
								braveStamp={braveStamp}
								handleScoreChange={handleScoreChange}
								handleFavoriteChange={handleFavoriteChange}
								handleHighlightChange={handleHighlightChange}
								handleScoreAlbumChange={handleScoreAlbumChange}
								isResponsive={isResponsive}
							/>
						) : (
							<Cartelera
								onSelectAlbum={handleSelectAlbum}
								isResponsive={isResponsive}
							/>
						)}
					</Grid>

					{selectedAlbum ? (
						<Grid
							container
							size={12}
							justifyContent="center"
							alignItems="center"
							position="relative"
							zIndex={40}
							sx={{
								padding: 4.5,
								backgroundColor: "#EFE9DB",
							}}
						>
							<Button
								onClick={onExportBoleta}
								disabled={disableExport}
								variant="contained"
								fullWidth
								sx={{
									backgroundColor: "#28231D",
									borderRadius: "3.2px",
									paddingY: "6.4px",
									paddingX: "9.6px",
									textTransform: "none",
									height: "32px",
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
					) : null}
					<Footer />
				</Grid>
			) : (
				<>
					<Grid
						container
						flex={1}
						height="100%"
						justifyContent="center"
						alignItems="center"
						padding={{
							xs: 2,
							sm: 6,
							md: 8,
							lg: 10,
						}}
						sx={{
							overflow: "auto",
							"&::-webkit-scrollbar": {
								width: "6px",
							},
							"&::-webkit-scrollbar-track": {
								background: "#f1f1f1",
								borderRadius: "6px",
							},
							"&::-webkit-scrollbar-thumb": {
								background: "#c4c4c4",
								borderRadius: "6px",
							},
							"&::-webkit-scrollbar-thumb:hover": {
								background: "#a0a0a0",
							},
						}}
					>
						{selectedAlbum ? (
							<NewBoleta
								selectedAlbum={selectedAlbum}
								tracksOfAlbum={tracksOfAlbum}
								trackRatings={trackRatings}
								heartsAverage={heartsAverage}
								starsAverage={starsAverage}
								totalAverage={totalAverage}
								albumScore={albumScore}
								albumStampImage={albumStampImage}
								albumStamp={albumStamp}
								braveStamp={braveStamp}
								handleScoreChange={handleScoreChange}
								handleFavoriteChange={handleFavoriteChange}
								handleHighlightChange={handleHighlightChange}
								handleScoreAlbumChange={handleScoreAlbumChange}
							/>
						) : (
							/* Cartelera */
							<Cartelera onSelectAlbum={handleSelectAlbum} />
						)}
					</Grid>
					<Grid
						container
						flex={1}
						justifyContent="center"
						height="100%"
						flexDirection="column"
						padding={{
							xs: 2,
							sm: 6,
							md: 8,
							lg: 10,
						}}
						bgcolor="#EFE9DB"
					>
						<Grid
							container
							justifyContent="center"
							gap={3.6}
							flex={1}
							flexDirection="column"
							zIndex={20}
						>
							{selectedAlbum ? (
								<BoletaInformation
									selectedAlbum={selectedAlbum}
									onSelectAlbum={handleSelectAlbum}
									albumStamp={albumStamp}
									setAlbumStamp={setAlbumStamp}
									braveStamp={braveStamp}
									setBraveStamp={setBraveStamp}
									disableExport={disableExport}
									onExportBoleta={onExportBoleta}
								/>
							) : (
								<AlbumSearch setSpotifyAlbumId={setSpotifyAlbumId} />
							)}
						</Grid>
					</Grid>
				</>
			)}
		</Grid>
	)
}

export default LandingPage
