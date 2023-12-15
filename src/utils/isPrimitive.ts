import type { CommonPrimitive } from "../types"

export default (v: unknown): v is CommonPrimitive => v === null || (typeof v !== 'object' && typeof v !== 'function')