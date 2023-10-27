import axios from 'axios'

export class AxiosAdapter {
  public URL: string

  constructor(url: string) {
    this.URL = url
  }

  public post = async (postData: any) => {
    const response = await axios.post(this.URL, postData, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
    return response
  }

  public get = async (headers = {}) => {
    const response = await axios.get(this.URL, {
      headers: { ...headers, 'Accept': 'application/json', 'Content-Type': 'application/json' },
    })
    return response
  }
}
