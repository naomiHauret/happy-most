import { createApiConnector } from '@happy/connector'

const apiClient = createApiConnector(import.meta.env.VITE_ENDPOINT_API)

export { apiClient }
