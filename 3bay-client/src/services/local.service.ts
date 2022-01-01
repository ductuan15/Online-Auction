import axios, {AxiosResponse} from 'axios'

async function getImage(imageUrl: string): Promise<AxiosResponse<Blob>> {
  return await axios.create().get<Blob>(imageUrl, { baseURL: '', responseType: 'blob' })
}
const LocalService = {
  getImage
}

export default LocalService