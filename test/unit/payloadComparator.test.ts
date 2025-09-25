import { describe, it, expect } from 'vitest'
import { compareObjects, comparePayloads } from '../../server/utils/payloadComparator'
import { validatePayload, validateProductPayload, type ProductPayload } from '../../server/types/payload.types'

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
    it('should validate any valid JSON payload', () => {
      const result = validatePayload(samplePayload1)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate simple objects', () => {
      const simplePayload = { name: "test", value: 123 }
      const result = validatePayload(simplePayload)
      expect(result.isValid).toBe(true)
    })

    it('should reject null or undefined payloads', () => {
      expect(validatePayload(null).isValid).toBe(false)
      expect(validatePayload(undefined).isValid).toBe(false)
    })

    it('should reject non-serializable payloads', () => {
      const circularPayload: any = { name: "test" }
      circularPayload.self = circularPayload
      const result = validatePayload(circularPayload)
      expect(result.isValid).toBe(false)
    })
  })

  describe('validateProductPayload (legacy)', () => {
    it('should validate a correct product payload', () => {
      const result = validateProductPayload(samplePayload1)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject payload with missing required fields', () => {
      const invalidPayload = { id: 123, title: "Test" }
      const result = validateProductPayload(invalidPayload)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Missing required field: description')
    })

    it('should reject payload with invalid images structure', () => {
      const invalidPayload = { ...samplePayload1, images: "not an array" }
      const result = validateProductPayload(invalidPayload)
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
      
      // Check for added image (generic comparator uses index-based paths)
      const addedImageDiff = result.diffs.find(diff => 
        diff.path === 'images[2]' && diff.type === 'added'
      )
      expect(addedImageDiff).toBeDefined()
      
      // Check for modified image URL
      const modifiedImageDiff = result.diffs.find(diff => 
        diff.path === 'images[1].url' && diff.type === 'modified'
      )
      expect(modifiedImageDiff).toBeDefined()
    })

    it('should detect variant changes', () => {
      const result = comparePayloads(samplePayload1, samplePayload2)
      
      // Check for added variant (generic comparator uses index-based paths)
      const addedVariantDiff = result.diffs.find(diff => 
        diff.path === 'variants[2]' && diff.type === 'added'
      )
      expect(addedVariantDiff).toBeDefined()
      
      // Check for modified inventory quantity
      const modifiedInventoryDiff = result.diffs.find(diff => 
        diff.path === 'variants[0].inventory_quantity' && diff.type === 'modified'
      )
      expect(modifiedInventoryDiff).toBeDefined()
      expect(modifiedInventoryDiff?.oldValue).toBe(12)
      expect(modifiedInventoryDiff?.newValue).toBe(10)
    })

    it('should calculate correct total changes', () => {
      const result = comparePayloads(samplePayload1, samplePayload2)
      
      expect(result.totalChanges).toBeGreaterThan(0)
      expect(result.hasChanges).toBe(true)
    })
  })

  describe('compareObjects (simplified)', () => {
    it('should compare simple objects', () => {
      const obj1 = { name: "test", value: 123 }
      const obj2 = { name: "test", value: 456 }
      
      const result = compareObjects(obj1, obj2)
      expect(result.hasChanges).toBe(true)
      expect(result.diffs).toHaveLength(1)
      expect(result.diffs[0].path).toBe('value')
      expect(result.diffs[0].type).toBe('modified')
    })

    it('should compare nested objects', () => {
      const obj1 = { user: { name: "John", age: 30 } }
      const obj2 = { user: { name: "Jane", age: 30 } }
      
      const result = compareObjects(obj1, obj2)
      expect(result.hasChanges).toBe(true)
      expect(result.diffs[0].path).toBe('user.name')
    })

    it('should compare arrays by index', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [1, 4, 3]
      
      const result = compareObjects(arr1, arr2)
      expect(result.hasChanges).toBe(true)
      expect(result.diffs[0].path).toBe('[1]')
    })

    it('should handle null and undefined', () => {
      const obj1 = { value: null }
      const obj2 = { value: "test" }
      
      const result = compareObjects(obj1, obj2)
      expect(result.hasChanges).toBe(true)
      expect(result.diffs[0].type).toBe('added') // null to value is treated as added
    })

    it('should detect added properties', () => {
      const obj1 = { name: "test" }
      const obj2 = { name: "test", value: 123 }
      
      const result = compareObjects(obj1, obj2)
      expect(result.hasChanges).toBe(true)
      expect(result.diffs[0].type).toBe('added')
      expect(result.diffs[0].path).toBe('value')
    })

    it('should detect removed properties', () => {
      const obj1 = { name: "test", value: 123 }
      const obj2 = { name: "test" }
      
      const result = compareObjects(obj1, obj2)
      expect(result.hasChanges).toBe(true)
      expect(result.diffs[0].type).toBe('removed')
      expect(result.diffs[0].path).toBe('value')
    })
  })
})
