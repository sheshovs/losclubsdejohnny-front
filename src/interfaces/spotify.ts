export interface SpotifyAlbumResponse {
	albums: {
		href: string
		limit: number
		next: string | null
		offset: number
		previous: string | null
		total: number
		items: SpotifyAlbumItem[]
	}
}

export interface SpotifyAlbumItem {
	album_type: string
	total_tracks: number
	available_markets: string[]
	external_urls: {
		spotify: string
	}
	href: string
	id: string
	images: {
		height: number | null
		url: string
		width: number | null
	}[]
	name: string
	release_date: string
	release_date_precision: string
	restrictions?: {
		reason: string
	}
	type: string
	uri: string
	artists: SpotifyArtists[]
}

export interface SpotifyAlbumDetailResponse extends SpotifyAlbumItem {
	tracks: {
		href: string
		limit: number
		next: string | null
		offset: number
		previous: string | null
		total: number
		items: {
			artists: SpotifyArtists[]
			available_markets: string[]
			disc_number: number
			duration_ms: number
			explicit: boolean
			external_urls: {
				spotify: string
			}
			href: string
			id: string
			is_playable?: boolean
			linked_from?: {
				external_urls: {
					spotify: string
				}
				href: string
				id: string
				type: string
				uri: string
			}
			restrictions?: {
				reason: string
			}
			name: string
			preview_url: string | null
			track_number: number
			type: string
			uri: string
			is_local: boolean
		}[]
	}
	copyrights: {
		text: string
		type: string
	}[]
	external_ids: {
		upc: string
		ean?: string
		isrc?: string
	}
	genres: string[]
	label: string
	popularity: number
}

export interface SpotifyArtists {
	external_urls: {
		spotify: string
	}
	href: string
	id: string
	name: string
	type: string
	uri: string
}
