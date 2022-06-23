class MouseMoveAction {
    readonly #delay: number
    readonly #XY: [ number, number ]
    readonly #relative: boolean

    constructor(delay: number, XY: [ number, number ], relative: boolean = false) {
        this.#delay = delay
        this.#XY = XY
        this.#relative = relative
    }

    toXML() {
        return this.#relative
            ? `<MouseMoveRelative><delay>${ this.#delay }</delay><target>${ this.#XY }</target></MouseMoveRelative>`
            : `<MouseMoveAbsolute><delay>${ this.#delay }</delay><offset>${ this.#XY }</offset></MouseMoveAbsolute>`
    }
}

class MouseClickAction {
    readonly #delay: number
    readonly #button: 'Left' | 'Right'

    constructor(delay: number, button: 'Left' | 'Right') {
        this.#delay = delay
        this.#button = button
    }

    toXML() {
        return `<Mouse${ this.#button }><delay>${ this.#delay }</delay></Mouse${ this.#button }>`
    }
}

class KeyboardAction {
    readonly #delay: number
    readonly #type: 'Click' | 'Press'
    readonly #key: string
    readonly #duration?: number

    constructor(delay: number, type: 'Click' | 'Press', key: string, duration?: number) {
        this.#delay = delay
        this.#type = type
        this.#key = key
        this.#duration = duration
    }

    toXML() {
        return `<Key${ this.#type }><delay>${ this.#delay }</delay><key>${ this.#key }</key>${ this.#duration === undefined ? '' : `<duration>${ this.#duration }</duration>` }</Key${ this.#type }>`
    }
}

type ActionType = MouseMoveAction | MouseClickAction | KeyboardAction

class ActionFileGenerator {
    #actions: ActionType[]

    constructor(actions: ActionType[] = []) {
        this.#actions = actions
    }

    addActions(actions: ActionType[]) {
        this.#actions.push(...actions)
    }

    toXML() {

    }
}

export {
    MouseMoveAction,
    KeyboardAction,
    ActionFileGenerator
}

const actions = []