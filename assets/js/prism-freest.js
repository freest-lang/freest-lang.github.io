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

    // Reserved words -- Lexer.x  <0> "kw" { token TkXxx }
    // NOTE: dualof/match/with are not in the current Lexer.x but are used
    // pervasively in the docs as FreeST surface syntax; included so they
    // highlight. Drop them here if the lexer is the sole source of truth.
    'keyword': /\b(?:case|channel|data|dualof|else|exists|forall|if|import|in|let|match|module|mutual|of|rec|receiveType|select|sendType|then|type|where|with)\b/,

    // Built-in (session / functional) type constructors.
    'builtin': /\b(?:Char|Close|Dual|Float|Int|Skip|Void|Wait)\b/,

    // Definition-site name: the lower-case identifier that opens a top-level
    // declaration line (a function signature or an equation head), at column
    // 0 -- e.g. both `writeFive :` and `writeFive c =`. Indented / mid-line
    // uses (call sites, variables) stay plain, since a regex cannot tell a
    // use from a definition.
    'function': /^[a-z][A-Za-z0-9_']*/m,

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
      'div.language-fst pre code'
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
