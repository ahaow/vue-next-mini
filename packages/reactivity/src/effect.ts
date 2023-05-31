import { extend, isArray } from '@vue/shared'
import { ComputedRefImpl } from './computed'
import { Dep, createDep } from './dep'

export type EffectScheduler = (...args: any[]) => any

type KeyToDepMap = Map<any, Dep>

const targetMap = new WeakMap<any, KeyToDepMap>()

export interface ReactiveEffectOptions {
  lazy?: boolean;
  scheduler?: EffectScheduler
}

export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  const _effect = new ReactiveEffect(fn)

  if (options) {
    extend(_effect, options)
  }

  if (!options || !options.lazy) {
    _effect.run()
  }
}

export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {

  computed?: ComputedRefImpl<T>

  constructor(public fn: () => T, public scheduler: EffectScheduler | null = null) {}
  run() {
    activeEffect = this
    return this.fn()
  }

  stop() {}
}

/**
 * 收集依赖
 * @param target
 * @param key
 */
export function track(target: object, key: unknown) {
  // console.log('track: 收集依赖')
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  trackEffects(dep)
}

/**
 * 利用 dep 依次跟踪指定 key 的所有 effect
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}

/**
 * 触及依赖
 * @param target
 * @param key
 * @param newValue
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  // console.log('trigger: 触及依赖')
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  // const effect = depsMap.get(key) as ReactiveEffect
  const dep: Dep | undefined = depsMap.get(key)
  if (!dep) {
    return
  }
  triggerEffects(dep)
}

/**
 * 依次触发 dep 中保存的依赖
 */
export function triggerEffects(dep: Dep) {
  const effects = isArray(dep) ? dep : [...dep]

  // 依次触发依赖
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect)
    }
  }

  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect)
    }
  }
}

/**
 * 触发指定依赖
 * @param effect
 */
export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler()
  } else {
    effect.run()
  }
}
