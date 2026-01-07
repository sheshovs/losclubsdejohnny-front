import { useState } from "react"
import { IN_DORADO, IN_HOLO, IN_NEGRA, IN_PLATEADO, IN_ROJO } from "../assets"

const INSIGNIAS_TOP = [
	{
		src: IN_ROJO,
		alt: "Roja",
	},
	{
		src: IN_DORADO,
		alt: "Dorada",
	},
	{
		src: IN_HOLO,
		alt: "Holográfica",
	},
	{
		src: IN_HOLO,
		alt: "Holográfica",
	},
	{
		src: IN_PLATEADO,
		alt: "Plateada",
	},
	{
		src: IN_NEGRA,
		alt: "Negra",
	},
	{
		src: IN_NEGRA,
		alt: "Negra",
	},
	{
		src: IN_NEGRA,
		alt: "Negra",
	},
]

const INSIGNIAS_CORNER = [
	{
		src: IN_ROJO,
		alt: "Roja",
	},
	{
		src: IN_ROJO,
		alt: "Roja",
	},
	{
		src: IN_NEGRA,
		alt: "Negra",
	},
	{
		src: IN_NEGRA,
		alt: "Negra",
	},
	{
		src: IN_DORADO,
		alt: "Dorada",
	},
	{
		src: IN_HOLO,
		alt: "Holográfica",
	},
	{
		src: IN_PLATEADO,
		alt: "Plateada",
	},
	{
		src: IN_PLATEADO,
		alt: "Plateada",
	},
	{
		src: IN_PLATEADO,
		alt: "Plateada",
	},
]

const INSIGNIAS_CENTER = [
	{
		src: IN_DORADO,
		alt: "Dorada",
	},
	{
		src: IN_HOLO,
		alt: "Holográfica",
	},
	{
		src: IN_PLATEADO,
		alt: "Plateada",
	},
	{
		src: IN_PLATEADO,
		alt: "Plateada",
	},
	{
		src: IN_ROJO,
		alt: "Roja",
	},
	{
		src: IN_ROJO,
		alt: "Roja",
	},
	{
		src: IN_NEGRA,
		alt: "Negra",
	},
]

interface InsigniasProps {
	isResponsive?: boolean
}

const Insignias = ({ isResponsive }: InsigniasProps) => {
	const responsiveScaleMax = isResponsive ? 0.6 : 0.8
	const responsiveScale = isResponsive ? 0.4 : 0.6
	const [position] = useState({
		insigniasTop: Array(INSIGNIAS_TOP.length)
			.fill(0)
			.map(() => ({
				top: isResponsive
					? Math.floor(Math.random() * 7) + 21
					: Math.floor(Math.random() * 10) - 2,
				left: isResponsive
					? Math.floor(Math.random() * 80) - 5
					: Math.floor(Math.random() * 30) - 2,
				rotation: Math.floor(Math.random() * 180),
				scale:
					Math.random() * (responsiveScaleMax - responsiveScale) +
					responsiveScale,
			})),
		insigniasCorner: Array(INSIGNIAS_CORNER.length)
			.fill(0)
			.map(() => ({
				bottom: isResponsive
					? Math.floor(Math.random() * 10) - 8
					: Math.floor(Math.random() * 15) - 3,
				left: isResponsive
					? Math.floor(Math.random() * 80) + 10
					: Math.floor(Math.random() * 15) - 3,
				rotation: Math.floor(Math.random() * 180),
				scale:
					Math.random() * (responsiveScaleMax - responsiveScale) +
					responsiveScale,
			})),
		insigniasCenter: Array(INSIGNIAS_CENTER.length)
			.fill(0)
			.map(() => ({
				bottom: isResponsive
					? Math.floor(Math.random() * 10) - 8
					: Math.floor(Math.random() * 15) - 3,
				left: Math.floor(Math.random() * 30) + 20,
				rotation: Math.floor(Math.random() * 180),
				scale:
					Math.random() * (responsiveScaleMax - responsiveScale) +
					responsiveScale,
			})),
	})

	const { insigniasTop, insigniasCorner, insigniasCenter } = position

	return (
		<>
			{INSIGNIAS_TOP.map(({ src, alt }, index) => {
				return (
					<img
						key={index}
						src={src}
						alt={`Insignia ${alt}`}
						style={{
							position: "absolute",
							left: `${insigniasTop[index].left}%`,
							top: `${insigniasTop[index].top}%`,
							transform: `rotate(${insigniasTop[index].rotation}deg) scale(${insigniasTop[index].scale})`,
							zIndex: 10,
						}}
					/>
				)
			})}

			{INSIGNIAS_CORNER.map(({ src, alt }, index) => {
				return (
					<img
						key={index}
						src={src}
						alt={`Insignia ${alt}`}
						style={{
							position: "absolute",
							left: `${insigniasCorner[index].left}%`,
							bottom: `${insigniasCorner[index].bottom}%`,
							transform: `rotate(${insigniasCorner[index].rotation}deg) scale(${insigniasCorner[index].scale})`,
							zIndex: 10,
						}}
					/>
				)
			})}

			{INSIGNIAS_CENTER.map(({ src, alt }, index) => {
				return (
					<img
						key={index}
						src={src}
						alt={`Insignia ${alt}`}
						style={{
							position: "absolute",
							left: `${insigniasCenter[index].left}%`,
							bottom: `${insigniasCenter[index].bottom}%`,
							transform: `rotate(${insigniasCenter[index].rotation}deg) scale(${insigniasCenter[index].scale})`,
							zIndex: 10,
						}}
					/>
				)
			})}
		</>
	)
}

export default Insignias
