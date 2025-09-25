import { describe, it, expect } from 'vitest'
import { comparePayloads } from '../../server/utils/payloadComparator'
import { validatePayload, type ProductPayload } from '../../server/types/payload.types'

describe('Payload Comparator', () => {
  const samplePayload1: ProductPayload = {
    id: 432232523,
    title: "Syncio T-Shirt",
    description: "Original description",
    images: [
      { id: 26372, position: 1, url: "https://example.com/image1.png" },
      { id: 23445, position: 2, url: "https://example.com/image2.png" }
    ],
    variants: [
      { id: 433232, sku: "SKU-II-10", barcode: "BAR_CODE_230", image_id: 26372, inventory_quantity: 12 },
      { id: 231544, sku: "SKU-II-20", barcode: "B231342313", image_id: 23445, inventory_quantity: 2 }
    ]
  }

  const samplePayload2: ProductPayload = {
    id: 432232523,
    title: "Syncio T-Shirt",
    description: "Modified description",
    images: [
      { id: 26372, position: 1, url: "https://example.com/image1.png" },
      { id: 23445, position: 2, url: "https://example.com/image2_modified.png" },
      { id: 34566, position: 3, url: "https://example.com/image3.png" }
    ],
    variants: [
      { id: 433232, sku: "SKU-II-10", barcode: "BAR_CODE_230", image_id: 26372, inventory_quantity: 10 },
      { id: 231544, sku: "SKU-II-20", barcode: "B231342313", image_id: 23445, inventory_quantity: 2 },
      { id: 323245, sku: "SKU-II-30", barcode: "NEW_BARCODE", image_id: 34566, inventory_quantity: 5 }
    ]
  }

  describe('validatePayload', () => {
    it('should validate a correct payload', () => {
      const result = validatePayload(samplePayload1)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject payload with missing required fields', () => {
      const invalidPayload = { id: 123, title: "Test" }
      const result = validatePayload(invalidPayload)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Missing required field: description')
    })

    it('should reject payload with invalid images structure', () => {
      const invalidPayload = { ...samplePayload1, images: "not an array" }
      const result = validatePayload(invalidPayload)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Images must be an array')
    })
  })

  describe('comparePayloads', () => {
    it('should detect no changes for identical payloads', () => {
      const result = comparePayloads(samplePayload1, samplePayload1)
      expect(result.hasChanges).toBe(false)
      expect(result.totalChanges).toBe(0)
      expect(result.diffs).toHaveLength(0)
    })

    it('should detect description changes', () => {
      const result = comparePayloads(samplePayload1, samplePayload2)
      expect(result.hasChanges).toBe(true)
      
      const descriptionDiff = result.diffs.find(diff => diff.path === 'description')
      expect(descriptionDiff).toBeDefined()
      expect(descriptionDiff?.type).toBe('modified')
      expect(descriptionDiff?.oldValue).toBe('Original description')
      expect(descriptionDiff?.newValue).toBe('Modified description')
    })

    it('should detect image changes', () => {
      const result = comparePayloads(samplePayload1, samplePayload2)
      
      // Check for added image
      const addedImageDiff = result.diffs.find(diff => 
        diff.path === 'images[34566]' && diff.type === 'added'
      )
      expect(addedImageDiff).toBeDefined()
      
      // Check for modified image URL
      const modifiedImageDiff = result.diffs.find(diff => 
        diff.path === 'images[23445].url' && diff.type === 'modified'
      )
      expect(modifiedImageDiff).toBeDefined()
    })

    it('should detect variant changes', () => {
      const result = comparePayloads(samplePayload1, samplePayload2)
      
      // Check for added variant
      const addedVariantDiff = result.diffs.find(diff => 
        diff.path === 'variants[323245]' && diff.type === 'added'
      )
      expect(addedVariantDiff).toBeDefined()
      
      // Check for modified inventory quantity
      const modifiedInventoryDiff = result.diffs.find(diff => 
        diff.path === 'variants[433232].inventory_quantity' && diff.type === 'modified'
      )
      expect(modifiedInventoryDiff).toBeDefined()
      expect(modifiedInventoryDiff?.oldValue).toBe(12)
      expect(modifiedInventoryDiff?.newValue).toBe(10)
    })

    it('should calculate correct summary statistics', () => {
      const result = comparePayloads(samplePayload1, samplePayload2)
      
      expect(result.summary.images.added).toBeGreaterThan(0)
      expect(result.summary.images.modified).toBeGreaterThan(0)
      expect(result.summary.variants.added).toBeGreaterThan(0)
      expect(result.summary.variants.modified).toBeGreaterThan(0)
      expect(result.summary.other.modified).toBeGreaterThan(0) // description change
    })
  })
})
