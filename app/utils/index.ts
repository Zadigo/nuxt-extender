import type { Undefineable } from '~/types'

/**
 * Function to create an id for an element based on a base and parts. 
 * The parts are joined with a separator and added to the base.
 * @param base The base of the id, usually the component name
 * @param parts The parts to be added to the id, usually the props of the component
 */
export function createElementId(base: string, parts: Array<Undefineable<string | number>> = [], join = '__') {
  const _parts = parts ? parts.map(p => (p || '').toString().replace(' ', '-')).filter(Boolean).join(join) : ''
  return `${base}${(join + _parts).trim()}`
}
