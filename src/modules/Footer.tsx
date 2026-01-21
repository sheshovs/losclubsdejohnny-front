import { Grid, Link, Typography } from "@mui/material"
import { Link as RouterLink } from "react-router"
import {
	LOGO_INSTAGRAM,
	LOGO_TIKTOK,
	LOGO_DISCORD,
	LOGO_GLASSES,
} from "../common/assets"
import dayjs from "dayjs"

const Footer = () => {
	return (
		<Grid
			container
			size={12}
			gap={2.4}
			padding={{
				xs: 4.5,
				md: 0,
			}}
			position="relative"
			zIndex={20}
			sx={{
				backgroundColor: "#EFE9DB",
			}}
		>
			<Grid
				container
				size={12}
				alignItems={{
					xs: "flex-start",
					md: "center",
				}}
				flexDirection={{
					xs: "column",
					md: "row",
				}}
				gap={{
					xs: 1,
					md: 0,
				}}
			>
				<Grid
					container
					flex={1}
					alignItems="center"
					gap={1.6}
				>
					<Typography
						fontWeight={900}
						sx={{
							fontSize: "calc(16px * 0.8)",
							letterSpacing: "calc(8px * 0.8)",
							fontFamily: "'Outfit', sans-serif",
							color: "#28231D",
							textTransform: "uppercase",
							lineHeight: 1,
						}}
					>
						Siguenos en
					</Typography>
					<Link
						href="https://www.instagram.com/losclubsdejohnny/"
						target="_blank"
						rel="noopener noreferrer"
						underline="none"
					>
						<Typography
							fontWeight={300}
							sx={{
								fontSize: "calc(16px * 0.8)",
								fontFamily: "'Outfit', sans-serif",
								color: "#28231D",
								lineHeight: 1,
								gap: 0.8,
								display: "flex",
								alignItems: "center",
							}}
						>
							<img
								src={LOGO_INSTAGRAM}
								width={15 * 0.8}
								height={15 * 0.8}
							/>
							Instagram
						</Typography>
					</Link>
					<Link
						href="https://www.tiktok.com/@losclubsdejohnny"
						target="_blank"
						rel="noopener noreferrer"
						underline="none"
					>
						<Typography
							fontWeight={300}
							sx={{
								fontSize: "calc(16px * 0.8)",
								fontFamily: "'Outfit', sans-serif",
								color: "#28231D",
								lineHeight: 1,
								gap: 0.8,
								display: "flex",
								alignItems: "center",
							}}
						>
							<img
								src={LOGO_TIKTOK}
								width={11.6 * 0.8}
								height={13 * 0.8}
							/>
							TikTok
						</Typography>
					</Link>
				</Grid>

				<Link
					href="https://www.instagram.com/losclubsdejohnny/"
					target="_blank"
					rel="noopener noreferrer"
					underline="none"
				>
					<Typography
						fontWeight={300}
						sx={{
							fontSize: "calc(16px * 0.8)",
							fontFamily: "'Outfit', sans-serif",
							color: "#28231D",
							lineHeight: 1,
							gap: 0.8,
							display: "flex",
							alignItems: "center",
						}}
					>
						<img
							src={LOGO_DISCORD}
							width={21 * 0.8}
							height={16 * 0.8}
						/>
						Únete a nuestro Discord
					</Typography>
				</Link>
			</Grid>
			<Grid
				container
				size={12}
				alignItems={{
					xs: "flex-start",
					md: "center",
				}}
				flexDirection={{
					xs: "column",
					md: "row",
				}}
				gap={{
					xs: 1,
					md: 0,
				}}
			>
				<Grid
					container
					flex={1}
					alignItems="center"
					gap={0.8}
				>
					<Typography
						fontWeight={900}
						sx={{
							fontSize: "calc(16px * 0.8)",
							letterSpacing: "calc(8px * 0.8)",
							fontFamily: "'Outfit', sans-serif",
							color: "#28231D",
							textTransform: "uppercase",
							lineHeight: 1,
						}}
					>
						{dayjs().year()}
						<Typography
							fontWeight={300}
							sx={{
								display: "inline",
								fontSize: "calc(16px * 0.8)",
								fontFamily: "'Outfit', sans-serif",
								color: "#28231D",
								lineHeight: 1.4,
								textTransform: "none",
							}}
						>
							– Created by Johnny Cat (
							<a
								href="https://www.instagram.com/srjohnnycat/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: "#28231D",
									textDecoration: "underline",
								}}
							>
								@SrJohnnyCat
							</a>
							) and Sergio Vargas (
							<a
								href="https://www.instagram.com/s.vrgs/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: "#28231D",
									textDecoration: "underline",
								}}
							>
								@s.vrgs
							</a>
							)
						</Typography>
					</Typography>
				</Grid>
				<Grid
					container
					flex={0.5}
					justifyContent="flex-end"
					alignItems="center"
					gap={0.8}
				>
					<RouterLink
						to="/login"
						style={{
							textDecoration: "none",
						}}
					>
						<Typography
							fontWeight={300}
							sx={{
								fontSize: "calc(16px * 0.8)",
								fontFamily: "'Outfit', sans-serif",
								color: "#28231D",
								lineHeight: 1,
								gap: 0.8,
								display: "flex",
								alignItems: "center",
							}}
						>
							<img
								src={LOGO_GLASSES}
								width={32 * 0.8}
								height={16 * 0.8}
							/>
							Iniciar sesión
						</Typography>
					</RouterLink>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default Footer
