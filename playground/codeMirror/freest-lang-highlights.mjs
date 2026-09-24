import {HighlightStyle, syntaxHighlighting} from "@codemirror/language"
import {tags} from "@lezer/highlight"

const freestHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword,                color: '#2b7db2'},
  { tag: tags.standard(tags.name),    color: '#589eab'},
  { tag: tags.typeName,               color: '#8f70ec'},
  { tag: tags.variableName,           color: '#5c5962'},
  { tag: tags.modifier,               color: '#000000'},
  { tag: tags.string,                 color: '#4a9b5b'},
  { tag: tags.number,                 color: '#ba4550'},
  { tag: tags.lineComment,            color: '#969da5'},
  { tag: tags.meta,                   color: '#969da5'}, 
  { tag: tags.invalid,                color: '#e06c75'},
]);

export const freestTheme = syntaxHighlighting(freestHighlightStyle);