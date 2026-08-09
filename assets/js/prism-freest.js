/* ---------------------------------------------------------------------------
 * FreeST 5 language definition for Prism.js
 *
 * Token categories are derived from the authoritative FreeST 5 lexer:
 *   freest/src/Parser/Lexer.x   -- keywords, builtin types, operators, literals
 *   freest/src/Parser/Parser.y  -- token roles
 * (The older Ace mode in scripts/mode-freest.js targets a previous FreeST
 *  dialect -- End, dualof, new/send/receive, match/with -- and is NOT reused.)
 * ------------------------------------------------------------------------- */
(function (Prism) {
  Prism.languages.freest = {
    // Comments first so keywords inside them are not tokenised.
    'comment': [
      { pattern: /\{-[\s\S]*?-\}/, greedy: true },   // block comment (non-nested)
      { pattern: /--.*/, greedy: true }              // line comment
    ],

    'string': { pattern: /"(?:\\.|[^"\\\r\n])*"/, greedy: true },
    'char':   { pattern: /'(?:\\.|[^'\\])'/, greedy: true, alias: 'string' },

    // Reserved words -- Lexer.x  <0> "kw" { token TkXxx } -- minus
    // select/select_/sendType/receiveType, which read as primitive channel
    // operations (see below) even though the lexer happens to tokenise them
    // specially.
    // NOTE: dualof/match/with are not in the current Lexer.x but are used
    // pervasively in the docs as FreeST surface syntax; included so they
    // highlight. Drop them here if the lexer is the sole source of truth.
    'keyword': /\b(?:case|channel|data|dualof|else|exists|forall|if|import|in|let|match|mutual|of|otherwise|then|type|where|with)\b/,

    // Built-in (session / functional) type constructors.
    'builtin': /\b(?:Char|Close|Dual|Float|Int|Skip|Void|Wait)\b/,

    // Primitive channel operations: the vocabulary a FreeST programmer
    // reaches for to drive a channel (send/receive a value, send/receive a
    // type, select/offer a choice, wait, close), grouped as one category
    // regardless of whether the lexer implements each as a reserved word
    // (select, select_, sendType, receiveType) or as an ordinary applied
    // identifier pre-bound in the Prelude (send, receive, wait, close,
    // send_, receive_ -- see Interpreter/Builtin.hs). Unlike the old
    // `function` rule this is a fixed name list, not a line-position
    // heuristic, so a given name always renders the same colour wherever it
    // appears -- no red-here/black-there split.
    'primitive': /\b(?:close|receive_|receive|receiveType|select_|select|sendType|send_|send|wait)\b/,

    // NOTE: all other lower-case identifiers (ordinary functions AND
    // variables) are left unstyled on purpose. A regex cannot tell a
    // definition from a call site, so highlighting only the "definition
    // head" coloured the same name differently in different places.
    // Leaving them plain -- as Rouge's Haskell lexer does -- keeps
    // colouring consistent. (Already tried and reverted once before, in
    // 9492e8e; do not reintroduce a position-based `function` rule.)

    // Data / type constructors and (qualified) type names: Mod.Con, List, ...
    'class-name': /\b[A-Z][A-Za-z0-9_']*(?:\.[A-Z][A-Za-z0-9_']*)*\b/,

    // Int / Float literals (Lexer.x allows '_' digit separators).
    'number': /\b\d(?:_*\d)*(?:\.\d(?:_*\d)*)?(?:[eE][+-]?\d(?:_*\d)*)?\b/,

    // Operators, longest match first. Covers session-type constructors
    // (! ? & -> -{ }->), arithmetic (+ +. * *. ...), comparison and the rest.
    'operator': /-\{|\}->|->|::|\|>|\|\||&&|\+\+|\*\*|==|\/=|<=?\.?|>=?\.?|[+\-*/^]\.?|[=:.@#$!?&|\\]/,

    'punctuation': /[(){}\[\],;]/
  };

  // Convenience alias for ```fst fences and FreeSTi snippets.
  Prism.languages.fst = Prism.languages.freest;

  /* --- kramdown / Rouge integration ------------------------------------
   * Jekyll (kramdown + Rouge) does not know the `freest` language, so it
   * falls back to a plain block with the class on the <code> element:
   *   <pre><code class="language-freest">...</code></pre>
   * (Some setups instead wrap it as <div class="language-freest ..."><pre>
   * <code>...</code></pre></div>.) We handle both shapes and highlight each
   * block explicitly, since Prism.manual is set in <head>.
   */
  function highlightFreeST() {
    var blocks = document.querySelectorAll([
      'pre > code.language-freest',
      'pre > code.language-fst',
      'div.language-freest pre code',
      'div.language-fst pre code',
      // Inline code explicitly tagged as FreeST, e.g. `x`{: .language-freest }.
      'code.language-freest',
      'code.language-fst',
      // Reference-table cells (see .lib-table in custom.scss): every signature
      // in a Function/Type/Description cell is highlighted like a code line.
      '.lib-table td code'
    ].join(', '));
    Array.prototype.forEach.call(blocks, function (code) {
      if (code.getAttribute('data-freest-highlighted')) return;
      code.setAttribute('data-freest-highlighted', '1');
      code.classList.add('language-freest');
      Prism.highlightElement(code);
    });
  }

  if (document.readyState !== 'loading') {
    highlightFreeST();
  } else {
    document.addEventListener('DOMContentLoaded', highlightFreeST);
  }
})(window.Prism);
