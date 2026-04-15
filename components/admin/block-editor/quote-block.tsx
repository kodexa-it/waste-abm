'use client'

import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import type { QuoteBlock } from '@/lib/types'

interface QuoteBlockEditorProps {
  block: QuoteBlock
  onUpdate: (updates: Partial<QuoteBlock>) => void
}

export function QuoteBlockEditor({ block, onUpdate }: QuoteBlockEditorProps) {
  return (
    <div className="border-l-4 border-primary pl-4">
      <FieldGroup>
        <Field>
          <Textarea
            placeholder="Enter quote text..."
            value={block.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="resize-none italic text-lg"
            rows={3}
          />
        </Field>
        <Field>
          <FieldLabel>Author</FieldLabel>
          <Input
            placeholder="Quote author..."
            value={block.author}
            onChange={(e) => onUpdate({ author: e.target.value })}
          />
        </Field>
      </FieldGroup>
    </div>
  )
}
