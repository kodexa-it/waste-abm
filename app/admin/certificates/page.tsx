"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Award,
  FileText,
  Image,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { AdminHeader } from "@/components/admin/admin-header";
import { MediaUploader } from "@/components/admin/media-uploader";
import { Empty } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useCertificateStore } from "@/lib/store/certificate.store";
import type { Certificate } from "@/lib/types";
import { toast } from "sonner";

function detectFileType(url: string): "pdf" | "image" {
  if (!url) return "pdf";

  const clean = url.split("?")[0].toLowerCase();

  if (clean.endsWith(".pdf")) return "pdf";
  if (clean.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return "image";

  return "pdf";
}

export default function CertificatesPage() {
  const {
    certificates,
    fetchCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
  } = useCertificateStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Partial<Certificate>>({
    title: "",
    description: "",
    issueDate: "",
    fileUrl: "",
    fileType: "pdf",
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (formData.fileUrl) {
      const detectedType = detectFileType(formData.fileUrl);
      if (detectedType !== formData.fileType) {
        setFormData((prev) => ({ ...prev, fileType: detectedType }));
      }
    }
  }, [formData.fileUrl]);

  const handleOpenCreate = () => {
    setEditingCert(null);
    setFile(null);

    setFormData({
      title: "",
      description: "",
      issueDate: new Date().toISOString().split("T")[0],
      fileUrl: "",
      fileType: "pdf",
    });

    setIsDialogOpen(true);
  };

  const handleOpenEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setFile(null);

    setFormData({
      title: cert.title,
      description: cert.description,
      issueDate: cert.issueDate ? cert.issueDate.split("T")[0] : "",
      fileUrl: cert.fileUrl,
      fileType: cert.fileType,
    });

    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.issueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      if (!editingCert) {
        if (!file) {
          toast.error("File is required");
          return;
        }

        await createCertificate({
          title: formData.title,
          description: formData.description,
          issueDate: formData.issueDate,
          file,
        });

        toast.success("Certificate created successfully");
      } else {
        const payload: any = {};

        if (formData.title !== editingCert.title)
          payload.title = formData.title;
        if (formData.description !== editingCert.description)
          payload.description = formData.description;
        if (formData.issueDate !== editingCert.issueDate)
          payload.issueDate = formData.issueDate;
        if (file) payload.file = file;

        if (Object.keys(payload).length === 0) {
          toast("No changes to update");
          return;
        }

        await updateCertificate(editingCert.id, payload);

        toast.success("Certificate updated successfully");
      }

      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCertificate(deleteId);
      toast.success("Certificate deleted successfully");
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader
        title="Certificates"
        breadcrumbs={[{ label: "Certificates" }]}
      />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Certificates</h1>
            <p className="text-muted-foreground">
              Manage certifications and documents
            </p>
          </div>

          <Button onClick={handleOpenCreate}>
            <Plus className="size-4 mr-2" />
            Add Certificate
          </Button>
        </div>

        {certificates.length === 0 ? (
          <Empty
            icon={<Award className="size-12" />}
            title="No certificates yet"
            description="Upload your first certificate to get started"
            action={
              <Button onClick={handleOpenCreate}>
                <Plus className="size-4 mr-2" />
                Add Certificate
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <Card key={cert.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                      {cert.fileType === "pdf" ? (
                        <FileText className="size-6" />
                      ) : (
                        <Image className="size-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium truncate">{cert.title}</h3>

                      {cert.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {cert.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        <span>
                          {cert.issueDate
                            ? new Date(cert.issueDate).toLocaleDateString(
                                "es-AR",
                              )
                            : "-"}
                        </span>

                        <Badge
                          variant="outline"
                          className="uppercase text-[10px]"
                        >
                          {cert.fileType}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(cert.fileUrl, "_blank")}
                    >
                      <Download className="size-3.5 mr-1" />
                      Download
                    </Button>

                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenEdit(cert)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteId(cert.id)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCert ? "Edit Certificate" : "Add Certificate"}
            </DialogTitle>
            <DialogDescription>
              {editingCert
                ? "Update certificate details"
                : "Upload a new certificate"}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <FieldLabel>Issue Date</FieldLabel>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    issueDate: e.target.value,
                  }))
                }
              />
            </Field>

            <Field>
              <MediaUploader
                value={formData.fileUrl}
                onChange={(url, selectedFile) => {
                  setFormData((prev) => ({
                    ...prev,
                    fileUrl: url,
                  }));

                  if (selectedFile instanceof File) {
                    setFile(selectedFile);
                  }
                }}
                accept="image/*,.pdf"
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
                  {editingCert ? "Updating..." : "Creating..."}
                </>
              ) : editingCert ? (
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
            <AlertDialogTitle>Delete Certificate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this certificate?
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
