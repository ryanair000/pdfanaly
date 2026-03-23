import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      username: '',
      formData: null,
      mvpPlan: null,

      setUsername: (name) => set({ username: name }),
      setFormData: (data) => set({ formData: data }),
      setMvpPlan: (plan) => set({ mvpPlan: plan }),
      clearPlan: () => set({ mvpPlan: null }),
      logout: () => set({ username: '', formData: null, mvpPlan: null }),
    }),
    {
      name: 'mvpgen-kenya',
      partialize: (s) => ({ username: s.username }),
    }
  )
)
