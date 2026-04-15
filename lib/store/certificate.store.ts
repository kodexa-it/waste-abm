import { create } from 'zustand'
import { Certificate } from '@/lib/types'
import { certificateService } from '@/lib/services/certificate.service'

interface CertificateState {
  certificates: Certificate[]
  loading: boolean

  fetchCertificates: () => Promise<void>
  createCertificate: (data: any) => Promise<void>
  updateCertificate: (id: string, data: any) => Promise<void>
  deleteCertificate: (id: string) => Promise<void>
}

export const useCertificateStore = create<CertificateState>((set, get) => ({
  certificates: [],
  loading: false,

  fetchCertificates: async () => {
    set({ loading: true })
    const data = await certificateService.getAll()
    set({ certificates: data, loading: false })
  },

  createCertificate: async (data) => {
    const newCert = await certificateService.create(data)
    set({ certificates: [...get().certificates, newCert] })
  },

  updateCertificate: async (id, data) => {
    const updated = await certificateService.update(id, data)

    set({
      certificates: get().certificates.map((c) =>
        c.id === id ? updated : c
      ),
    })
  },

  deleteCertificate: async (id) => {
    await certificateService.delete(id)

    set({
      certificates: get().certificates.filter((c) => c.id !== id),
    })
  },
}))