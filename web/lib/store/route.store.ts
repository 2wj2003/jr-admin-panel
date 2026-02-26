import { create } from 'zustand'



interface RouteState {
  isChanging: boolean
  setIsChanging: (v: boolean) => void
}

export const useRouteStore = create<RouteState>((set) => ({
  isChanging: false,
  setIsChanging: (v) => set(() => ({ isChanging: v })),
}))