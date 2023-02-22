export function objectMap<S, U>(object: Record<string, S>, mapFn: (s: S) => U) {
    return Object.keys(object).reduce(function(result, key) {
      result[key] = mapFn(object[key])
      return result
    }, {} as Record<string, U>)
}
export function objectMapK<S, U>(object: Record<string, S>, mapFn: (k: string) => U) {
  return Object.keys(object).reduce(function(result, key) {
    result[key] = mapFn(key)
    return result
  }, {} as Record<string, U>)
}