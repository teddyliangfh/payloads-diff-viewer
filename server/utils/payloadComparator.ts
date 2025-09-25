/**
 * Payload comparison utility for detecting differences between product data
 * Handles nested objects, arrays, and various data types
 */

import type {
  ProductImage,
  ProductVariant,
  ProductPayload,
  DiffResult,
  ComparisonResult,
  ValidationResult
} from '../types/payload.types'

/**
 * Deep comparison function to detect differences between two objects
 */
export function comparePayloads(payload1: ProductPayload, payload2: ProductPayload): ComparisonResult {
  const diffs: DiffResult[] = []
  
  // Compare basic fields
  compareBasicFields(payload1, payload2, diffs)
  
  // Compare images array
  compareImages(payload1.images, payload2.images, diffs)
  
  // Compare variants array
  compareVariants(payload1.variants, payload2.variants, diffs)
  
  // Calculate summary
  const summary = calculateSummary(diffs)
  
  return {
    hasChanges: diffs.length > 0,
    totalChanges: diffs.length,
    diffs,
    summary
  }
}

/**
 * Compare basic fields (id, title, description)
 */
function compareBasicFields(payload1: ProductPayload, payload2: ProductPayload, diffs: DiffResult[]) {
  const basicFields: (keyof ProductPayload)[] = ['id', 'title', 'description']
  
  for (const field of basicFields) {
    if (payload1[field] !== payload2[field]) {
      diffs.push({
        type: 'modified',
        path: field,
        oldValue: payload1[field],
        newValue: payload2[field],
        details: `Changed from "${payload1[field]}" to "${payload2[field]}"`
      })
    }
  }
}

/**
 * Compare images arrays with detailed diff detection
 */
function compareImages(images1: ProductImage[], images2: ProductImage[], diffs: DiffResult[]) {
  const images1Map = new Map(images1.map(img => [img.id, img]))
  const images2Map = new Map(images2.map(img => [img.id, img]))
  
  // Find added images
  for (const [id, image] of images2Map) {
    if (!images1Map.has(id)) {
      diffs.push({
        type: 'added',
        path: `images[${id}]`,
        newValue: image,
        details: `New image added with ID ${id}`
      })
    }
  }
  
  // Find removed images
  for (const [id, image] of images1Map) {
    if (!images2Map.has(id)) {
      diffs.push({
        type: 'removed',
        path: `images[${id}]`,
        oldValue: image,
        details: `Image with ID ${id} was removed`
      })
    }
  }
  
  // Find modified images
  for (const [id, image1] of images1Map) {
    const image2 = images2Map.get(id)
    if (image2) {
      compareImageDetails(image1, image2, diffs, id)
    }
  }
  
  // Check for position changes (images with same ID but different positions)
  const positionChanges = findPositionChanges(images1, images2)
  diffs.push(...positionChanges)
}

/**
 * Compare individual image details
 */
function compareImageDetails(image1: ProductImage, image2: ProductImage, diffs: DiffResult[], id: number) {
  if (image1.position !== image2.position) {
    diffs.push({
      type: 'modified',
      path: `images[${id}].position`,
      oldValue: image1.position,
      newValue: image2.position,
      details: `Image position changed from ${image1.position} to ${image2.position}`
    })
  }
  
  if (image1.url !== image2.url) {
    diffs.push({
      type: 'modified',
      path: `images[${id}].url`,
      oldValue: image1.url,
      newValue: image2.url,
      details: `Image URL changed from "${image1.url}" to "${image2.url}"`
    })
  }
}

/**
 * Find position changes in images array
 */
function findPositionChanges(images1: ProductImage[], images2: ProductImage[]): DiffResult[] {
  const diffs: DiffResult[] = []
  
  // Create maps by position
  const pos1Map = new Map(images1.map(img => [img.position, img]))
  const pos2Map = new Map(images2.map(img => [img.position, img]))
  
  // Check each position
  for (let pos = 1; pos <= Math.max(images1.length, images2.length); pos++) {
    const img1 = pos1Map.get(pos)
    const img2 = pos2Map.get(pos)
    
    if (img1 && img2 && img1.id !== img2.id) {
      diffs.push({
        type: 'modified',
        path: `images[position:${pos}]`,
        oldValue: img1,
        newValue: img2,
        details: `Image at position ${pos} changed from ID ${img1.id} to ID ${img2.id}`
      })
    }
  }
  
  return diffs
}

/**
 * Compare variants arrays with detailed diff detection
 */
function compareVariants(variants1: ProductVariant[], variants2: ProductVariant[], diffs: DiffResult[]) {
  const variants1Map = new Map(variants1.map(v => [v.id, v]))
  const variants2Map = new Map(variants2.map(v => [v.id, v]))
  
  // Find added variants
  for (const [id, variant] of variants2Map) {
    if (!variants1Map.has(id)) {
      diffs.push({
        type: 'added',
        path: `variants[${id}]`,
        newValue: variant,
        details: `New variant added with ID ${id}`
      })
    }
  }
  
  // Find removed variants
  for (const [id, variant] of variants1Map) {
    if (!variants2Map.has(id)) {
      diffs.push({
        type: 'removed',
        path: `variants[${id}]`,
        oldValue: variant,
        details: `Variant with ID ${id} was removed`
      })
    }
  }
  
  // Find modified variants
  for (const [id, variant1] of variants1Map) {
    const variant2 = variants2Map.get(id)
    if (variant2) {
      compareVariantDetails(variant1, variant2, diffs, id)
    }
  }
}

/**
 * Compare individual variant details
 */
function compareVariantDetails(variant1: ProductVariant, variant2: ProductVariant, diffs: DiffResult[], id: number) {
  const fields: (keyof ProductVariant)[] = ['sku', 'barcode', 'image_id', 'inventory_quantity']
  
  for (const field of fields) {
    if (variant1[field] !== variant2[field]) {
      diffs.push({
        type: 'modified',
        path: `variants[${id}].${field}`,
        oldValue: variant1[field],
        newValue: variant2[field],
        details: `Variant ${field} changed from "${variant1[field]}" to "${variant2[field]}"`
      })
    }
  }
}

/**
 * Calculate summary statistics from diffs
 */
function calculateSummary(diffs: DiffResult[]) {
  const summary = {
    images: { added: 0, removed: 0, modified: 0 },
    variants: { added: 0, removed: 0, modified: 0 },
    other: { added: 0, removed: 0, modified: 0 }
  }
  
  for (const diff of diffs) {
    const category = diff.path.startsWith('images') ? 'images' : 
                    diff.path.startsWith('variants') ? 'variants' : 'other'
    
    // Only count non-unchanged types
    if (diff.type !== 'unchanged') {
      summary[category][diff.type]++
    }
  }
  
  return summary
}

