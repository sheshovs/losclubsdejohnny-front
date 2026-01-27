import {
	Box,
	CircularProgress,
	Divider,
	Grid,
	TextField,
	Typography,
} from "@mui/material"
import Footer from "./Footer"
import React, { useMemo, useState } from "react"
import { useSpotifyAlbumsByArtist } from "../query/useSpotifyQuery"
import useDebounce from "../hooks/useDebounce"
import dayjs from "dayjs"

interface AlbumSearchProps {
	setSpotifyAlbumId: React.Dispatch<React.SetStateAction<string | null>>
	isResponsive?: boolean
}

const AlbumSearch = ({ setSpotifyAlbumId, isResponsive }: AlbumSearchProps) => {
	const [searchTerm, setSearchTerm] = useState("")
	const searchText = useDebounce(searchTerm, 500)

	const textFieldRef = React.useRef<HTMLInputElement>(null)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value)
	}

	const { data: artistAlbumsData, isLoading: isLoadingData } =
		useSpotifyAlbumsByArtist({
			artist: searchText,
		})

	const artistAlbums = useMemo(() => {
		return artistAlbumsData?.items || []
	}, [artistAlbumsData])

	const handleSelectAlbum = (albumId: string) => {
		setSpotifyAlbumId(albumId)
	}

	return (
		<>
			{/* Cabecera */}
			<Grid
				container
				size={12}
				flexDirection="column"
				gap={{
					xs: 1,
					md: 1.6,
				}}
			>
				<Typography
					fontWeight="300"
					sx={{
						fontSize: "calc(24px * 0.8)",
						fontFamily: "'Outfit', sans-serif",
						color: "#28231DB2",
						lineHeight: 1,
					}}
				>
					Bienvenides a
				</Typography>
				<Typography
					fontWeight="900"
					sx={{
						fontSize: "calc(48px * 0.8)",
						fontFamily: "'Outfit', sans-serif",
						color: "#28231D",
						lineHeight: 1,
					}}
				>
					Johnny’s Foolclub
				</Typography>
			</Grid>
			{/* Instrucciones */}
			<Grid
				container
				size={12}
				flexDirection="column"
				gap={{
					xs: 1,
					md: 0.8,
				}}
			>
				<Typography
					fontWeight="300"
					sx={{
						fontSize: "calc(16px * 0.8)",
						fontFamily: "'Outfit', sans-serif",
						color: "#28231D",
						letterSpacing: "calc(5.5px * 0.8)",
						textTransform: "uppercase",
						lineHeight: 1,
					}}
				>
					¿Cómo usar esta página?
				</Typography>
				<Typography
					fontWeight="400"
					sx={{
						fontSize: "calc(24px * 0.8)",
						fontFamily: "'Outfit', sans-serif",
						color: "#28231D",
						lineHeight: 1,
						paddingLeft: 1,
					}}
				>
					1. Busca tu álbum
				</Typography>
				<Typography
					fontWeight="400"
					sx={{
						fontSize: "calc(24px * 0.8)",
						fontFamily: "'Outfit', sans-serif",
						color: "#28231D",
						lineHeight: 1,
						paddingLeft: 1,
					}}
				>
					2. Califica cada canción usando nuestra{" "}
					<a
						href="https://www.instagram.com/p/DT6LsOmkVdg/"
						target="_blank"
						rel="noopener noreferrer"
						style={{
							color: "#28231D",
							textDecoration: "underline",
						}}
					>
						guía
					</a>
				</Typography>
				<Typography
					fontWeight="400"
					sx={{
						fontSize: "calc(24px * 0.8)",
						fontFamily: "'Outfit', sans-serif",
						color: "#28231D",
						lineHeight: 1,
						paddingLeft: 1,
					}}
				>
					3. ¡Descárgala y compártela!
				</Typography>
			</Grid>
			{/* Buscador */}
			<Grid
				container
				size={12}
				flex={{
					xs: 0,
					md: 1,
				}}
				flexDirection="column"
			>
				<TextField
					inputRef={textFieldRef}
					onChange={handleChange}
					value={searchTerm}
					size="small"
					label="Busca tu álbum..."
					sx={{
						backgroundColor: "#FFFFFF",
						border: "1px solid #28231D",
						borderBottom:
							artistAlbums.length || isLoadingData
								? "none"
								: "1px solid #28231D",
						borderRadius: "6px",
						borderBottomLeftRadius:
							artistAlbums.length || isLoadingData ? "0px" : "6px",
						borderBottomRightRadius:
							artistAlbums.length || isLoadingData ? "0px" : "6px",
						label: {
							fontSize: "calc(12px * 0.8)",
							color: "#28231DB2",
							"&[data-shrink='true']": {
								display: "none",
							},
						},
						input: {
							fontSize: "calc(12px * 0.8)",
							fontFamily: "'Outfit', sans-serif",
						},
						fieldset: {
							border: "none",
						},
					}}
				/>

				{isLoadingData && (
					<Grid
						container
						size={12}
						maxHeight={418}
						overflow="auto"
						justifyContent="center"
						sx={{
							backgroundColor: "#ffffff",
							borderBottomLeftRadius: "6px",
							borderBottomRightRadius: "6px",
							border: "1px solid #28231D",
							borderTop: "none",
							paddingTop: 0.75,
							paddingBottom: 1.5,
						}}
					>
						<CircularProgress
							size={24}
							sx={{
								color: "#28231D",
							}}
						/>
					</Grid>
				)}

				{artistAlbums.length > 0 && (
					<Grid
						container
						size={12}
						maxHeight={418}
						overflow="auto"
						sx={{
							position: isResponsive ? "absolute" : "relative",
							width: isResponsive ? "calc(100% - 72px)" : "100%",
							top:
								textFieldRef.current && isResponsive
									? textFieldRef.current.getBoundingClientRect()["bottom"]
									: "auto",
							backgroundColor: "#ffffff",
							borderBottomLeftRadius: "6px",
							borderBottomRightRadius: "6px",
							border: "1px solid #28231D",
							borderTop: "none",
							paddingTop: 0.75,
							paddingBottom: 1.5,
							// scrollbar styles
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
						{artistAlbums.map((album, index) => (
							<React.Fragment key={index}>
								<Grid
									key={index}
									container
									size={12}
									gap={2.4}
									sx={{
										cursor: "pointer",
										"&:hover": {
											backgroundColor: "#28231D29",
										},
									}}
									onClick={() => handleSelectAlbum(album.id)}
								>
									<Box
										sx={{
											width: "80px",
											height: "80px",
											padding: 1,
										}}
									>
										<img
											src={album.images[0].url}
											alt={album.name}
											style={{
												width: "64px",
												height: "64px",
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
											{album.artists.map((artist) => artist.name).join(", ")}
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
								</Grid>
								{index < artistAlbums.length - 1 && (
									<Divider
										orientation="horizontal"
										flexItem
										sx={{
											width: "100%",
											backgroundColor: "#28231D",
										}}
									/>
								)}
							</React.Fragment>
						))}
					</Grid>
				)}
			</Grid>

			{!isResponsive ? (
				<>
					{/* Footer */}
					<Footer />
				</>
			) : null}
		</>
	)
}

export default AlbumSearch
