import { apiFetch } from '../api/client'
import { Certificate } from '@/lib/types'

export const certificateService = {
  getAll: () => apiFetch<Certificate[]>('/certificates'),

  create: (data: {
    title: string
    description?: string
    issueDate: string
    file: File
  }) => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('issueDate', data.issueDate)

    if (data.description) {
      formData.append('description', data.description)
    }

    formData.append('file', data.file)

    return apiFetch<Certificate>('/certificates', {
      method: 'POST',
      body: formData,
    })
  },

  update: (
    id: string,
    data: {
      title?: string
      description?: string
      issueDate?: string
      file?: File
    }
  ) => {
    const formData = new FormData()

    if (data.title) formData.append('title', data.title)
    if (data.description) formData.append('description', data.description)
    if (data.issueDate) formData.append('issueDate', data.issueDate)

    if (data.file instanceof File) {
      formData.append('file', data.file)
    }

    return apiFetch<Certificate>(`/certificates/${id}`, {
      method: 'PUT',
      body: formData,
    })
  },

  delete: (id: string) =>
    apiFetch<void>(`/certificates/${id}`, {
      method: 'DELETE',
    }),
}