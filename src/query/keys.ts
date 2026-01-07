import { QueryKey, UseQueryOptions } from '@tanstack/react-query'

export const API_QUERY_KEYS = {
  login: () => [`auth`, `login`],
  spotifyAlbumsByArtist: (artist: string) => [`spotify`, `albumsByArtist`, artist],
  spotifyAlbumById: (albumId: string) => [`spotify`, `albumById`, albumId],

  billboard: {
    active: () => [`billboard`, `active`],
    all: () => [`billboard`, `all`],
  }
}

export type QueryOptions<T, V extends QueryKey = string[], K = T> = Omit<
  UseQueryOptions<T, unknown, K, V>,
  `initialData` | `queryFn` | `queryKey`
>
