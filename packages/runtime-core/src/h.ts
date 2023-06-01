import { isArray, isObject } from "@vue/shared";
import { createVNode, isVNode, VNode } from "./vnode";

export function h(type: any, propsOrChildren: any, children?: any): VNode {
    const l = arguments.length
    console.log('l', l)
    if (l === 2) {
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
            if (isVNode(propsOrChildren)) {
                return createVNode(type, null, [propsOrChildren])
            }
            return createVNode(type, propsOrChildren, [])
        } else {
            return createVNode(type, null, propsOrChildren)
        }
    } else {
        if (l > 3) {
            children = Array.prototype.slice.call(arguments, 2)
        } else if (l === 3 && isVNode(children)) {
            children = [children]
        }
        console.log('children', children)
        return createVNode(type, propsOrChildren, children)
    }
}