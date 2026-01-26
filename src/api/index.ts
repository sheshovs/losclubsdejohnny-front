import { getAxiosInstance } from "../config/axios"
import { SpotifyTokenResponse } from "../context/AuthContext"
import { BillboardPayload, BillboardResponse } from "../interfaces/billboard"
import { ReviewPayload, ReviewResponse } from "../interfaces/review"
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
    update: (billboardId: string, payload: BillboardPayload): Promise<void> => {
      return backendInstance.put(`/billboard/${billboardId}`, payload)
    },
    delete: (billboardId: string): Promise<void> => {
      return backendInstance.delete(`/billboard/${billboardId}`)
    },
    getActive: (): Promise<BillboardResponse> => {
      return backendInstance.get(`/billboard/active`)
    },
    getAll: (): Promise<BillboardResponse[]> => {
      return backendInstance.get(`/billboard`)
    },
    setActive: (billboardId: string): Promise<BillboardResponse> => {
      return backendInstance.post(`/billboard/activate/${billboardId}`)
    },
    getByUuid: (billboardId: string): Promise<BillboardResponse> => {
      return backendInstance.get(`/billboard/${billboardId}`)
    }
  },

  review: {
    create: (payload: ReviewPayload): Promise<void> => {
      return backendInstance.post(`/review`, payload)
    },
    update: (reviewId: string, payload: ReviewPayload): Promise<void> => {
      return backendInstance.put(`/review/${reviewId}`, payload)
    },
    delete: (reviewId: string): Promise<void> => {
      return backendInstance.delete(`/review/${reviewId}`)
    },
    getAll: (): Promise<ReviewResponse[]> => {
      return backendInstance.get(`/review`)
    },
    getByUuid: (reviewId: string): Promise<ReviewResponse> => {
      return backendInstance.get(`/review/${reviewId}`)
    }
  }
}

export default API
