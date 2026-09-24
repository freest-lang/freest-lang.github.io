/*
import {StreamLanguage, HighlightStyle, syntaxHighlighting} from "@codemirror/language"
import {tags} from "@lezer/highlight"

const freeSTParser = {

    tokenTable: {
        lineComment: tags.lineComment,
        blockComment: tags.blockComment,
        todo: tags.meta,
        string: tags.string,
        character: tags.character,
        number: tags.number,
        functionName: tags.function(tags.variableName),
        moduleKeyword: tags.moduleKeyword,
        controlKeyword: tags.controlKeyword,
        sessionKeyword: tags.keyword,
        typeKeyword: tags.definitionKeyword,
        basicType: tags.atom,
        sessionType: tags.typeName,
        typeOperator: tags.operatorKeyword,
        constructor: tags.className,
        operator: tags.operator,
    },

    startState() {
        return {
            inBlockComment: false,
            // Whether the current logical line is a type signature
            // (name1, name2, ... : ...)
            inSignature: false,
            // Whether the current logical line is an equation head
            // (name arg1 arg2 ... = ...) and whether we've already
            // consumed the defining name on this line.
            inEquationHead: false,
            eqNameConsumed: false,
        };
    },

    token(stream, state) {
        //If the written code is inside a block comment it keeps getting checked to be sure when to end the comment
        if (state.inBlockComment) {
            if (stream.match(/^TODO\b/)) return "todo";
            if (stream.match(/^-}/)) {
                state.inBlockComment = false;
                return "blockComment";
            }
            if (stream.match(/^[^T-]+/)) return "blockComment";
            stream.next();
            return "blockComment";
        }

        //Start of a block comment
        if (stream.match(/^\{-/)) {
            state.inBlockComment = true;
            return "blockComment";
        }

        //Start of a line comment
        if (stream.match(/^--/)) {
            stream.skipToEnd();
            return "lineComment";
        }

        // At the start of a new logical line, look at the *whole* line
        // (without consuming anything) to decide once and for all whether
        // this is a type-signature line ("name, name2, ... :") or an
        // equation line ("name arg1 arg2 ... ="). This avoids misfiring on
        // identifiers that just happen to sit right before a ':' or '='
        // later in the line (e.g. the "y" in "x y = x + y").
        if (stream.sol()) {
            const line = stream.string;
            // Only a line with NO leading whitespace can be a top-level
            // declaration (type signature or equation head). Indented lines
            // are bindings inside a `let`/`where` block (or continuations)
            // and must never be treated as function definitions.
            const isTopLevel = /^[a-z]/.test(line);
            state.inSignature = isTopLevel && /^[a-z][a-zA-Z0-9_.\-']*(\s*,\s*[a-z][a-zA-Z0-9_.\-']*)*\s*:/.test(line);
            // An equation head needs an actual '=' after the name (not just
            // the name on its own, and not '==' / '/=' / '<=' / '>=').
            state.inEquationHead = isTopLevel && !state.inSignature && /^[a-z][a-zA-Z0-9_.\-']*\b[^=]*=(?!=)/.test(line);
            state.eqNameConsumed = false;
        }

        if (stream.match(/^"[^"]*"/)) return "string";
        if (stream.match(/^'[^']*'/)) return "character";
        if (stream.match(/^[0-9]+(\.[0-9]+)?\b/)) return "number";
        if (stream.match(/[(){}\[\],;]/)) return "punctuation";

        // Definition-site name(s): either every comma-separated name in a
        // type signature, or just the first identifier of an equation line.
        if (state.inSignature && stream.match(/^[a-z][a-zA-Z0-9_.\-']*\b/)) {
            return "functionName";
        }
        if (state.inEquationHead && !state.eqNameConsumed && stream.match(/^[a-z][a-zA-Z0-9_.\-']*\b/)) {
            state.eqNameConsumed = true;
            return "functionName";
        }

        if (stream.match(/\b(?:module|where|import|mutual|otherwise)\b/)) return "moduleKeyword";
        if (stream.match(/\b(?:if|then|else|case|of|match|with|let|in|channel|exists)\b/)) return "controlKeyword";
        if (stream.match(/\b(?:new|send|receive|select|fork|close|receiveType|sendType)\b/)) return "sessionKeyword";
        if (stream.match(/\b(?:forall|rec|type|data)\b/)) return "typeKeyword";

        if (stream.match(/\b(?:Char|Close|Dual|Float|Int|Skip|Void|Wait)\b/)) return "basicType";
        if (stream.match(/\b(?:Skip|End)\b|^(?:1T|\*T|1S|\*S)/)) return "sessionType";
        if (stream.match(/\b(?:dualof)\b|^@/)) return "typeOperator";

        // Data / type constructors and (qualified) type names: Mod.Con, List, ...
        if (stream.match(/\b[A-Z][a-zA-Z0-9_.-]*\b/)) return "constructor";

        // Variables and standard identifiers in lowercase (e.g., "main", parameters, etc.)
        // By capturing the entire word here, we prevent the parser from "splitting" the word in the middle
        if (stream.match(/^[a-z][a-zA-Z0-9_']*\b/)) {
            return null;
        }
*/
        // Operators, longest match first. Covers session-type constructors
        // (! ? & -> -{ }->), arithmetic (+ +. * *. ...), comparison and the rest.
        //if(stream.match(/-\{|\}->|->|::|\|>|\|\||&&|\+\+|\*\*|==|\/=|<=?\.?|>=?\.?|[+\-*/^]\.?|[=:.@#$!?&|\\]/)) return "operator";
/*
        stream.next();
        return null;
  }
}

const freestHighlightStyle = HighlightStyle.define([
  { tag: [tags.lineComment, tags.blockComment], color: "#71808c" },
  { tag: tags.meta, color: "#000000"},
  { tag: tags.string, color: "#22863a" },
  { tag: tags.character, color: "#22863a" },
  { tag: tags.number, color: "#cb2431" },       
  { tag: tags.function(tags.variableName), color: "#d34b22" },
  { tag: [tags.moduleKeyword, tags.controlKeyword, tags.keyword, tags.definitionKeyword, tags.operatorKeyword], color: "#0063A3" },
  { tag: [tags.typeName, tags.className], color: "#0B7285" },
  { tag: tags.atom, color: "#6f42c1" },
]);

export const freestLanguage = StreamLanguage.define(freeSTParser);
export const freestTheme = syntaxHighlighting(freestHighlightStyle);
*/