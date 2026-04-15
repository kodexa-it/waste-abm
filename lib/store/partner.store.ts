import { create } from "zustand"
import { Partner } from "@/lib/types"
import { partnerService } from "@/lib/services/partner.service"

type CreatePartnerPayload = {
  name: string
  website: string
  logo: File
  order?: number
}

type UpdatePartnerPayload = {
  name?: string
  website?: string
  logo?: File
  order?: number
}

interface PartnerState {
  partners: Partner[]
  loading: boolean

  fetchPartners: () => Promise<void>
  createPartner: (data: CreatePartnerPayload) => Promise<void>
  updatePartner: (id: string, data: UpdatePartnerPayload) => Promise<void>
  deletePartner: (id: string) => Promise<void>
}

export const usePartnerStore = create<PartnerState>((set, get) => ({
  partners: [],
  loading: false,

  fetchPartners: async () => {
    const data = await partnerService.getAll()
    set({ partners: data })
  },

  createPartner: async (data) => {
    const newPartner = await partnerService.create(data)
    set({ partners: [...get().partners, newPartner] })
  },

  updatePartner: async (id, data) => {
    const updated = await partnerService.update(id, data)
    set({
      partners: get().partners.map((p) =>
        p.id === id ? updated : p
      ),
    })
  },

  deletePartner: async (id) => {
    await partnerService.delete(id)
    set({
      partners: get().partners.filter((p) => p.id !== id),
    })
  },
}))