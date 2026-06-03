import { authHandlers } from './auth'
import { userHandlers } from './users'
import { dashboardHandlers } from './dashboard'

export const handlers = [...authHandlers, ...userHandlers, ...dashboardHandlers]
