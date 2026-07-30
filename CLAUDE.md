# freest-lang.github.io

Jekyll site (just-the-docs theme) for the FreeST documentation.

## Indentation in FreeST code snippets

These rules apply to every ` ```freest ` fenced block in the Markdown sources.

### 1. Break the line after `=` when the body spans more than one line

Put nothing after the `=` of a definition whose body needs several lines; start
the body on the next line, indented two spaces.

```freest
_ =
  let (j, a) = channel @ForkJoin in
  fork (\_ -> put2Chars 'a' 'b' ; join j) ;
  await 2 a
```

Not `_ = let (j, a) = channel @ForkJoin in` with the rest below it.

A definition that fits on one line stays on one line — `_ = print 1`,
`_ = forkWith writeFive |> readInt`. There is nothing to indent, so rule 1 does
not apply.

### 2. Two spaces per level of indentation

Never four. Each nesting level adds two spaces to the level that encloses it:

```freest
marshall : forall a -> Tree a -> TreeC a; Close -> ()
marshall t c = mars t c |> close
  where
    mars : forall a b -> Tree a -> TreeC a; b -> b
    mars Leaf         c = c |> select Leaf
```

### 3. Alignment is not indentation — leave it alone

Some leading whitespace lines a token up with a token on an earlier line. It is
not a nesting level and must not be rounded to a multiple of two. When the line
it aligns with moves, it moves by the same amount, preserving the column.

FreeST's layout rule makes this load-bearing for `let`: misaligning a binding
changes what the code means. The same care applies to the other cases even where
only readability is at stake.

```freest
_ =
  let (c1, d1) = channel @Forward      -- `let` is a nesting level: 2
      (c2, d2) = channel @Forward      -- aligned under `(c1, d1)`: 6, not 4
  in fork (\_ -1-> relay c1 d2) ;
     fork (\_ -1-> relay c2 d3) ;      -- aligned under the first `fork`: 5
```

Other alignment to preserve as-is:

- `,` under `+{` in a choice type, and the closing `}`
- `|` under `=` in a `data` declaration, and `|` guards under each other
- a `|>` chain continued on following lines
- padding that lines up displayed laws, e.g. ` Wait ; T ≡ Wait` under
  `Close ; T ≡ Close` (one leading space, deliberately not a level)

## Notation in FreeST code snippets

These rules apply to every ` ```freest ` fenced block in the Markdown sources,
and to prose that quotes a type.

### 1. Abbreviate `-*->` to `->`

Write the unrestricted arrow as its abbreviation `->`, not the full `-*->`,
except:

- inside verbatim tool output — a `freest -i` transcript, or a compiler error
  message copied from a real `freest -t` run — where the text must match
  exactly what the tool prints;
- when the surrounding prose is explaining the `-*->` notation for the first
  time, or contrasting it against the linear arrow `-1->` (e.g. two otherwise
  identical signatures shown side by side, one linear, one unrestricted).
  Most of `linearity.md`, and the "Multiplicity polymorphism" section of
  `kinds-and-types.md`, fall under this exception, since contrasting `-*->`
  against `-1->` is their entire point.

### 2. Space the colon in a kind/type-qualified variable

Write `(a : 1T)`, not `(a:1T)` — a space on both sides of the colon. This
applies to `forall`-bound variables and type abstractions (`\(a : k) -> U`).
It does not apply to choice-type labels (`+{l: T, ...}`), which keep their
own established convention: no space before the colon, one space after.

### 3. Space the type-variable binder dot in `!type`/`?type`

Write `!type a. T` and `?type a. T` (and the matching pattern `?type a. p`):
no space before the dot, one space after. Same for the kinded form,
`?type (a : k). T`. This mirrors the choice-type label convention above.

### 4. Space function composition `(.)`

Write `f . g`, not `f.g` — a space on both sides, the same as any other
binary operator.

## Checking a snippet after editing it

`freest -t <file>.fst` type-checks without running. Re-indenting must not change the result: line:column numbers in messages shift, but the diagnostics themselves must be identical before and after.

Many snippets are fragments that use definitions introduced earlier in the same page, so `Variable out of scope` / `Type constructor out of scope` is the expected outcome for them and is not evidence of a problem. A *parse* error is —
that is what a broken re-indent produces.

## Scope note

`tutorial/` follows these rules. `libraries/` and `freest3/` also contain
`freest` blocks and have not been normalised; match the surrounding style when
editing those, or normalise the whole file.

`libraries/` snippets are still required to pass `freest -t`, same as
`tutorial/` — only the indentation normalisation is pending there, not
correctness checking.
