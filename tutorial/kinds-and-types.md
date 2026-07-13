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

## Proper kinds

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

A proper kind is then a baseKind-multiplicity pair, and there are six of them: `1T`, `*T`, `1S`, `*S`, `1C` and `*C`.


## Higher-order kinds

Apart from proper kinds, FreeST comes also equipped with **higher-order kinds**, also known as type families. One example is the `TreeC` type above. Kind declarations are often inferred by the compiler, but programmers may provide their own annotations if they so wish, as in:
```freest
type TreeC : 1T -> 1S
type TreeC a = +{Leaf: Skip, Node: TreeC a ; !a ; TreeC a}
```
So type `TreeC` is not a proper type, it is a function that expects a type of kind `1T`. But because `1T` stands at the top of the proper type hierarchy, it can be provided with any type. Valid instantiations include `TreeC (Int -1-> Bool)` (with `Int -1-> Bool : 1T`) and `TreeC *!Char` (with `*!Char : *C`).


## Subkinding

 A function that declares accepting a value of prekind `T` is in fact declaring that it may accept any prekind: `T`, `S`, or `C`. Similarly, a function that declares accepting a value of multiplicity `1` may accept `*` values as well, for "zero or more uses" includes "one use". We thus see that prekinds come with an hierarchy: `C <: S <: T`, and do does multiplicities: `* <: 1`. The combination of the two hierarquies can be grafically depicted as follows.
```
    1T
   /  \
  *T   1S
   \  /  \ 
    *S   1C
      \  /
       *C
```

Proper kinds came equipped with a subkind relation (diagram above) and so do higher order kinds. This is the standard contra-variant/covariant rule for subtyping function types.


## Types

FreeST come equipped with a rich collection of types. Conventional functional types:
* `Int`, `Float`, `Char`, `Bool`, all of kind `*T`,
* Arrow types, `-1->` and `-*->`; the latter can be abbreviated to `->`,
* Tuple types, `(T1, ..., Tn)`; the kind of such a type is the least upper bound of the kinds of types `T1` to `Tn`. For example, `(!Int, Int) : 1T`. Types `T1` to `Tn` must be proper types.

Session and channel types include:
* `Close` and `Wait` of kind `1C`,
* `Skip` of kind `1S`,
* `(!)` and `(?)` of kind `1T -> 1S`,
* `+{l1:T1,...,ln:Tn}`, taking the upper bound of the kinds of types `T1` to `Tn`, provided these are all session types,
* `T ; U` taking the upper bound of the kinds of types `T` and `U`, provided both are session types,
* `Dual T`, taking the kind of type `T`, provided it is a session type.

Datatype names and type names:
* `X` in `data X = ...`, taking the least upper bound of the kinds of the datatype constructors in `...`,
* `X` in `type X = T`, taking the type of `T` (with some care if `X` is recursive).

Higher order types:
* Type variables `a`, taking the kind provided or inferred at its introduction point,
* Type application `T U` taking the kind `k2` if `T : k1 -> k2` and `U : k1`,
* Type abstraction `\(a:k1) -> T` of kind `k1 -> k2` where `k2` is the kind of `T`.

Most of the times programmers write type abstractions together with datatype or type declarations. For example:
```freest
type App : (1T -> *T) -> 1T -> *T
type App f a = f a
```
Here `App` is in fact a type abstraction within a type abstraction (and the signature is optional).

But FreeST also provideds for explicit type abstractions as in:
```freest
type App' : (1T -> *T) -> 1T -> *T
type App' = \(a : 1T -> *T) -> \(b : 1T) -> a b 
```
Here the kind signature is required.

There is one final type, `Void`. In fact there is a family of `Void` types, one for each different kind.
* `Void @T` takes the kind of `T`.

`Void` (of any kind) is not inhabited. It can be used for *divergent* functions, as for example, a server that forever reads integer values from a shared channel and echoes them:
```freest
echo : *?Int -> Void @*T
echo c = print (receive_ c) ; echo c
```
In this case, the choice of the kind of `Void` is arbitrary for `echo` will never return. In fact any type would do for the return type. `Void` signals that `echo` will never return, better than, say `()`.

There is another use of `Void` types, which also illustrates why we need a family of void types, and
is conneted to recursive types. In most programming languages all the  below declarations are deemed invalid.
```freest
type X = X
type A = B
type B = C
type C = A
```
The situation gets a lot more complex when context-free session types come into play:
```
type Forever a = a ; Forever a
```