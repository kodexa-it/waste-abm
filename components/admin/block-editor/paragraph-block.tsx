'use client'

import { Textarea } from '@/components/ui/textarea'
import type { ParagraphBlock } from '@/lib/types'

interface ParagraphBlockEditorProps {
  block: ParagraphBlock
  onUpdate: (updates: Partial<ParagraphBlock>) => void
}

export function ParagraphBlockEditor({ block, onUpdate }: ParagraphBlockEditorProps) {
  return (
    <div>
      <Textarea
        placeholder="Start writing..."
        value={block.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        rows={3}
      />
    </div>
  )
}
