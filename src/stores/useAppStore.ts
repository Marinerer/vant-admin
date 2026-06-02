import { create } from 'zustand'

interface User {
  id: string
  name: string
  avatar?: string
}

interface AppState {
  isAuthenticated: boolean
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
