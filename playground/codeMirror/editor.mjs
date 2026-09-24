import {EditorView, basicSetup} from "codemirror"
import {freestTheme} from "./freest-lang-highlights.mjs"
import {StreamLanguage} from "@codemirror/language"
import {haskell} from "@codemirror/legacy-modes/mode/haskell"

let myTheme = EditorView.theme({
    "&": { 
        height: "100%",
        padding: "0.75rem",
        fontSize: "0.85rem"
    },
    ".cm-scroller": {
        overflow: "auto",
        lineHeight: "1.5"
    },
    ".cm-content": { 
        fontFamily: "overpass-mono, monospace",
        fontVariantLigatures: "none",
        color: "#5c5962"
    },
    ".cm-gutters": { 
        backgroundColor: "transparent", borderRight: "none" 
    },
    ".cm-activeLineGutter": { 
        backgroundColor: "transparent" 
    }
})

const editors = new WeakMap()

export function createEditor(target, initialDoc) {
    const parent = resolveElement(target)
    if(!parent) {
        throw new Error(`Element with id "${target}" not found`)
    }

    parent.textContent = ""

    const view = new EditorView({
        //doc allows to write inherent text on the text editor which should be used as examples on the tutorial
        doc: initialDoc,
        extensions: [
            myTheme,
            EditorView.lineWrapping,
            basicSetup,
            StreamLanguage.define(haskell),
            freestTheme
        ],
        //To change the html file "div" selected for replace its id here
        parent
    })
    editors.set(parent, view)
    return view
}

export function resolveElement(target){
    if(typeof target == "string") {
        return document.getElementById(target)
    }
    return target
}

export function getEditor(target) {
    const element = resolveElement(target)
    return editors.get(element)
}

export function removeEditor(target) {
    const element = resolveElement(target)
    const view = editors.get(element)
    if (view) {
        view.destroy()
        editors.delete(element)
    }
}

window.createEditor = createEditor
window.getEditor = getEditor
window.destroyEditor = removeEditor