// User types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

// Banner types
export interface Banner {
  id: string
  type: 'image' | 'video'
  desktopUrl: string
  mobileUrl: string
  active: boolean
  createdAt: string
}

// Partner types
export interface Partner {
  id: string
  name: string
  website: string
  logoUrl: string
  order: number
}

// Certificate types
export interface Certificate {
  id: string
  title: string
  description: string
  issueDate: string
  fileUrl: string
  fileType: 'pdf' | 'image'
}

// Category types
export interface Category {
  id: string
  name: string
  slug: string
}

// Block types for the editor
export type BlockType = 'paragraph' | 'heading' | 'image' | 'list' | 'quote' | 'infobox' | 'cta'

export interface ParagraphBlock {
  id: string
  type: 'paragraph'
  text: string
}

export interface HeadingBlock {
  id: string
  type: 'heading'
  level: 1 | 2 | 3 | 4
  text: string
}

export interface ImageBlock {
  id: string
  type: "image"
  url: string
  caption?: string
  file?: File
}

export interface ListBlock {
  id: string
  type: 'list'
  ordered: boolean
  items: string[]
}

export interface QuoteBlock {
  id: string
  type: 'quote'
  text: string
  author: string
}

export interface InfoBoxBlock {
  id: string
  type: 'infobox'
  variant: 'info' | 'warning' | 'success'
  text: string
}

export interface CTABlock {
  id: string
  type: 'cta'
  title: string
  text: string
  buttonText: string
  buttonLink: string
}

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | ListBlock
  | QuoteBlock
  | InfoBoxBlock
  | CTABlock

// Post types
export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: Block[]
  categoryId: string
  status: 'draft' | 'published'
  featuredImage: string
  metaTitle: string
  metaDescription: string
  createdAt: string
  updatedAt: string
}
