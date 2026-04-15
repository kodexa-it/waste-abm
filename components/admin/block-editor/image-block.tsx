'use client'

import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { MediaUploader } from '@/components/admin/media-uploader'
import type { ImageBlock } from '@/lib/types'

interface ImageBlockEditorProps {
  block: ImageBlock
  onUpdate: (updates: Partial<ImageBlock>) => void
}

export function ImageBlockEditor({ block, onUpdate }: ImageBlockEditorProps) {
  return (
    <div className="space-y-4">
      <MediaUploader
        value={block.url}
        onChange={(url, file) =>
          onUpdate({
            url,
            file, // 🔥 ESTE ES EL FIX CLAVE
          })
        }
        accept="image/*"
      />

      <Field>
        <FieldLabel>Caption (optional)</FieldLabel>
        <Input
          placeholder="Image caption..."
          value={block.caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
        />
      </Field>
    </div>
  )
}