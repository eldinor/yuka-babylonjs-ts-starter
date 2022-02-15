import { Color4, LinesMesh, Material, Nullable, Vector3 } from '@babylonjs/core'

export type FlatMatrix4x4 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
]

export type CreateLinesOptions = {
    colors?: Color4[]
    instance?: Nullable<LinesMesh>
    material?: Material
    points: Vector3[]
    updatable?: boolean
    useVertexAlpha?: boolean
}
