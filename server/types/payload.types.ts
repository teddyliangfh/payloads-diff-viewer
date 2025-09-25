/**
 * TypeScript types for generic payload comparison system
 * Supports any data structure with configurable comparison options
 */

// Legacy types for backward compatibility
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

// Simplified comparison types
export interface DiffResult {
  path: string
  type: 'added' | 'removed' | 'modified'
  oldValue?: any
  newValue?: any
}

export interface ComparisonResult {
  hasChanges: boolean
  totalChanges: number
  diffs: DiffResult[]
}

export interface StoredPayload {
  data: any // Changed to any to support any payload structure
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
  }
  nextStep?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Generic payload validation - accepts any valid JSON structure
 */
export function validatePayload(payload: any): ValidationResult {
  const errors: string[] = []
  
  if (payload === null || payload === undefined) {
    errors.push('Payload cannot be null or undefined')
    return { isValid: false, errors }
  }
  
  // Check if it's a valid JSON-serializable structure
  try {
    JSON.stringify(payload)
  } catch (error) {
    errors.push('Payload must be JSON-serializable')
    return { isValid: false, errors }
  }
  
  return { isValid: true, errors }
}

/**
 * Legacy validation for product payloads (for backward compatibility)
 */
export function validateProductPayload(payload: any): ValidationResult {
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
