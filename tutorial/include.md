---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Including as in the 70's
layout: default
nav_order: 9
parent: Tutorial
---

# Including as in the 70's
{: .no_toc }

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .no_toc .text-delta }
- TOC
{:toc}
</details>

## Splitting a program across files

Once a program grows beyond a handful of definitions, you will want to spread
it over several files. FreeST offers no module system, no namespaces, and no
selective imports or exports. Instead it borrows the mechanism that C settled on
back in the 1970s: **textual inclusion**. You name a file, and the compiler
splices that file's source into yours before doing anything else. That is all
there is to it — the same idea as C's `#include`.

To pull the contents of `Helper.fst` into your program, write an `INCLUDE`
pragma at the top of the file:

```freest
{-# INCLUDE "Helper.fst" #-}
```

## It is a preprocessor, not part of the grammar

Two consequences follow. First, every definition brought in by an include lands
in the same flat, global namespace as everything else: there is no `Helper.`
prefix, no qualified names, and no way to hide a definition from the files that
include you. Second, the pragma must be written on a line of its own and spelled
exactly, opening quote and all.

## Where files are looked up

A relative path is resolved **against the directory of the file doing the
including**, just like C's quoted `#include "..."` form. So if
`src/Main.fst` contains

```freest
{-# INCLUDE "lib/Helper.fst" #-}
```

the compiler looks for `src/lib/Helper.fst`. Absolute paths are taken as-is.

## Diamonds and cycles come for free

Naïve textual inclusion has two classic hazards, and 1970s C programmers guarded
against both by hand with `#ifndef` include guards. FreeST takes care of them for
you.

The first is the **diamond**: `Main` includes both `A` and `B`, and `A` and `B`
each include `Base`.

```freest
-- Main.fst
{-# INCLUDE "A.fst" #-}
{-# INCLUDE "B.fst" #-}
```

`Base` is pulled in only **once**, no matter how many paths reach it — you never
get duplicate definitions, and you never need a guard. FreeST also orders the
result so that every included file appears before the file that includes it, so
definitions are always in scope where they are used.

The second hazard is a **cycle**. If a file includes itself, directly or through
a chain of other files, FreeST reports an error instead of looping forever:

```freest
-- Cyc.fst
{-# INCLUDE "Cyc.fst" #-}
```

```bash
Cyc.fst:1:1–1:26: error:
Include cycle: Cyc.fst -> Cyc.fst
```

## When things go wrong

A missing file is reported against the offending pragma:

```bash
Main.fst:1:1–1:35: error:
Cannot find included file "DoesNotExist.fst"
```

And a pragma whose path is not quoted is rejected as malformed:

```bash
Main.fst:1:1–1:27: error:
Malformed INCLUDE pragma, expected {-# INCLUDE "path" #-}
```

## The Prelude is just another include

The standard library `Prelude.fst` is included implicitly into every program, so
functions such as `print` are always available without any pragma of your own.
It is merged exactly like any file you include yourself — once, ahead of your
code. If you want to work without it, pass `--no-implicit-prelude` on the command
line.
