import { Divider, Grid, Rating, TextField, Typography } from "@mui/material"
import dayjs from "dayjs"
import Icon from "../common/components/Icon"
import { SELLO_VALIENTE } from "../common/assets"
import { SpotifyAlbumDetailResponse } from "../interfaces/spotify"
import React from "react"

interface NewBoletaProps {
	boletaRef?: React.RefObject<HTMLDivElement | null>
	selectedAlbum: SpotifyAlbumDetailResponse
	albumStampImage: string | undefined
	albumStamp: string | null
	braveStamp: boolean
	albumScore: number | null
	heartsAverage: number
	starsAverage: number
	totalAverage: number
	trackRatings: {
		[trackId: string]: {
			score: number
			favorite: number
			isHighlighted: boolean
		}
	}
	tracksOfAlbum: {
		id: string
		trackNumber: number
		name: string
		explicit: boolean
		duration: number
	}[]
	handleHighlightChange?: (trackId: string, isHighlighted: boolean) => void
	handleFavoriteChange?: (trackId: string, isFavorite: number) => void
	handleScoreChange?: (trackId: string, newScore: number) => void
	handleScoreAlbumChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	isResponsive?: boolean
}

const NewBoleta = ({
	boletaRef,
	selectedAlbum,
	albumStampImage,
	albumStamp,
	braveStamp,
	albumScore,
	heartsAverage,
	starsAverage,
	totalAverage,
	trackRatings,
	tracksOfAlbum,
	handleHighlightChange,
	handleFavoriteChange,
	handleScoreChange,
	handleScoreAlbumChange,
	isResponsive,
}: NewBoletaProps) => {
	const maxSongsToShow = 19
	const defaultTracksToShow = maxSongsToShow - tracksOfAlbum.length
	return (
		<Grid
			ref={boletaRef}
			position={boletaRef ? "fixed" : "relative"}
			top={boletaRef ? 0 : undefined}
			left={boletaRef ? 0 : undefined}
			zIndex={boletaRef ? -100 : 20}
			container
			width={800}
			height="fit-content"
			padding={2}
			bgcolor="#ffffff"
			flexDirection="column"
			boxShadow="0 4px 12px rgba(0,0,0,0.3)"
			sx={{
				overflowX: "auto",
				opacity: boletaRef ? 0 : 1,
			}}
		>
			{albumStampImage ? (
				<img
					src={albumStampImage}
					alt={albumStamp || "Sello del album"}
					width={isResponsive ? 100 : 144}
					height="auto"
					style={{
						position: "absolute",
						top: 57,
						right: braveStamp && isResponsive ? 100 : braveStamp ? 132 : 52,
					}}
				/>
			) : null}

			{braveStamp ? (
				<img
					src={SELLO_VALIENTE}
					alt={"Sello El valiente"}
					width={isResponsive ? 80 : 120}
					height="auto"
					style={{
						position: "absolute",
						top: 50,
						right: 30,
						transform: "rotate(5deg)",
					}}
				/>
			) : null}
			<Grid
				container
				size={12}
			>
				<Grid
					container
					width="fit-content"
					padding={1.2}
					border="1px solid #28231D"
				>
					<img
						src={selectedAlbum.images[0]?.url || ""}
						alt={selectedAlbum.name}
						width={isResponsive ? 150 : 205}
						height={isResponsive ? 150 : 205}
					/>
				</Grid>
				<Grid
					container
					flex={1}
					flexDirection="column"
					border="1px solid #28231D"
					borderLeft="none"
				>
					<Grid
						container
						size={12}
						padding={1.2}
						flex={1}
						flexDirection="column"
						justifyContent="space-between"
						gap={0.8}
					>
						<Typography
							fontWeight={400}
							sx={{
								fontSize: "calc(12px * 0.8)",
								color: "#28231d66",
								letterSpacing: "calc(1.2px * 0.8)",
								textTransform: "uppercase",
								lineHeight: 1,
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							Album title
						</Typography>
						<Typography
							fontWeight={900}
							sx={{
								fontSize: "calc(20px * 0.8)",
								textTransform: "uppercase",
								lineHeight: 1,
								color: "#28231D",
								fontFamily: "'Outfit', sans-serif",
								letterSpacing: "calc(2px * 0.8)",
							}}
						>
							{selectedAlbum.name}
						</Typography>
					</Grid>
					<Grid
						container
						size={12}
						padding={1.2}
						gap={0.8}
						flex={1}
						flexDirection="column"
						justifyContent="space-between"
						borderTop="1px solid #28231D"
						borderBottom="1px solid #28231D"
					>
						<Typography
							fontWeight={400}
							sx={{
								fontSize: "calc(12px * 0.8)",
								color: "#28231d66",
								letterSpacing: "calc(1.2px * 0.8)",
								textTransform: "uppercase",
								lineHeight: 1,
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							Artist(s)
						</Typography>
						<Typography
							fontWeight={900}
							sx={{
								fontSize: "calc(20px * 0.8)",
								textTransform: "uppercase",
								lineHeight: 1,
								color: "#28231D",
								fontFamily: "'Outfit', sans-serif",
								letterSpacing: "calc(2px * 0.8)",
							}}
						>
							{selectedAlbum.artists.map((artist) => artist.name).join(", ")}
						</Typography>
					</Grid>
					<Grid
						container
						size={12}
						padding={1.2}
						gap={0.8}
						flex={1}
						flexDirection="column"
						justifyContent="space-between"
					>
						<Typography
							fontWeight={400}
							sx={{
								fontSize: "calc(12px * 0.8)",
								color: "#28231d66",
								letterSpacing: "calc(1.2px * 0.8)",
								textTransform: "uppercase",
								lineHeight: 1,
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							Year
						</Typography>
						<Typography
							fontWeight={900}
							sx={{
								fontSize: "calc(20px * 0.8)",
								textTransform: "uppercase",
								lineHeight: 1,
								color: "#28231D",
								fontFamily: "'Outfit', sans-serif",
								letterSpacing: "calc(2px * 0.8)",
							}}
						>
							{dayjs(selectedAlbum.release_date).format("YYYY")}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid
				container
				size={12}
				flexDirection="column"
				flex={1}
			>
				<Grid
					container
					size={12}
					bgcolor="#28231D"
					color="#fff"
					height="44.8px"
				>
					<Divider
						orientation="vertical"
						flexItem
						sx={{
							borderColor: "#28231D",
						}}
					/>
					<Grid
						container
						padding={1.6}
						width="44.8px"
						height="44.8px"
						justifyContent="center"
						alignItems="center"
					>
						<Typography
							fontWeight={400}
							sx={{
								textTransform: "uppercase",
								fontSize: {
									xs: "calc(16px * 0.7)",
									md: "calc(16px * 0.8)",
								},
								lineHeight: 1,
								letterSpacing: "calc(1.2px * 0.8)",
								color: "#fff",
								backgroundColor: "#28231D",
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							#
						</Typography>
					</Grid>
					<Divider
						orientation="vertical"
						flexItem
						sx={{ borderColor: "#fff" }}
					/>
					<Grid
						container
						padding={1.6}
						flex={1}
						alignItems="center"
					>
						<Typography
							fontWeight={400}
							sx={{
								textTransform: "uppercase",
								fontSize: {
									xs: "calc(16px * 0.7)",
									md: "calc(16px * 0.8)",
								},
								lineHeight: 1,
								letterSpacing: "calc(1.2px * 0.8)",
								color: "#fff",
								backgroundColor: "#28231D",
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							Song title
						</Typography>
					</Grid>
					<Divider
						orientation="vertical"
						flexItem
						sx={{ borderColor: "#fff" }}
					/>
					<Grid
						container
						padding={1.6}
						width="44.8px"
						height="44.8px"
						justifyContent="center"
						alignItems="center"
						gap={0.8}
					>
						<Rating
							name={`favorite`}
							value={1}
							max={1}
							readOnly
							icon={
								<Icon
									icon="favorite"
									fontSize="inherit"
								/>
							}
							emptyIcon={
								<Icon
									icon="favoriteEmpty"
									fontSize="inherit"
								/>
							}
							sx={{
								fontSize: "19.2px",
								"& .MuiRating-iconFilled": {
									color: "#fff",
								},
							}}
						/>
					</Grid>
					<Divider
						orientation="vertical"
						flexItem
						sx={{ borderColor: "#fff" }}
					/>
					<Grid
						container
						padding={1.6}
						width="fit-content"
						alignItems="center"
					>
						<Rating
							name={`score`}
							value={5}
							max={5}
							readOnly
							sx={{
								gap: 1,
								fontSize: "19.2px",
								"& .MuiRating-iconFilled": {
									color: "#fff",
								},
							}}
						/>
					</Grid>
					<Divider
						orientation="vertical"
						flexItem
						sx={{
							borderColor: "#28231D",
						}}
					/>
				</Grid>

				<Divider
					orientation="horizontal"
					flexItem
					sx={{ borderColor: "#28231D" }}
				/>

				{tracksOfAlbum.map((track, index) => (
					<React.Fragment key={track.id}>
						<Grid
							container
							size={12}
							minHeight="44.8px"
							onClick={() =>
								handleHighlightChange?.(
									track.id,
									!trackRatings[track.id]?.isHighlighted,
								)
							}
							sx={{
								backgroundColor: trackRatings[track.id]?.isHighlighted
									? "#f7db3680"
									: "",
								cursor: "pointer",
								"&:hover": {
									backgroundColor: "#f7db3680",
								},
							}}
						>
							<Divider
								orientation="vertical"
								flexItem
								sx={{
									borderColor: "#28231D",
								}}
							/>
							<Grid
								container
								padding={1.6}
								width="44.8px"
								minHeight="44.8px"
								justifyContent="center"
								alignItems="center"
							>
								<Typography
									fontWeight={400}
									sx={{
										textTransform: "uppercase",
										fontSize: {
											xs: "calc(16px * 0.7)",
											md: "calc(16px * 0.8)",
										},
										lineHeight: 1,
										letterSpacing: "calc(1.2px * 0.8)",
										color: "#28231D",
										fontFamily: "'Outfit', sans-serif",
									}}
								>
									{index + 1}
								</Typography>
							</Grid>
							<Divider
								orientation="vertical"
								flexItem
								sx={{
									borderColor: "#28231D",
								}}
							/>
							<Grid
								container
								padding={1.6}
								flex={1}
								alignItems="center"
							>
								<Typography
									fontWeight={400}
									sx={{
										textTransform: "uppercase",
										fontSize: {
											xs: "calc(16px * 0.7)",
											md: "calc(16px * 0.8)",
										},
										lineHeight: 1,
										letterSpacing: "calc(1.2px * 0.8)",
										color: "#28231D",
										fontFamily: "'Outfit', sans-serif",
									}}
								>
									{track.name}
								</Typography>
							</Grid>
							<Divider
								orientation="vertical"
								flexItem
								sx={{
									borderColor: "#28231D",
								}}
							/>
							<Grid
								container
								padding={1.6}
								width="44.8px"
								minHeight="44.8px"
								justifyContent="center"
								alignItems="center"
								gap={0.8}
							>
								<Rating
									name={`favorite-${track.id}`}
									value={trackRatings[track.id]?.favorite}
									max={1}
									onChange={(_, newValue) =>
										handleFavoriteChange?.(track.id, newValue || 0)
									}
									icon={
										<Icon
											icon="favorite"
											fontSize="inherit"
										/>
									}
									emptyIcon={
										<Icon
											icon="favoriteEmpty"
											fontSize="inherit"
										/>
									}
									sx={{
										fontSize: "19.2px",
										"& .MuiRating-iconFilled": {
											color: "#28231D",
										},
										"& .MuiRating-iconHover": {
											color: "#28231D",
										},
									}}
								/>
							</Grid>
							<Divider
								orientation="vertical"
								flexItem
								sx={{
									borderColor: "#28231D",
								}}
							/>
							<Grid
								container
								padding={1.6}
								alignItems="center"
							>
								<Rating
									name={`score-${track.id}`}
									value={trackRatings[track.id]?.score ?? 0}
									max={5}
									onChange={(_, newValue) =>
										handleScoreChange?.(track.id, newValue || 0)
									}
									sx={{
										gap: 1,
										fontSize: "19.2px",
										color: "#28231D",
										"& label.MuiRating-label": {
											display: "none",
										},
									}}
								/>
							</Grid>
							<Divider
								orientation="vertical"
								flexItem
								sx={{
									borderColor: "#28231D",
								}}
							/>
						</Grid>
						<Divider
							flexItem
							orientation="horizontal"
							sx={{
								borderColor: "#28231D",
							}}
						/>
					</React.Fragment>
				))}
				{boletaRef && tracksOfAlbum.length < maxSongsToShow
					? [...Array(defaultTracksToShow)].map((_, index) => (
							<React.Fragment key={index}>
								<Grid
									container
									size={12}
									height="44.8px"
								>
									<Divider
										orientation="vertical"
										flexItem
										sx={{
											borderColor: "#28231D",
										}}
									/>
									<Grid
										container
										padding={1.6}
										width="44.8px"
										height="44.8px"
										justifyContent="center"
										alignItems="center"
									>
										<Typography
											fontWeight={400}
											sx={{
												textTransform: "uppercase",
												fontSize: {
													xs: "calc(16px * 0.7)",
													md: "calc(16px * 0.8)",
												},
												lineHeight: 1,
												letterSpacing: "calc(1.2px * 0.8)",
												color: "rgba(40, 35, 29, 0.1)",
												fontFamily: "'Outfit', sans-serif",
											}}
										>
											#
										</Typography>
									</Grid>
									<Divider
										orientation="vertical"
										flexItem
										sx={{
											borderColor: "#28231D",
										}}
									/>
									<Grid
										container
										padding={1.6}
										flex={1}
										alignItems="center"
									>
										<Typography
											fontWeight={400}
											sx={{
												textTransform: "uppercase",
												fontSize: {
													xs: "calc(16px * 0.7)",
													md: "calc(16px * 0.8)",
												},
												lineHeight: 1,
												letterSpacing: "calc(1.2px * 0.8)",
												color: "rgba(40, 35, 29, 0.1)",
												fontFamily: "'Outfit', sans-serif",
											}}
										>
											Song title
										</Typography>
									</Grid>
									<Divider
										orientation="vertical"
										flexItem
										sx={{
											borderColor: "#28231D",
										}}
									/>
									<Grid
										container
										padding={1.6}
										width="44.8px"
										height="44.8px"
										justifyContent="center"
										alignItems="center"
										gap={0.8}
									>
										<Rating
											readOnly
											max={1}
											icon={
												<Icon
													icon="favorite"
													fontSize="inherit"
												/>
											}
											emptyIcon={
												<Icon
													icon="favoriteEmpty"
													fontSize="inherit"
												/>
											}
											sx={{
												fontSize: "19.2px",
												opacity: 0.2,
												"& .MuiRating-iconFilled": {
													color: "#28231D",
												},
											}}
										/>
									</Grid>
									<Divider
										orientation="vertical"
										flexItem
										sx={{
											borderColor: "#28231D",
										}}
									/>
									<Grid
										container
										padding={1.6}
										alignItems="center"
									>
										<Rating
											max={5}
											readOnly
											sx={{
												gap: 1,
												fontSize: "19.2px",
												color: "#28231D",
												opacity: 0.2,
												"& label.MuiRating-label": {
													display: "none",
												},
											}}
										/>
									</Grid>
									<Divider
										orientation="vertical"
										flexItem
										sx={{
											borderColor: "#28231D",
										}}
									/>
								</Grid>
								<Divider
									flexItem
									orientation="horizontal"
									sx={{
										borderColor: "#28231D",
									}}
								/>
							</React.Fragment>
						))
					: null}
			</Grid>

			<Grid
				container
				size={12}
				sx={{
					borderTop: "17px solid #28231D",
				}}
			>
				<Divider
					orientation="vertical"
					flexItem
					sx={{ borderColor: "#28231D" }}
				/>
				<Grid
					container
					width="fit-content"
					flexDirection="column"
				>
					<Grid
						container
						size={12}
						padding={1.2}
						justifyContent="flex-end"
						alignItems="center"
						bgcolor="#d4d3d2"
						height="32px"
					>
						<Typography
							fontWeight={400}
							sx={{
								textTransform: "uppercase",
								fontSize: {
									xs: "calc(16px * 0.7)",
									md: "calc(16px * 0.8)",
								},
								lineHeight: 1,
								letterSpacing: "calc(1.2px * 0.8)",
								color: "#28231D",
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							Average from hearts
						</Typography>
					</Grid>
					<Divider
						orientation="horizontal"
						flexItem
						sx={{ borderColor: "#28231D" }}
					/>
					<Grid
						container
						size={12}
						padding={1.2}
						justifyContent="flex-end"
						alignItems="center"
						bgcolor="#d4d3d2"
						height="32px"
					>
						<Typography
							fontWeight={400}
							sx={{
								textTransform: "uppercase",
								fontSize: {
									xs: "calc(16px * 0.7)",
									md: "calc(16px * 0.8)",
								},
								lineHeight: 1,
								letterSpacing: "calc(1.2px * 0.8)",
								color: "#28231D",
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							Average from stars
						</Typography>
					</Grid>
					<Divider
						orientation="horizontal"
						flexItem
						sx={{ borderColor: "#28231D" }}
					/>
					<Grid
						container
						size={12}
						padding={1.2}
						justifyContent="flex-end"
						alignItems="center"
						bgcolor="#d4d3d2"
						flex={1}
					>
						<Typography
							fontWeight={400}
							sx={{
								textTransform: "uppercase",
								fontSize: {
									xs: "calc(16px * 0.7)",
									md: "calc(16px * 0.8)",
								},
								lineHeight: 1,
								letterSpacing: "calc(1.2px * 0.8)",
								color: "#28231D",
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							Total score
						</Typography>
					</Grid>
				</Grid>
				<Divider
					orientation="vertical"
					flexItem
					sx={{ borderColor: "#28231D" }}
				/>
				<Grid
					container
					size={12}
					flex={1}
					flexDirection="column"
				>
					<Grid
						container
						size={12}
						padding={1.2}
						alignItems="center"
						justifyContent="flex-end"
						gap={0.8}
						height="32px"
					>
						<Typography
							fontWeight={800}
							sx={{
								textTransform: "uppercase",
								fontSize: "calc(16px * 0.8)",
								lineHeight: 1,
								letterSpacing: "calc(1.2px * 0.8)",
								color: "#28231D",
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							{heartsAverage ? heartsAverage : "-"} / 10
						</Typography>
					</Grid>
					<Divider
						orientation="horizontal"
						flexItem
						sx={{ borderColor: "#28231D" }}
					/>
					<Grid
						container
						size={12}
						padding={1.2}
						alignItems="flex-end"
						justifyContent="flex-end"
						gap={0.8}
						height="32px"
					>
						<Typography
							fontWeight={800}
							sx={{
								textTransform: "uppercase",
								fontSize: "calc(16px * 0.8)",
								lineHeight: 1,
								letterSpacing: "calc(1.2px * 0.8)",
								color: "#28231D",
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							{starsAverage ? starsAverage : "-"} / 10
						</Typography>
					</Grid>
					<Divider
						orientation="horizontal"
						flexItem
						sx={{ borderColor: "#28231D" }}
					/>
					<Grid
						container
						size={12}
						padding={1.2}
						alignItems="center"
						justifyContent="flex-end"
						gap={0.8}
						height="38.4px"
					>
						<Typography
							fontWeight={800}
							sx={{
								textTransform: "uppercase",
								fontSize: "calc(24px * 0.8)",
								lineHeight: 1,
								letterSpacing: "calc(1.2px * 0.8)",
								color: "#28231D",
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							{totalAverage ? totalAverage : "-"} / 10
						</Typography>
					</Grid>
				</Grid>
				<Divider
					orientation="vertical"
					flexItem
					sx={{ borderColor: "#28231D" }}
				/>
				<Grid
					container
					size={3}
					flexDirection="column"
				>
					<Grid
						container
						size={12}
						padding={1.2}
						justifyContent="center"
						alignItems="center"
						bgcolor="#d4d3d2"
						height="32px"
					>
						<Typography
							fontWeight={400}
							sx={{
								textTransform: "uppercase",
								fontSize: {
									xs: "calc(16px * 0.7)",
									md: "calc(16px * 0.8)",
								},
								lineHeight: 1,
								letterSpacing: "calc(1.2px * 0.8)",
								color: "#28231D",
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							Your score
						</Typography>
					</Grid>
					<Divider
						orientation="horizontal"
						flexItem
						sx={{ borderColor: "#28231D" }}
					/>
					<Grid
						container
						size={12}
						padding={0.8}
						flex={1}
						gap={0.8}
						justifyContent="center"
						alignItems="center"
						position="relative"
					>
						<TextField
							variant="outlined"
							type="number"
							slotProps={{
								htmlInput: { step: 0.1, min: 1, max: 10 },
							}}
							placeholder="-"
							value={albumScore !== null ? albumScore : ""}
							onChange={handleScoreAlbumChange}
							onInput={(e) => {
								const input = e.target as HTMLInputElement
								if (/^\d+(\.\d{0,1})?$/.test(input.value) === false) {
									input.value = input.value.slice(0, input.value.length - 1)
								}
							}}
							sx={{
								input: {
									fontSize: {
										xs: "calc(48px * 0.7)",
										md: "calc(48px * 0.8)",
									},
									textAlign: "center",
									fontWeight: "bold",
									fontFamily: "'Outfit', sans-serif",
									color: "#000",
									padding: 0,
								},
								fieldset: {
									border: "none",
								},
							}}
						/>
						<Typography
							variant="subtitle1"
							sx={{
								position: "absolute",
								right: isResponsive ? 6 : 16,
								bottom: isResponsive ? 8 : 16,
								fontWeight: 800,
								textTransform: "uppercase",
								fontSize: "calc(24px * 0.8)",
								lineHeight: 1,
								letterSpacing: "calc(1.2px * 0.8)",
								color: "#28231D",
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							/ 10
						</Typography>
					</Grid>
				</Grid>
				<Divider
					orientation="vertical"
					flexItem
					sx={{ borderColor: "#28231D" }}
				/>
			</Grid>
			<Grid
				container
				size={12}
				bgcolor="#28231D"
				height="24px"
				justifyContent="center"
				alignItems="center"
			>
				<Typography
					fontWeight="700"
					textAlign="center"
					sx={{
						fontSize: "calc(14px * 0.8)",
						lineHeight: 1,
						color: "#fff",
						fontFamily: "'Outfit', sans-serif",
					}}
				>
					@losclubsdejohnny
				</Typography>
			</Grid>
		</Grid>
	)
}

export default NewBoleta
