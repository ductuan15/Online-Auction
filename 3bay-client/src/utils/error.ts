import axios, {AxiosError} from 'axios'

export function setErrorTextMsg(error: unknown, setErrorMsg: (errorText: string) => void): void {
  let msg = ''
  if (axios.isAxiosError(error) && (error as AxiosError)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      //console.log(error.response.data)
      //console.log(error.response.status)
      //console.log(error.response.headers)
      msg = error.response.data.message
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      //console.log(error.request)
      msg = error.request.data.message
    }
  } else if (error instanceof Error) {
    msg = error.message
  } else if (typeof error === 'string') {
    msg = error
  } else {
    msg = 'Error occurred'
  }

  setErrorMsg(msg)

}