'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Users, GripVertical, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { AdminHeader } from '@/components/admin/admin-header'
import { MediaUploader } from '@/components/admin/media-uploader'
import { Empty } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { usePartnerStore } from '@/lib/store/partner.store'
import type { Partner } from '@/lib/types'
import { toast } from 'sonner'
import { getMediaUrl } from '@/lib/utils/getMediaUrl'

export default function PartnersPage() {
  const {
    partners,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
  } = usePartnerStore()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const [formData, setFormData] = useState<Partial<Partner>>({
    name: '',
    website: '',
    logoUrl: '',
    order: 1,
  })

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [localPartners, setLocalPartners] = useState<Partner[]>([])

  useEffect(() => {
    fetchPartners()
  }, [])

  // sync con backend
  useEffect(() => {
    setLocalPartners([...partners].sort((a, b) => a.order - b.order))
  }, [partners])

  const sortedPartners = localPartners

  const handleOpenCreate = () => {
    setEditingPartner(null)
    setLogoFile(null)

    setFormData({
      name: '',
      website: '',
      logoUrl: '',
      order: partners.length + 1,
    })

    setIsDialogOpen(true)
  }

  const handleOpenEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setLogoFile(null)

    setFormData({
      name: partner.name,
      website: partner.website,
      logoUrl: partner.logoUrl,
      order: partner.order,
    })

    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.website) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)

      if (!editingPartner) {
        if (!logoFile) {
          toast.error('Logo is required')
          return
        }

        await createPartner({
          name: formData.name,
          website: formData.website,
          logo: logoFile,
          order: formData.order,
        })

        toast.success('Partner created successfully')
      } else {
        const payload: any = {}

        if (formData.name !== editingPartner.name) payload.name = formData.name
        if (formData.website !== editingPartner.website) payload.website = formData.website
        if (logoFile) payload.logo = logoFile
        if (formData.order !== editingPartner.order) payload.order = formData.order

        if (Object.keys(payload).length === 0) {
          toast('No changes to update')
          return
        }

        await updatePartner(editingPartner.id, payload)

        toast.success('Partner updated successfully')
      }

      setIsDialogOpen(false)
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deletePartner(deleteId)
      toast.success('Partner deleted successfully')
      setDeleteId(null)
    }
  }

  // =========================
  // DRAG & DROP
  // =========================

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const updated = [...localPartners]
    const dragged = updated[draggedIndex]

    updated.splice(draggedIndex, 1)
    updated.splice(index, 0, dragged)

    setLocalPartners(updated)
    setDraggedIndex(index)
  }

  const handleDragEnd = async () => {
    if (!localPartners.length) return

    try {
      const updates = localPartners.map((p, index) => ({
        id: p.id,
        order: index + 1,
        prevOrder: p.order,
      }))

      const changed = updates.filter((u) => u.order !== u.prevOrder)

      for (const item of changed) {
        await updatePartner(item.id, { order: item.order })
      }

      toast.success('Order updated')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update order')
    } finally {
      setDraggedIndex(null)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader title="Partners" breadcrumbs={[{ label: "Partners" }]} />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Partners</h1>
            <p className="text-muted-foreground">
              Manage partner logos and information
            </p>
          </div>

          <Button onClick={handleOpenCreate}>
            <Plus className="size-4 mr-2" />
            Add Partner
          </Button>
        </div>

        {partners.length === 0 ? (
          <Empty
            icon={<Users className="size-12" />}
            title="No partners yet"
            description="Add your first partner to get started"
            action={
              <Button onClick={handleOpenCreate}>
                <Plus className="size-4 mr-2" />
                Add Partner
              </Button>
            }
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-20">Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="w-20 text-center">Order</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedPartners.map((partner, index) => (
                  <TableRow
                    key={partner.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={draggedIndex === index ? "opacity-50" : ""}
                  >
                    <TableCell>
                      <GripVertical className="size-4 text-muted-foreground cursor-grab" />
                    </TableCell>

                    <TableCell>
                      <div className="size-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                        {partner.logoUrl ? (
                          <img
                            src={getMediaUrl(partner.logoUrl)}
                            alt={partner.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Users className="size-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">
                      {partner.name}
                    </TableCell>

                    <TableCell>
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {partner.website.replace(/^https?:\/\//, "")}
                        <ExternalLink className="size-3" />
                      </a>
                    </TableCell>

                    <TableCell className="text-center">
                      {partner.order}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenEdit(partner)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteId(partner.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? "Edit Partner" : "Add Partner"}
            </DialogTitle>
            <DialogDescription>
              {editingPartner ? "Update partner details" : "Add a new partner"}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <MediaUploader
                value={formData.logoUrl}
                onChange={(url, file) => {
                  setFormData({ ...formData, logoUrl: url });
                  if (file) setLogoFile(file);
                }}
                accept="image/*"
              />
            </Field>

            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Website</FieldLabel>
              <Input
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  {editingPartner ? "Updating..." : "Creating..."}
                </>
              ) : editingPartner ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Partner</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
