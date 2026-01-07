import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

interface IErrorResponse {
  message: string | string[]
  statusCode: number
  error: string
}
export interface ErrorResponse extends Omit<IErrorResponse, `message`> {
  message: string
}

const requestHandler = (config: InternalAxiosRequestConfig, local_key: string): InternalAxiosRequestConfig => {
  if (config.headers) {
    if (typeof window !== `undefined`) {
      const token: string = window.localStorage.getItem(local_key) ?? ``
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  }
  return config
}

function responseHandler<T>(response: AxiosResponse): T {
  const {
    data: { data, success },
  } = response

  if (success) {
    return data
  } else {
    if (response.status === 200 || response.status === 201) {
      return response.data
    }

    const error = response.data as ErrorResponse
    const nextError = {
      ...error,
      message: Array.isArray(error.message) ? error.message.join(`,`) : error.message,
    }
    throw nextError
  }
}

export function getAxiosInstance(local_key: string, baseURL?: string): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL,
  })
  axiosInstance.interceptors.request.use((config) => requestHandler(config, local_key), (error) => Promise.reject(error))
  axiosInstance.interceptors.response.use(responseHandler, (error) => Promise.reject(error))
  return axiosInstance
}
