import { Dayjs } from "dayjs"
import { SpotifyAlbumDetailResponse } from "./spotify"

export interface ReviewPayload {
  startDate: Dayjs | null
  endDate: Dayjs | null
  albums: {
    albumId: string
  }[]
}

export interface ReviewResponse {
  albums: {
    uuid: string
    albumId: string
    albumData: SpotifyAlbumDetailResponse
  }[]
  uuid: string
  startDate: string
  endDate: string
  isActive: boolean
}