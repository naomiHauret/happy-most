import { edenTreaty } from '@elysiajs/eden'
import type { App } from '@happy/backend'

function createApiConnector(endpoint: string) {
  return edenTreaty<App>(endpoint)
}
export { createApiConnector }
