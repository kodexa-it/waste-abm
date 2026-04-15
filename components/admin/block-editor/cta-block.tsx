'use client'

import { ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import type { CTABlock } from '@/lib/types'

interface CTABlockEditorProps {
  block: CTABlock
  onUpdate: (updates: Partial<CTABlock>) => void
}

export function CTABlockEditor({ block, onUpdate }: CTABlockEditorProps) {
  const hasContent = block.title || block.text || block.buttonText

  return (
    <div className="space-y-4">
      {/* Live Preview */}
      <div className="rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 via-primary/5 to-primary/10 p-8 text-center transition-all">
        <h3 className="text-xl font-bold mb-2 text-foreground">
          {block.title || (
            <span className="text-muted-foreground italic font-normal">CTA Title</span>
          )}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {block.text || (
            <span className="italic">Add a compelling description...</span>
          )}
        </p>
        <Button
          className={hasContent ? 'cursor-default' : 'opacity-70'}
          tabIndex={-1}
        >
          {block.buttonText || 'Button Text'}
          {block.buttonLink && <ExternalLink className="size-3.5 ml-2" />}
        </Button>
      </div>

      <Separator />

      {/* Edit Fields */}
      <FieldGroup className="pt-2">
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input
            placeholder="Get started today..."
            value={block.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea
            placeholder="Add a compelling call-to-action message..."
            value={block.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={2}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel>Button Text</FieldLabel>
            <Input
              placeholder="Get Started"
              value={block.buttonText}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel>Button Link</FieldLabel>
            <Input
              placeholder="https://..."
              value={block.buttonLink}
              onChange={(e) => onUpdate({ buttonLink: e.target.value })}
            />
          </Field>
        </div>
      </FieldGroup>
    </div>
  )
}
