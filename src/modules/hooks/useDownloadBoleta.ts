

import { useCallback, useMemo, useRef } from "react"
import { SpotifyAlbumDetailResponse } from "../../interfaces/spotify"
import download from "downloadjs"
import html2canvas from "html2canvas"



interface UseDownloadBoletaProps {
	selectedAlbums: SpotifyAlbumDetailResponse[]
}

const useDownloadBoleta = ({ selectedAlbums }: UseDownloadBoletaProps) => {
	const boletaRef = useRef<HTMLDivElement>(null)

	// Generar datos para todos los álbumes
	const albumsData = useMemo(() => {
		return selectedAlbums.map((album) => {
			const tracksOfAlbum = album.tracks.items.map((track) => ({
				id: track.id,
				trackNumber: track.track_number,
				name: track.name,
				explicit: track.explicit,
				duration: track.duration_ms,
			}))

			const trackRatings = tracksOfAlbum.reduce((acc, track) => {
				acc[track.id] = { score: 0, favorite: 0, isHighlighted: false }
				return acc
			}, {} as { [trackId: string]: { score: number; favorite: number; isHighlighted: boolean } })

			const { heartsAverage, starsAverage, totalAverage } = (() => {
				if (tracksOfAlbum.length === 0) {
					return {
						heartsAverage: 0,
						starsAverage: 0,
						totalAverage: 0,
					}
				}

				const heartsAvg =
					Object.values(trackRatings).reduce(
						(acc, rating) => acc + rating.favorite * 10,
						0
					) / tracksOfAlbum.length
				const starsAvg =
					(Object.values(trackRatings).reduce(
						(acc, rating) => acc + rating.score,
						0
					) *
						2) /
					tracksOfAlbum.length
				const totalAvg = (heartsAvg + starsAvg) / 2

				return {
					heartsAverage: Math.round(heartsAvg * 10) / 10,
					starsAverage: Math.round(starsAvg * 10) / 10,
					totalAverage: Math.round(totalAvg * 10) / 10,
				}
			})()

			return {
				album,
				tracksOfAlbum,
				trackRatings,
				heartsAverage,
				starsAverage,
				totalAverage,
				albumScore: null,
				albumStamp: null,
				braveStamp: false,
				albumStampImage: null,
			}
		})
	}, [selectedAlbums])

	// Función para exportar una boleta específica por índice
	const onExportBoletaByIndex = useCallback(async (albumIndex: number) => {
		if (boletaRef.current === null || !albumsData[albumIndex]) {
			return
		}

		const albumData = albumsData[albumIndex]
		boletaRef.current.style.opacity = "1"

		await html2canvas(boletaRef.current, {
			scale: 2,
			useCORS: true,
			backgroundColor: null,
		}).then((canvas) => { 
			const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
			download(dataUrl, `boleta-empty-${albumData.album.name}.jpeg`);
			boletaRef.current!.style.opacity = "0"
		}).catch((err) => {
			console.error("Error generating boleta:", err)
			boletaRef.current!.style.opacity = "0"
		});
	}, [boletaRef, albumsData])

	// Función para exportar todas las boletas
	const onExportAllBoletas = useCallback(async () => {
		if (boletaRef.current === null || albumsData.length === 0) {
			return
		}

		for (let i = 0; i < albumsData.length; i++) {
			const albumData = albumsData[i]
			
			boletaRef.current.style.opacity = "1"

			await html2canvas(boletaRef.current, {
				scale: 2,
				useCORS: true,
				backgroundColor: null,
			}).then((canvas) => { 
				const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
				download(dataUrl, `boleta-empty-${albumData.album.name}.jpeg`);
			}).catch((err) => {
				console.error(`Error generating boleta for ${albumData.album.name}:`, err)
			});

			// Pequeña pausa entre descargas para evitar problemas
			await new Promise(resolve => setTimeout(resolve, 500))
		}

		boletaRef.current.style.opacity = "0"
	}, [boletaRef, albumsData])

	// Deshabilitar exportación si no hay álbumes seleccionados
	const disableExport = useMemo(() => {
		return albumsData.length === 0
	}, [albumsData])

	return {
		boletaRef,
		disableExport,
		albumsData,
		totalAlbums: albumsData.length,
		onExportBoletaByIndex,
		onExportAllBoletas,
	}
}

export default useDownloadBoleta