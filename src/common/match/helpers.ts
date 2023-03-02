export function isIterator(obj: any): obj is Iterator<any> {
  return obj && typeof obj.next === 'function'
}

export function isIterable(obj: any): obj is Iterable<any> {
  return obj && typeof obj[Symbol.iterator] === 'function'
}
