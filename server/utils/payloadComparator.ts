/**
 * Simple JSON object comparison utility
 * Compares two objects recursively and records changes
 */

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

/**
 * Simple deep comparison of two objects
 */
export function compareObjects(obj1: any, obj2: any, path: string = ''): ComparisonResult {
  const diffs: DiffResult[] = []
  
  // Handle null/undefined cases
  if (obj1 === null || obj1 === undefined) {
    if (obj2 !== null && obj2 !== undefined) {
      diffs.push({ path, type: 'added', newValue: obj2 })
    }
    return { hasChanges: diffs.length > 0, totalChanges: diffs.length, diffs }
  }
  
  if (obj2 === null || obj2 === undefined) {
    diffs.push({ path, type: 'removed', oldValue: obj1 })
    return { hasChanges: diffs.length > 0, totalChanges: diffs.length, diffs }
  }
  
  // Handle primitive types
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    if (obj1 !== obj2) {
      diffs.push({ path, type: 'modified', oldValue: obj1, newValue: obj2 })
    }
    return { hasChanges: diffs.length > 0, totalChanges: diffs.length, diffs }
  }
  
  // Handle arrays
  if (Array.isArray(obj1) || Array.isArray(obj2)) {
    compareArrays(obj1, obj2, path, diffs)
    return { hasChanges: diffs.length > 0, totalChanges: diffs.length, diffs }
  }
  
  // Handle objects
  compareObjectProperties(obj1, obj2, path, diffs)
  return { hasChanges: diffs.length > 0, totalChanges: diffs.length, diffs }
}

/**
 * Compare arrays by index
 */
function compareArrays(arr1: any[], arr2: any[], path: string, diffs: DiffResult[]) {
  const maxLength = Math.max(arr1?.length || 0, arr2?.length || 0)
  
  for (let i = 0; i < maxLength; i++) {
    const itemPath = path ? `${path}[${i}]` : `[${i}]`
    const item1 = arr1?.[i]
    const item2 = arr2?.[i]
    
    if (i >= (arr1?.length || 0)) {
      diffs.push({ path: itemPath, type: 'added', newValue: item2 })
    } else if (i >= (arr2?.length || 0)) {
      diffs.push({ path: itemPath, type: 'removed', oldValue: item1 })
    } else {
      const result = compareObjects(item1, item2, itemPath)
      diffs.push(...result.diffs)
    }
  }
}

/**
 * Compare object properties
 */
function compareObjectProperties(obj1: any, obj2: any, path: string, diffs: DiffResult[]) {
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])
  
  for (const key of allKeys) {
    const keyPath = path ? `${path}.${key}` : key
    const value1 = obj1[key]
    const value2 = obj2[key]
    
    // Check if key exists in both objects
    const hasKey1 = key in obj1
    const hasKey2 = key in obj2
    
    if (!hasKey1 && hasKey2) {
      diffs.push({ path: keyPath, type: 'added', newValue: value2 })
    } else if (hasKey1 && !hasKey2) {
      diffs.push({ path: keyPath, type: 'removed', oldValue: value1 })
    } else if (hasKey1 && hasKey2) {
      const result = compareObjects(value1, value2, keyPath)
      diffs.push(...result.diffs)
    }
  }
}

/**
 * Legacy function for backward compatibility
 */
export function comparePayloads(payload1: any, payload2: any): ComparisonResult {
  return compareObjects(payload1, payload2)
}