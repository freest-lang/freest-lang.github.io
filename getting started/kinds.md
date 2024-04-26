---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Kinds
layout: default
nav_order: 8
parent: Getting started
---

# Kinds
{: .no_toc }

<!-- TODO -->
<!-- some intro text here -->

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .no_toc .text-delta }
- TOC
{:toc}
</details>

## Why does FreeST require kinds?

FreeST relies on kinds to classify types, ensuring their proper formation. Kinds
are necessary due to the correlation between polymorphism and context-free
session types. For instance, while `!Int;?Bool` is unquestionably a session
type, the same cannot be affirmed for the type `!Int;a` as it only qualifies as
a session type when `a` is also a session type; otherwise, it is considered
invalid.

## Kinds and Kind Inference

From version 3.2 onwards, FreeST offers a kind inference mechanism that
discovers the correct and most general (or less restrictive) kind for
polymorphic and recursive type variables. For example, types `T`, `D` and for
function `f`:

```
f : forall a . !Int ; a -> a
type T = !Int ; T 
data D = E Int | F 
```
would be inferred as follows:
```
f : forall a : 1S . !Int ; a -> a
type T : 1S = !Int ; T 
data D : 1T = C1 Int | C2 
```

Furthermore, the type for `f` may be simplified to `f : !Int ; a -> a` (the
prenex occurrences of forall may be omitted). However, even if we do not need to
write kinds, since they may appear on error messages, having a reference for
them is essential.

The kinding system consists of three prekinds, each with its multiplicity. The
first prekind, `S`, is employed for session types. The second prekind, `A`, is
used for identifying two particular cases of session types - those that describe
infinite (unnormed) protocols and those that represent channels that can be
closed. The third prekind, `T`, characterises functional types. Multiplicities
determine the number of times a value may be used - either `1` for **once** or `*`
for **zero or more times**. Each prekind is paired with a multiplicity to form a
kind, with possible kinds being `1T`, `*T`, `1S`, `*S`, `1A`, and `*A`.

Given that a value of an unrestricted type may be used zero or more times, and
one with a linear type must be used exactly once, it should be evident that an
unrestricted value can used where a linear one is expected. Therefore, we have
the following hierarchy of kinds:

```
    1T
   /  \
  *T   1S
   \  /  \ 
    *S   1A
      \  /
       *T
```
