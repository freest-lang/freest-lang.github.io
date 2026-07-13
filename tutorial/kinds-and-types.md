---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Types and their types
layout: default
nav_order: 8
parent: Tutorial
---

# Types and their types
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

## Kinds

There are different kinds of types. **Proper kinds** classify types against two orthogonal axes:
* **Base kind** and
* **Multiplicity**.

The base kind distinguishes the nature of the type. Is it a type that can be used to create a channel? Perhaps a session type? Or is it a general type? There are thee base kinds:
* **Channel**, `C`, for types whose values that can be used to create new channels,
* **Session**, `S` for all session types, including channel types, and
* **Top**, `T`, for an arbitrary type, including session types.

Channels should be closed whenever possible. This gives the runtime opportunity to reclaim memory, for example. Intuitively, a session type is a channel if it may reach a `Close` or `Wait` in all its finite branches. So `Stream a` is channel type:
```freest
type Stream a = +{Done: Close, More: ?a ; Stream a}
```
and so is `IntsForever`:
```freest
type IntsForever = !Int ; IntsForever
```
In contrast `TreeC a` is not a type: it contains a finite branch that does terminate in `Close` or `Wait`, namely `+Leaf, Skip`.
```freest
type TreeC a = +{Leaf: Skip, Node: TreeC a ; !a ; TreeC a}
```

The `channel` operator takes a channel type. Expression `channel @Type` requires `Type` to be of base kind `C`. It returns a channel, that is a pair of endpoints `(Type, Dual Type)`.

Multiplicities control the number of times values can be used. This views values as resources that may or may not be duplicated or discarded according to its multilicity. There are currently two multiplicities:

* **Unrestricted**, `*` for types whose values may be used an arbitrary number of times, that is, zero or more, and
* **Linear**, `1` for types whose values that must be used exactly once.

A proper kind is then a baseKind-multiplicity pair, and there are six of them. A function that declares accepting a value of prekind `T` is in fact declaring that it may accept any prekind: `T`, `S`, or `C`. Similarly, a function that declares accepting a value of multiplicity `1` may accept `*` values as well, for "zero or more uses" includes "one use". We thus see that prekinds come with an hierarchy: `C <: S <: T`, and do does multiplicities: `* <: 1`. The combination of the two hierarquies can be grafically depicted as follows.
```
    1T
   /  \
  *T   1S
   \  /  \ 
    *S   1C
      \  /
       *C
```

Apart from proper kinds, FreeST comes also equipped with **higher-order kinds**, also known as type families. One example is the `TreeC` type above. Kind declarations are often inferred by the compiler, but programmers may provide their own annotations if they so wish, as in:
```freest
type TreeC : 1T -> 1S
type TreeC a = +{Leaf: Skip, Node: TreeC a ; !a ; TreeC a}
```
So type `TreeC` is not a proper type, it is a function that expects a type of kind `1T`. But because `1T` stands at the top of the proper type hierarchy, it can be provided with any type. Valid instantiations include `TreeC (Int -1-> Bool)` (with `Int -1-> Bool : 1T`) and `TreeC *!Char` (with `*!Char : *C`).

Proper kinds came equipped with a subkind relation (diagram above) and so do higher order kinds. This is the standard contra-variant/covariant rule for subtyping function types.