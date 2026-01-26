import {
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tooltip,
} from "@mui/material"
import { useLocation, useNavigate } from "react-router"
import { useSidebarStore } from "../../store/SidebarStore"
import Icon from "./Icon"
import { icons } from "./icons"

interface RouteItem {
	title: string
	icon: keyof typeof icons
	path: string
}

const routes: RouteItem[] = [
	{
		title: "Carteleras",
		icon: "dashboard",
		path: "/dashboard",
	},
	{
		title: "Review Friday",
		icon: "calendar",
		path: "/review-friday",
	},
]

const Sidebar = () => {
	const { isOpen, toggle } = useSidebarStore()
	const navigate = useNavigate()
	const location = useLocation()

	const handleNavigation = (path: string) => {
		navigate(path)
	}

	return (
		<Grid
			container
			width={isOpen ? 220 : 64}
			sx={{
				position: "absolute",
				left: 0,
				zIndex: 29,
				height: "100%",
				bgcolor: "#F7F4EF",
				boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
				transition: "all 0.3s ease",
				flexDirection: "column",
			}}
		>
			<Grid
				sx={{
					position: "absolute",
					top: 16,
					right: -16,
				}}
			>
				<IconButton
					onClick={toggle}
					size="small"
					sx={{
						color: "#28231D",
						backgroundColor: "#F7F4EF",
						boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.1)",
						border: "1px solid #28231D",
						"&:hover": { backgroundColor: "#F5F5F5" },
					}}
				>
					<Icon icon={isOpen ? "arrowLeft" : "arrowRight"} />
				</IconButton>
			</Grid>
			<Grid
				container
				size={12}
				paddingTop={10}
				paddingX={{
					xs: 1,
				}}
				sx={{
					transition: "all 0.3s ease",
					justifyContent: "center",
				}}
			>
				<List
					disablePadding
					sx={{
						flexDirection: "column",
						display: "flex",
						gap: 1,
						width: "100%",
						alignItems: {
							xs: isOpen ? "flex-start" : "center",
						},
						transition: "all 0.3s ease",
					}}
				>
					{routes.map((route) => {
						const isActive = location.pathname === route.path

						return (
							<ListItem
								disablePadding
								key={route.path}
								sx={{
									transition: "all 0.3s ease",
									width: isOpen ? "100%" : "48px",
									overflow: "hidden",
								}}
							>
								<Tooltip
									title={isOpen ? "" : route.title}
									placement="right"
									arrow
									disableInteractive
								>
									<ListItemButton
										onClick={() => handleNavigation(route.path)}
										sx={{
											height: 48,
											px: isOpen ? 2 : 1.5,
											transition: "all 0.3s ease",
											backgroundColor: isActive ? "#28231D" : "transparent",
											borderRadius: "4px",
											"&:hover": {
												backgroundColor: isActive ? "#28231D" : "#E0DCCF",
											},
										}}
									>
										<ListItemIcon
											sx={{
												minWidth: 0,
												mr: 2,
												justifyContent: "center",
												color: isActive ? "#FFFFFF" : "#28231D",
											}}
										>
											<Icon icon={route.icon} />
										</ListItemIcon>

										<ListItemText
											primary={route.title}
											sx={{
												transition: "opacity 0.3s ease",
												color: isActive ? "#FFFFFF" : "#28231D",
												textWrap: "nowrap",
											}}
										/>
									</ListItemButton>
								</Tooltip>
							</ListItem>
						)
					})}
				</List>
			</Grid>
		</Grid>
	)
}

export default Sidebar
