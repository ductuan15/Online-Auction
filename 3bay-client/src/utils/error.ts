import axios, {AxiosError} from 'axios'

export function setErrorTextMsg(error: unknown, setErrorMsg: (errorText: string | null) => void): void {
  let msg = null
  if (axios.isAxiosError(error) && (error as AxiosError)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      msg = error.response.data?.message || null
      if (!msg && (error.response.status === 401 || error.response.status === 403)) {
        msg = 'Error occurred: Unauthorized'
      }
      else if (!msg) {
        msg = 'Unknown response error occurred'
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      msg = error.request.data?.message || 'Unknown request error occurred'
    }
  } else if (error instanceof Error) {
    msg = error.message || 'Error occurred'
  } else if (typeof error === 'string') {
    msg = error
  } else {
    msg = 'Error occurred'
  }

  setErrorMsg(msg)

}