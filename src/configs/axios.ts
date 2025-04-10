import axios from "axios"

const NEXT_PUBLIC_SERVER_ENDPOINT = process.env.NEXT_PUBLIC_SERVER_ENDPOINT

export const client_axios = axios.create({ baseURL: NEXT_PUBLIC_SERVER_ENDPOINT })
