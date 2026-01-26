import { Grid, IconButton, Typography } from "@mui/material"
import { LOGO_GLASSES } from "../assets"
import Icon from "./Icon"

interface HeaderDashboardProps {
	onLogout: () => void
}

const HeaderDashboard = ({ onLogout }: HeaderDashboardProps) => {
	return (
		<Grid
			container
			size={12}
			height="60px"
			sx={{
				paddingX: 4,
				alignItems: "center",
				boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
				zIndex: 30,
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
						textAlign: "center",
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
	)
}

export default HeaderDashboard
