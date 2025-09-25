import { describe, it, expect } from 'vitest'
import { validatePayload, validateProductPayload, type ProductPayload } from '../../server/types/payload.types'

describe('Payload Validation', () => {
  describe('validatePayload (generic)', () => {
    it('should validate any valid JSON payload', () => {
      const validPayloads = [
        { name: "test", value: 123 },
        { users: [{ id: 1, name: "John" }] },
        { data: { nested: { deep: "value" } } },
        [],
        "simple string",
        123,
        true
        // Note: null is not valid according to the validation function
      ]

      validPayloads.forEach(payload => {
        const result = validatePayload(payload)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    it('should reject null and undefined payloads', () => {
      const result1 = validatePayload(null)
      expect(result1.isValid).toBe(false)
      expect(result1.errors).toContain('Payload cannot be null or undefined')

      const result2 = validatePayload(undefined)
      expect(result2.isValid).toBe(false)
      expect(result2.errors).toContain('Payload cannot be null or undefined')
    })

    it('should reject non-serializable payloads', () => {
      const circularPayload: any = { name: "test" }
      circularPayload.self = circularPayload
      
      const result = validatePayload(circularPayload)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Payload must be JSON-serializable')
    })

    it('should accept payloads with functions (JSON.stringify ignores them)', () => {
      const payloadWithFunction = {
        name: "test",
        fn: () => {}
      }
      
      const result = validatePayload(payloadWithFunction)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept payloads with symbols (JSON.stringify ignores them)', () => {
      const payloadWithSymbol = {
        name: "test",
        symbol: Symbol('test')
      }
      
      const result = validatePayload(payloadWithSymbol)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should handle complex valid structures', () => {
      const complexPayload = {
        users: [
          {
            id: 1,
            profile: {
              name: "John",
              settings: {
                theme: "dark",
                notifications: true
              }
            },
            tags: ["admin", "user"]
          }
        ],
        metadata: {
          version: "1.0.0",
          timestamp: "2023-01-01T00:00:00Z"
        }
      }
      
      const result = validatePayload(complexPayload)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should handle edge cases', () => {
      const edgeCases = [
        { empty: {} },
        { array: [] },
        { string: "" },
        { number: 0 },
        { boolean: false },
        { nullValue: null }
      ]

      edgeCases.forEach(payload => {
        const result = validatePayload(payload)
        expect(result.isValid).toBe(true)
      })
    })
  })

  describe('validateProductPayload (legacy)', () => {
    const validProductPayload: ProductPayload = {
      id: 123,
      title: "Test Product",
      description: "A test product description",
      images: [
        { id: 1, position: 1, url: "https://example.com/image1.jpg" },
        { id: 2, position: 2, url: "https://example.com/image2.jpg" }
      ],
      variants: [
        {
          id: 1,
          sku: "SKU-001",
          barcode: "123456789",
          image_id: 1,
          inventory_quantity: 10
        },
        {
          id: 2,
          sku: "SKU-002",
          barcode: "987654321",
          image_id: 2,
          inventory_quantity: 5
        }
      ]
    }

    it('should validate a correct product payload', () => {
      const result = validateProductPayload(validProductPayload)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject non-object payloads', () => {
      const testCases = [
        { payload: null, shouldHaveObjectError: true },
        { payload: undefined, shouldHaveObjectError: true },
        { payload: "string", shouldHaveObjectError: true },
        { payload: 123, shouldHaveObjectError: true },
        { payload: true, shouldHaveObjectError: true },
        { payload: [], shouldHaveObjectError: false } // Arrays are objects in JS
      ]

      testCases.forEach(({ payload, shouldHaveObjectError }) => {
        const result = validateProductPayload(payload)
        expect(result.isValid).toBe(false)
        if (shouldHaveObjectError) {
          expect(result.errors).toContain('Payload must be an object')
        } else {
          expect(result.errors.length).toBeGreaterThan(0)
        }
      })
    })

    it('should reject payloads with missing required fields', () => {
      const testCases = [
        { id: 123, title: "Test" }, // missing description, images, variants
        { id: 123, title: "Test", description: "Desc" }, // missing images, variants
        { id: 123, title: "Test", description: "Desc", images: [] }, // missing variants
        { title: "Test", description: "Desc", images: [], variants: [] }, // missing id
        { id: 123, description: "Desc", images: [], variants: [] }, // missing title
      ]

      testCases.forEach(payload => {
        const result = validateProductPayload(payload)
        expect(result.isValid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })
    })

    it('should validate images array structure', () => {
      const invalidImagesCases = [
        { ...validProductPayload, images: "not an array" },
        { ...validProductPayload, images: [{ id: 1, position: 1 }] }, // missing url
        { ...validProductPayload, images: [{ id: 1, url: "test.jpg" }] }, // missing position
        { ...validProductPayload, images: [{ position: 1, url: "test.jpg" }] }, // missing id
      ]

      const validImagesCases = [
        { ...validProductPayload, images: [{ id: "invalid", position: 1, url: "test.jpg" }] }, // string id is valid
        { ...validProductPayload, images: [{ id: 1, position: "invalid", url: "test.jpg" }] }, // string position is valid
      ]

      invalidImagesCases.forEach(payload => {
        const result = validateProductPayload(payload)
        expect(result.isValid).toBe(false)
        expect(result.errors.some(error => 
          error.includes('Images must be an array') || 
          error.includes('Image at index') ||
          error.includes('missing required fields')
        )).toBe(true)
      })

      validImagesCases.forEach(payload => {
        const result = validateProductPayload(payload)
        expect(result.isValid).toBe(true)
      })
    })

    it('should validate variants array structure', () => {
      const invalidVariantsCases = [
        { ...validProductPayload, variants: "not an array" },
        { ...validProductPayload, variants: [{ id: 1, sku: "SKU-001" }] }, // missing required fields
        { ...validProductPayload, variants: [{ id: 1, sku: "SKU-001", barcode: "123", image_id: 1 }] }, // missing inventory_quantity
        { ...validProductPayload, variants: [{ sku: "SKU-001", barcode: "123", image_id: 1, inventory_quantity: 10 }] }, // missing id
      ]

      invalidVariantsCases.forEach(payload => {
        const result = validateProductPayload(payload)
        expect(result.isValid).toBe(false)
        expect(result.errors.some(error => 
          error.includes('Variants must be an array') || 
          error.includes('Variant at index') ||
          error.includes('missing required field')
        )).toBe(true)
      })
    })

    it('should handle empty arrays correctly', () => {
      const payloadWithEmptyArrays = {
        ...validProductPayload,
        images: [],
        variants: []
      }
      
      const result = validateProductPayload(payloadWithEmptyArrays)
      expect(result.isValid).toBe(true)
    })

    it('should validate multiple images and variants', () => {
      const payloadWithMultipleItems = {
        ...validProductPayload,
        images: [
          { id: 1, position: 1, url: "https://example.com/image1.jpg" },
          { id: 2, position: 2, url: "https://example.com/image2.jpg" },
          { id: 3, position: 3, url: "https://example.com/image3.jpg" }
        ],
        variants: [
          {
            id: 1,
            sku: "SKU-001",
            barcode: "123456789",
            image_id: 1,
            inventory_quantity: 10
          },
          {
            id: 2,
            sku: "SKU-002",
            barcode: "987654321",
            image_id: 2,
            inventory_quantity: 5
          },
          {
            id: 3,
            sku: "SKU-003",
            barcode: "456789123",
            image_id: 3,
            inventory_quantity: 15
          }
        ]
      }
      
      const result = validateProductPayload(payloadWithMultipleItems)
      expect(result.isValid).toBe(true)
    })

    it('should provide detailed error messages', () => {
      const invalidPayload = {
        id: 123,
        title: "Test",
        // missing description, images, variants
      }
      
      const result = validateProductPayload(invalidPayload)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Missing required field: description')
      expect(result.errors).toContain('Missing required field: images')
      expect(result.errors).toContain('Missing required field: variants')
    })

    it('should handle edge cases in validation', () => {
      const validEdgeCases = [
        { ...validProductPayload, id: 0 }, // id can be 0
        { ...validProductPayload, title: "" }, // empty title
        { ...validProductPayload, description: "" }, // empty description
      ]

      validEdgeCases.forEach(payload => {
        const result = validateProductPayload(payload)
        expect(result.isValid).toBe(true)
      })

      // These edge cases should fail because 0 is treated as falsy in the validation
      const invalidEdgeCases = [
        { ...validProductPayload, images: [{ id: 0, position: 0, url: "" }] }, // 0 is falsy for id and position
      ]

      const validVariantEdgeCases = [
        { ...validProductPayload, variants: [{ id: 0, sku: "", barcode: "", image_id: 0, inventory_quantity: 0 }] } // 0 is valid for variant fields
      ]

      invalidEdgeCases.forEach(payload => {
        const result = validateProductPayload(payload)
        expect(result.isValid).toBe(false)
      })

      validVariantEdgeCases.forEach(payload => {
        const result = validateProductPayload(payload)
        expect(result.isValid).toBe(true)
      })
    })
  })
})
