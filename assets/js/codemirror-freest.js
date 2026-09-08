/* ---------------------------------------------------------------------------
 * FreeST 5 language mode for CodeMirror 5.
 *
 * Token categories mirror assets/js/prism-freest.js one-for-one, so the
 * playground editor colours a program exactly like the ```freest blocks in the
 * tutorial. Keep the two lists in step: prism-freest.js is the source of truth
 * and is itself derived from freest/src/Parser/Lexer.x.
 *
 * (scripts/mode-freest.js is the older Ace mode; it targets a previous FreeST
 *  dialect -- End, dualof, new/send/receive, match/with -- and is not reused.)
 *
 * Written as a full defineMode rather than defineSimpleMode: simple mode
 * matches each rule against the rest of the line, so a `\bselect\b` rule would
 * light up the tail of an identifier such as `mySelect` once the scanner had
 * walked into the middle of it. Reading whole identifiers and then classifying
 * them makes that impossible.
 * ------------------------------------------------------------------------- */
(function (CodeMirror) {
  "use strict";

  function wordSet(words) {
    var set = {};
    words.split(" ").forEach(function (w) { set[w] = true; });
    return set;
  }

  // Reserved words -- Lexer.x <0> "kw" { token TkXxx }.
  var KEYWORDS = wordSet(
    "case channel data dualof else exists forall if import in let match " +
    "mutual of otherwise then type where with"
  );

  // Built-in (session / functional) type constructors.
  var BUILTINS = wordSet("Char Close Dual Float Int Skip Void Wait");

  // Primitive channel operations, as a fixed name list rather than a
  // line-position heuristic, so a name always renders the same colour.
  var PRIMITIVES = wordSet(
    "close receive receive_ receiveType select select_ send send_ sendType wait"
  );

  var NUMBER   = /^\d(?:_*\d)*(?:\.\d(?:_*\d)*)?(?:[eE][+-]?\d(?:_*\d)*)?/;
  var CHAR     = /^'(?:\\.|[^'\\])'/;
  // Longest match first. Session-type constructors (! ? & -> -{ }->),
  // arithmetic (+ +. * *. ...), comparison and the rest.
  var OPERATOR = /^(?:-\{|\}->|->|::|\|>|\|\||&&|\+\+|\*\*|==|\/=|<=?\.?|>=?\.?|[+\-*/^]\.?|[=:.@#$!?&|\\])/;
  var UPPER    = /^[A-Z][A-Za-z0-9_']*(?:\.[A-Z][A-Za-z0-9_']*)*/;
  var LOWER    = /^[a-z_][A-Za-z0-9_']*/;

  function blockComment(stream, state) {
    while (!stream.eol()) {
      if (stream.match("-}")) {          // not nested, cf. prism-freest.js
        state.inComment = false;
        break;
      }
      stream.next();
    }
    return "comment";
  }

  function string(stream) {
    var escaped = false, ch;
    while ((ch = stream.next()) != null) {
      if (ch === '"' && !escaped) break;
      escaped = !escaped && ch === "\\";
    }
    return "string";
  }

  CodeMirror.defineMode("freest", function () {
    return {
      startState: function () {
        return { inComment: false };
      },

      token: function (stream, state) {
        if (state.inComment) return blockComment(stream, state);
        if (stream.eatSpace()) return null;

        // Comments first, so keywords inside them are not tokenised.
        if (stream.match("{-")) {
          state.inComment = true;
          return blockComment(stream, state);
        }
        if (stream.match("--")) {
          stream.skipToEnd();
          return "comment";
        }

        if (stream.peek() === '"') { stream.next(); return string(stream); }
        if (stream.match(CHAR)) return "string";
        if (stream.match(NUMBER)) return "number";

        // Data / type constructors and qualified type names: Mod.Con, List, ...
        if (stream.match(UPPER)) {
          return BUILTINS[stream.current()] ? "builtin" : "type";
        }

        // All other lower-case identifiers -- ordinary functions AND variables
        // -- are left unstyled on purpose: a lexer cannot tell a definition
        // from a call site, and colouring only definition heads renders the
        // same name differently in different places.
        if (stream.match(LOWER)) {
          var word = stream.current();
          if (KEYWORDS[word]) return "keyword";
          if (PRIMITIVES[word]) return "primitive";
          return null;
        }

        if (stream.match(OPERATOR)) return "operator";
        if (stream.match(/^[(){}\[\],;]/)) return "punctuation";

        stream.next();
        return null;
      },

      lineComment: "--",
      blockCommentStart: "{-",
      blockCommentEnd: "-}"
    };
  });

  CodeMirror.defineMIME("text/x-freest", "freest");
})(window.CodeMirror);
