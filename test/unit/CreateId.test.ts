import { describe, it, expect } from 'vitest'
import { createElementId } from '../../app/utils'

describe('CreateId', () => {
  it('should create a unique id', () => {
    const id = createElementId('test', ['part1', 'part2'])
    expect(id).toBeTypeOf('string')
    expect(id).toBe('test__part1__part2')
  })
})
