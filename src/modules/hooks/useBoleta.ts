import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
	SELLO_APROBADO,
	SELLO_NO_APROBADO,
	SELLO_PERFECTO,
	SELLO_MEH,
	SELLO_ZZZ,
	SELLO_PRISM,
} from "../../common/assets"
import { useSpotifyAlbumById } from "../../query/useSpotifyQuery"
import { SpotifyAlbumDetailResponse } from "../../interfaces/spotify"
import download from "downloadjs"
import html2canvas from "html2canvas"
import ReactGA from 'react-ga4';

const stampsImg = {
	approved: SELLO_APROBADO,
	not_approved: SELLO_NO_APROBADO,
	perfect: SELLO_PERFECTO,
	meh: SELLO_MEH,
	zzz: SELLO_ZZZ,
	prism: SELLO_PRISM,
}

const useBoleta = () => {
	const boletaRef = useRef<HTMLDivElement>(null)
	const [spotifyAlbumId, setSpotifyAlbumId] = useState<string | null>(null)
	const [selectedAlbum, setSelectedAlbum] =
		useState<SpotifyAlbumDetailResponse | null>(null)

	const { data: spotifyAlbumData } = useSpotifyAlbumById({
		albumId: spotifyAlbumId || ``,
	})

	const handleSelectAlbum = (album: SpotifyAlbumDetailResponse | null) => {
		setSelectedAlbum(album)
	}

	const tracksOfAlbum = useMemo(() => {
		return (
			selectedAlbum?.tracks.items.map((track) => ({
				id: track.id,
				trackNumber: track.track_number,
				name: track.name,
				explicit: track.explicit,
				duration: track.duration_ms,
			})) || []
		)
	}, [selectedAlbum])

	const [trackRatings, setTrackRatings] = useState<{
		[trackId: string]: {
			score: number
			favorite: number
			isHighlighted: boolean
		}
	}>({})

	const { heartsAverage, starsAverage, totalAverage } = useMemo(() => {
		const heartsAverage =
			Object.values(trackRatings).reduce(
				(acc, rating) => acc + rating.favorite * 10,
				0
			) / tracksOfAlbum.length
		const starsAverage =
			(Object.values(trackRatings).reduce(
				(acc, rating) => acc + rating.score,
				0
			) *
				2) /
			tracksOfAlbum.length
		const totalAverage = (heartsAverage + starsAverage) / 2

		return {
			heartsAverage: Math.round(heartsAverage * 10) / 10,
			starsAverage: Math.round(starsAverage * 10) / 10,
			totalAverage: Math.round(totalAverage * 10) / 10,
		}
	}, [trackRatings, tracksOfAlbum])

	const [albumScore, setAlbumScore] = useState<number | null>(null)
	const [albumStamp, setAlbumStamp] = useState<string | null>(null)
	const [braveStamp, setBraveStamp] = useState<boolean>(false)

	const albumStampImage = useMemo(() => {
		if (albumStamp && albumStamp in stampsImg) {
			return stampsImg[albumStamp as keyof typeof stampsImg]
		}
	}, [albumStamp])

	useEffect(() => {
		setTrackRatings({})
		setAlbumScore(null)
		setAlbumStamp(null)
		setBraveStamp(false)
	}, [selectedAlbum])

	useEffect(() => {
		setTrackRatings(
			tracksOfAlbum.reduce((acc, track) => {
				acc[track.id] = { score: 0, favorite: 0, isHighlighted: false }
				return acc
			}, {} as { [trackId: string]: { score: number; favorite: number; isHighlighted: boolean } })
		)
	}, [tracksOfAlbum])

	useEffect(() => {
		if (!spotifyAlbumData) {
			return
		}

		setSelectedAlbum(spotifyAlbumData)
	}, [spotifyAlbumData])

	const handleScoreChange = (trackId: string, newScore: number) => {
		setTrackRatings((prev) => ({
			...prev,
			[trackId]: {
				...prev[trackId],
				score: newScore,
			},
		}))
	}

	const handleFavoriteChange = (trackId: string, isFavorite: number) => {
		setTrackRatings((prev) => ({
			...prev,
			[trackId]: {
				...prev[trackId],
				favorite: isFavorite,
			},
		}))
	}

	const handleHighlightChange = (trackId: string, isHighlighted: boolean) => {
		setTrackRatings((prev) => ({
			...prev,
			[trackId]: {
				...prev[trackId],
				isHighlighted,
			},
		}))
	}

	const handleScoreAlbumChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = event.target.value
		if (value === "") {
			setAlbumScore(null)
			return
		}
		// Permite 1-9 con hasta 1 decimal, y solo 10 sin decimales
		if (!/^([1-9](\.\d{1})?|10)$/.test(value)) {
			return
		}
		const numericValue = parseFloat(value)
		setAlbumScore(numericValue)
	}

	const onExportBoleta = useCallback(async () => {
		if (boletaRef.current === null) {
			return
		}

		boletaRef.current.style.opacity = "1"

		await html2canvas(boletaRef.current, {
			scale: 2,
			useCORS: true,
			backgroundColor: null,
		}).then((canvas) => { 
			const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
			download(dataUrl, `boleta-${selectedAlbum?.name}.jpeg`);
			boletaRef.current!.style.opacity = "0"
		});

		ReactGA.event({
			category: 'Boleta',
			action: 'Descarga de boleta',
		})

		if(albumStamp) {
			ReactGA.event({
				category: 'Boleta',
				action: `Sello obtenido: ${albumStamp}`,
			})
		}
		

		// toJpeg(boletaRef.current, {
		// 	cacheBust: true,
		// 	canvasWidth: 800,
    //   canvasHeight: boletaRef.current.clientHeight+0.5,
		// 	width: 800,
    //   height: boletaRef.current.clientHeight+0.5,
    //   pixelRatio: 1,
		// 	fetchRequestInit: {
		// 		mode: "cors",
		// 	}
		// })
		// 	.then((dataUrl) => {
		// 		download(dataUrl, `boleta-${selectedAlbum?.name}.jpeg`)
		// 		boletaRef.current!.style.opacity = "0"
		// 	})
		// 	.catch((err) => {
		// 		console.log(err)
		// 		boletaRef.current!.style.opacity = "0"
		// 	})
	}, [boletaRef, selectedAlbum, albumStamp])

	const disableExport = useMemo(() => {
		return !selectedAlbum || !albumStamp || albumScore === null
	}, [selectedAlbum, albumStamp, albumScore])

	return {
		boletaRef,
		spotifyAlbumId,
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
		setAlbumScore,
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
	}
}

export default useBoleta
