import { Dialog } from "quasar"

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

export function randintWithFactor(seed: number, a: number, m: number): number {
  const c = 0x1B9CE261E;
  return (a * seed + c) % m;
}

export function randint(seed: number): number {
  const a = 0x9A3B77CF1;
  return randintWithFactor(seed, a, 0x80000000);
}

export function randfloatWithFactor(seed: number, a: number, m: number): number {
  return randintWithFactor(seed, a, m) / m;
}

export function randfloat(seed: number): number {
  return randint(seed) / 0x80000000;
}

export function confirm(name: string, s: string, f: () => void) {
    Dialog.create({
        title: name,
        message: s,
        cancel: true,
        persistent: true,
        dark: true
    }).onOk(f);
}