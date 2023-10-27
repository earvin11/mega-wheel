import { AxiosResponse } from 'axios'
import { AxiosAdapter } from '../Adapters/axios.adapter'

export const getPlayerAuth = async (tokenAuth: {
  token: string
}): Promise<AxiosResponse | null> => {
  const url =
    'https://api-dev-v2.whatsbet.net/i/product/c/bcsuite/f61e98a2-73ec-4daf-bfe0-aa9e7ae91940/profile'
  const request = new AxiosAdapter(url)

  try {
    const response = await request.post(tokenAuth)

    return response
  } catch (error) {
    return null
  }
}
