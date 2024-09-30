import { createApiConnector } from '@happy/connector'

//@ts-ignore
const apiClient = createApiConnector(import.meta.env.VITE_ENDPOINT_API)

export { apiClient }
