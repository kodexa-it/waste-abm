"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Image, Video, Check } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { AdminHeader } from "@/components/admin/admin-header";
import { MediaUploader } from "@/components/admin/media-uploader";
import { Empty } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useBannerStore } from "@/lib/store/banner.store";
import type { Banner } from "@/lib/types";
import { toast } from "sonner";
import { getMediaUrl } from "@/lib/utils/getMediaUrl";

export default function BannersPage() {
  const {
    banners,
    fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    setActiveBanner,
  } = useBannerStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeView, setActiveView] = useState<"desktop" | "mobile">("desktop");
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<Partial<Banner>>({
    type: "image",
    desktopUrl: "",
    mobileUrl: "",
    active: false,
  });

  // ✅ fetch real data
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setFormData({
      type: "image",
      desktopUrl: "",
      mobileUrl: "",
      active: false,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner);

    // 🔥 importante
    setDesktopFile(null);
    setMobileFile(null);

    setFormData({
      type: banner.type,
      desktopUrl: banner.desktopUrl,
      mobileUrl: banner.mobileUrl,
      active: banner.active,
    });

    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // ======================
      // CREATE
      // ======================
      if (!editingBanner) {
        if (!desktopFile || !mobileFile) {
          toast.error("Please upload both desktop and mobile media");
          return;
        }

        await createBanner({
          type: formData.type as "image" | "video",
          isActive: formData.active || false,
          desktop: desktopFile,
          mobile: mobileFile,
        });

        toast.success("Banner created successfully");
      }

      // ======================
      // UPDATE (🔥 SMART DIFF)
      // ======================
      else {
        const payload: any = {};

        // TYPE
        if (formData.type !== editingBanner.type) {
          payload.type = formData.type;
        }

        // ACTIVE
        if (formData.active !== editingBanner.active) {
          payload.isActive = formData.active;
        }

        // DESKTOP FILE
        if (desktopFile) {
          payload.desktop = desktopFile;
        }

        // MOBILE FILE
        if (mobileFile) {
          payload.mobile = mobileFile;
        }

        // 🔥 si no hay cambios
        if (Object.keys(payload).length === 0) {
          toast("No changes to update");
          return;
        }

        await updateBanner(editingBanner.id, payload);

        toast.success("Banner updated successfully");
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteBanner(deleteId);
      toast.success("Banner deleted successfully");
    } catch {
      toast.error("Error deleting banner");
    } finally {
      setDeleteId(null);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      await setActiveBanner(id);
      toast.success("Active banner updated");
    } catch {
      toast.error("Error updating banner");
    }
  };

  const currentUrl =
    activeView === "desktop" ? formData.desktopUrl : formData.mobileUrl;

  const handleMediaChange = (url: string) => {
    if (activeView === "desktop") {
      setFormData({ ...formData, desktopUrl: url });
    } else {
      setFormData({ ...formData, mobileUrl: url });
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader title="Banners" breadcrumbs={[{ label: "Banners" }]} />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
            <p className="text-muted-foreground">Manage hero section banners</p>
          </div>

          <Button onClick={handleOpenCreate}>
            <Plus className="size-4 mr-2" />
            Add Banner
          </Button>
        </div>

        {banners.length === 0 ? (
          <Empty>
            <Image className="size-12 mb-2 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No banners yet</h3>
            <p className="text-muted-foreground text-sm">
              Create your first banner to get started
            </p>

            <Button onClick={handleOpenCreate} className="mt-4">
              <Plus className="size-4 mr-2" />
              Add Banner
            </Button>
          </Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner) => (
              <Card key={banner.id} className="overflow-hidden group">
                <div className="relative aspect-video bg-muted">
                  {banner.desktopUrl ? (
                    banner.type === "image" ? (
                      <img
                        src={getMediaUrl(banner.desktopUrl)}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={getMediaUrl(banner.desktopUrl)}
                        className="w-full h-full object-cover"
                        muted
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {banner.type === "image" ? (
                        <Image className="size-12 text-muted-foreground/50" />
                      ) : (
                        <Video className="size-12 text-muted-foreground/50" />
                      )}
                    </div>
                  )}

                  {banner.active && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                      Active
                    </Badge>
                  )}

                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="size-8"
                      onClick={() => handleOpenEdit(banner)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>

                    <Button
                      size="icon"
                      variant="secondary"
                      className="size-8 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => setDeleteId(banner.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {banner.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {banner.createdAt}
                        </span>
                      </div>
                    </div>

                    {!banner.active && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSetActive(banner.id)}
                      >
                        <Check className="size-3.5 mr-1" />
                        Set Active
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit banner" : "Create banner"}
            </DialogTitle>
            <DialogDescription>Manage your hero banner media</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* TYPE */}
              <div className="flex gap-2">
                <Button
                  variant={formData.type === "image" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, type: "image" })}
                >
                  <Image className="size-4 mr-2" />
                  Image
                </Button>

                <Button
                  variant={formData.type === "video" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, type: "video" })}
                >
                  <Video className="size-4 mr-2" />
                  Video
                </Button>
              </div>

              {/* ACTIVE */}
              <div className="flex items-center gap-3 border rounded-lg px-3 py-2">
                <span className="text-sm text-muted-foreground">Active</span>
                <Switch
                  checked={!!formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked })
                  }
                />
              </div>
            </div>

            {/* DEVICE SWITCH */}
            <div className="flex gap-2">
              <Button
                variant={activeView === "desktop" ? "default" : "outline"}
                onClick={() => setActiveView("desktop")}
              >
                Desktop
              </Button>

              <Button
                variant={activeView === "mobile" ? "default" : "outline"}
                onClick={() => setActiveView("mobile")}
              >
                Mobile
              </Button>
            </div>

            {/* UPLOADER = PREVIEW */}
            <MediaUploader
              value={currentUrl}
              onChange={(url, file) => {
                handleMediaChange(url);

                if (!file) return; // 🔥 clave

                if (activeView === "desktop") {
                  setDesktopFile(file);
                } else {
                  setMobileFile(file);
                }
              }}
              accept={formData.type === "video" ? "video/*" : "image/*"}
              fileType={formData.type === "video" ? "video" : "image"}
            />
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  {editingBanner ? "Updating..." : "Creating..."}
                </>
              ) : editingBanner ? (
                "Save changes"
              ) : (
                "Create banner"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this banner? This action cannot be
              undone.
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
