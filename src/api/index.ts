import { getAxiosInstance } from "../config/axios"
import { SpotifyTokenResponse } from "../context/AuthContext"
import { BillboardPayload, BillboardResponse } from "../interfaces/billboard"
import { SpotifyAlbumDetailResponse, SpotifyAlbumResponse } from "../interfaces/spotify"

const backendInstance = getAxiosInstance( "user_token", import.meta.env.VITE_BACKEND_URL)
const spotifyInstance = getAxiosInstance("spotify_access_token", import.meta.env.VITE_SPOTIFY_URL)

const API = {
  login: (username: string, password: string): Promise<{ token: string }> => {
    return backendInstance.post(`/auth/login`, {
      username,
      password,
    })
  },

  getSpotifyToken: (): Promise<SpotifyTokenResponse> => {
    return backendInstance.get(`/auth/spotify/token`)
  },
  // get spotify albums by artist name
  getSpotifyAlbumsByArtist: (search: string): Promise<SpotifyAlbumResponse> => {
    return spotifyInstance.get(`/search`, {
      params: {
        q: search,
        type: `album`,
        limit: 20,
      },
    })
  },

  getSpotifyAlbumById: (albumId: string): Promise<SpotifyAlbumDetailResponse> => {
    return spotifyInstance.get(`/albums/${albumId}`)
  },

  billboard: {
    create: (payload: BillboardPayload): Promise<void> => {
      return backendInstance.post(`/billboard`, payload)
    },
    getActive: (): Promise<BillboardResponse> => {
      return backendInstance.get(`/billboard/active`)
    },
    getAll: (): Promise<BillboardResponse[]> => {
      return backendInstance.get(`/billboard`)
    },
    setActive: (billboardId: string): Promise<BillboardResponse> => {
      return backendInstance.post(`/billboard/activate/${billboardId}`)
    }
  }
}

export default API
