import { isArray, isFunction, isObject, isString } from "@vue/shared"
import { normalizeClass } from "packages/shared/src/normalizeProp"
import { ShapeFlags } from "packages/shared/src/shapeFlags"

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
export const Comment = Symbol('Comment')

export interface VNode {
    __v_isVNode: boolean
    type: any
    props: any
    children: any
    shapeFlag: number
}

export function isVNode(value: any): value is VNode {
    return value ? value.__v_isVNode === true : false
}

export function createVNode(type, props, children): VNode {
    if (props) {
        let { class: klass, style } = props
        if (klass && !isString(klass)) {
            props.class = normalizeClass(klass)
        }
    }

    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0
    
    return createBaseVNode(type, props, children, shapeFlag)
}


function createBaseVNode(type, props, children, shapeFlag) {
    const vnode = {
        __v_isVNode: true,
        type,
        props,
        children,
        shapeFlag
    } as VNode
    normalizeChildren(vnode, children)
    return vnode
}

function normalizeChildren(vnode: VNode, children: unknown) {
    let type = 0

    if (children == null) {
        children = null
    } else if (isArray(children)) {
        type = ShapeFlags.ARRAY_CHILDREN
    } else if (isObject(children)) {
    
    } else if (isFunction(children)) {
        
    } else {
        children = String(children)
        type = ShapeFlags.TEXT_CHILDREN 
    }

    vnode.children = children
    vnode.shapeFlag |= type
}