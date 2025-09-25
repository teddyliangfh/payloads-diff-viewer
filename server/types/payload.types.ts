/**
 * TypeScript types for payload data structures
 * Generated from sample data to ensure type safety
 */

export interface ProductImage {
  id: number
  position: number
  url: string
}

export interface ProductVariant {
  id: number
  sku: string
  barcode: string
  image_id: number
  inventory_quantity: number
}

export interface ProductPayload {
  id: number
  title: string
  description: string
  images: ProductImage[]
  variants: ProductVariant[]
}

export interface DiffResult {
  type: 'added' | 'removed' | 'modified' | 'unchanged'
  path: string
  oldValue?: any
  newValue?: any
  details?: string
}

export interface ComparisonResult {
  hasChanges: boolean
  totalChanges: number
  diffs: DiffResult[]
  summary: {
    images: { added: number; removed: number; modified: number }
    variants: { added: number; removed: number; modified: number }
    other: { added: number; removed: number; modified: number }
  }
}

export interface StoredPayload {
  data: ProductPayload
  timestamp: string
  received: boolean
}

export interface StoredComparison {
  result: ComparisonResult
  timestamp: string
  payload1Timestamp: string
  payload2Timestamp: string
}

export interface PayloadApiResponse {
  success: boolean
  message: string
  timestamp: string
  payloadId?: number
  comparison?: ComparisonResult
  summary?: {
    hasChanges: boolean
    totalChanges: number
    changesByCategory: ComparisonResult['summary']
  }
  nextStep?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate payload structure
 */
export function validatePayload(payload: any): ValidationResult {
  const errors: string[] = []
  
  if (!payload || typeof payload !== 'object') {
    errors.push('Payload must be an object')
    return { isValid: false, errors }
  }
  
  // Check required fields
  const requiredFields = ['id', 'title', 'description', 'images', 'variants']
  for (const field of requiredFields) {
    if (!(field in payload)) {
      errors.push(`Missing required field: ${field}`)
    }
  }
  
  // Validate images array
  if (Array.isArray(payload.images)) {
    payload.images.forEach((img: any, index: number) => {
      if (!img.id || !img.position || !img.url) {
        errors.push(`Image at index ${index} is missing required fields (id, position, url)`)
      }
    })
  } else if (payload.images !== undefined) {
    errors.push('Images must be an array')
  }
  
  // Validate variants array
  if (Array.isArray(payload.variants)) {
    payload.variants.forEach((variant: any, index: number) => {
      const requiredVariantFields = ['id', 'sku', 'barcode', 'image_id', 'inventory_quantity']
      for (const field of requiredVariantFields) {
        if (!(field in variant)) {
          errors.push(`Variant at index ${index} is missing required field: ${field}`)
        }
      }
    })
  } else if (payload.variants !== undefined) {
    errors.push('Variants must be an array')
  }
  
  return { isValid: errors.length === 0, errors }
}
