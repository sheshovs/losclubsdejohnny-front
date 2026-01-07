import type { SvgIconProps } from "@mui/material"
import { icons } from "./icons"

interface IconProps extends SvgIconProps {
	icon: keyof typeof icons
}
const Icon: React.FunctionComponent<IconProps> = ({ icon, ...props }) => {
	const IconComponent = icons[icon]
	return <IconComponent {...props} />
}

export default Icon
