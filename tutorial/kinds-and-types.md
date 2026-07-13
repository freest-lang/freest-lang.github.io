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

The base kind distinguishes the nature of the type. Is it a type that can be used to create a channel? Perhaps a session type? Or is it a general type? There are three base kinds:
* **Channel**, `C`, for types whose values can be used to create new channels,
* **Session**, `S`, for all session types, including channel types, and
* **Top**, `T`, for an arbitrary type, including session types.

Channels should be closed whenever possible. This gives the runtime the opportunity to reclaim memory, for example. Intuitively, a session type is a channel if every one of its finite branches ends in a `Close` or `Wait`. So `Stream a` is a channel type:
```freest
type Stream a = +{Done: Close, More: !a ; Stream a}
```
and so is `IntsForever`:
```freest
type IntsForever = !Int ; IntsForever
```
In contrast `TreeC a` is not a channel type: it contains a finite branch that does not terminate in `Close` or `Wait`, namely the `Leaf: Skip` branch.
```freest
type TreeC a = +{Leaf: Skip, Node: TreeC a ; !a ; TreeC a}
```

The `channel` operator takes a channel type. Expression `channel @Type` requires `Type` to be of base kind `C`. It returns a channel, that is a pair of endpoints `(Type, Dual Type)`.

Multiplicities control the number of times values can be used. This treats values as resources that may or may not be duplicated or discarded according to their multiplicity. There are currently two multiplicities:

* **Unrestricted**, `*`, for types whose values may be used an arbitrary number of times, that is, zero or more, and
* **Linear**, `1`, for types whose values must be used exactly once.

A proper kind is then a baseKind-multiplicity pair, and there are six of them: `1T`, `*T`, `1S`, `*S`, `1C` and `*C`.


## Higher-order kinds

Apart from proper kinds, FreeST also comes equipped with **higher-order kinds**, also known as type families. One example is the `TreeC` type above. Kind declarations are often inferred by the compiler, but programmers may provide their own annotations if they so wish, as in:
```freest
type TreeC : 1T -> 1S
type TreeC a = +{Leaf: Skip, Node: TreeC a ; !a ; TreeC a}
```
So type `TreeC` is not a proper type, it is a function that expects a type of kind `1T`. But because `1T` stands at the top of the kind hierarchy, it can be provided with any type. Valid instantiations include `TreeC (Int -1-> Bool)` (with `Int -1-> Bool : 1T`) and `TreeC *!Char` (with `*!Char : *C`).


## Subkinding

 A function that declares accepting a value of base kind `T` is in fact declaring that it may accept any base kind: `T`, `S`, or `C`. Similarly, a function that declares accepting a value of multiplicity `1` may accept `*` values as well, for "zero or more uses" includes "one use". We thus see that base kinds come with a hierarchy: `C <: S <: T`, and so do multiplicities: `* <: 1`. The combination of the two hierarchies can be graphically depicted as follows.
```
    1T
   /  \
  *T   1S
   \  /  \ 
    *S   1C
      \  /
       *C
```

Proper kinds come equipped with a subkind relation (diagram above) and so do higher-order kinds. This is the standard contravariant/covariant rule for subtyping function types.


## Types

FreeST comes equipped with a rich collection of types. Conventional functional types:
* `Int`, `Float`, `Char`, `Bool`, all of kind `*T`,
* Arrow types, `-1->` and `-*->`; the latter can be abbreviated to `->`,
* Tuple types, `(U1, ..., Un)`; the kind of such a type is the least upper bound of the kinds of types `U1` to `Un`. For example, `(!Int, Int) : 1T`. Types `U1` to `Un` must be proper types.

Session and channel types include:
* `Close` and `Wait` of kind `1C`,
* `(!)` and `(?)` of kind `1T -> 1S`,
* `+{l1:U1,...,ln:Un}`, taking the least upper bound of the kinds of types `U1` to `Un`, provided these are all session types,
* `!type a . U` and `?type a . U`, where type variable `a` may occur free in `U`, takes the kind of `U`,
* `U ; V` taking the least upper bound of the kinds of types `U` and `V`, provided both are session types,
* `Skip` of kind `1S`,
* `Dual U`, taking the kind of type `U`, provided it is a session type.

Type `Skip` is uninhabited: there is no value, no channel endpoint, of type `Skip`. It turns out however to be quite handy when working with non-tail-recursive types.

Datatype names and type names:
* `X` in `data X = ...`, taking the least upper bound of the kinds of the datatype constructors in `...`,
* `X` in `type X = U`, taking the kind of `U` (with some care if `X` is recursive).

Universal and existential types:
* Type `forall a -> U`, where `a` may occur free in `U`, takes the kind `1T` or `*T` depending on the multiplicity of type `U`.
* Type `(exists a, U)`, where `a` may occur free in `U`, takes the kind `1T` or `*T` depending on the multiplicity of type `U`.

For example, the counter abstract data type may take the type `(exists a, (a, a -> Int, a -> a))`, where `a` represents the type of the internal representation of the counter, `a -> Int` represents *get* operation, and `a -> a` the *inc* operation on the counter.

Higher-order types:
* Type variables `a`, taking the kind provided or inferred at its introduction point,
* Type application `U V` taking the kind `k2` if `U : k1 -> k2` and `V : k1`,
* Type abstraction `\(a:k1) -> U` of kind `k1 -> k2` where `k2` is the kind of `U`.

Most of the times programmers write type abstractions together with datatype or type declarations. For example:
```freest
type App : (1T -> *T) -> 1T -> *T
type App f a = f a
```
Here `App` is in fact a type abstraction within a type abstraction (and the signature is optional).

But FreeST also provides for explicit type abstractions as in:
```freest
type App' : (1T -> *T) -> 1T -> *T
type App' = \(a : 1T -> *T) -> \(b : 1T) -> a b 
```
Here the kind signature is required.

There is one final type, `Void`. In fact there is a family of `Void` types, one for each different kind.
* `Void @k` is of kind `k`.

`Void` (of any kind) is uninhabited. It can be used for *divergent* functions, as for example, a server that forever reads integer values from a shared channel and echoes them:
```freest
echo : *?Int -> Void @*T
echo c = print (receive_ c) ; echo c
```
In this case, the choice of the kind of `Void` is arbitrary, for `echo` will never return. In fact any type would do for the return type. `Void` signals that `echo` will never return, better than, say, `()`, which may leave the programmer expecting a result from the function.

There is another use of `Void` types, which also illustrates why we need a family of void types, and
is connected to recursive types. In most programming languages all the declarations below are deemed invalid.
```freest
type X = X
```
```freest
type A = B
type B = C
type C = A
```
The situation gets a lot more complex when context-free session types come into play:
```freest
type Forever : 1S -> 1S
type Forever a = a ; Forever a
```
Should this type be considered valid? If one applies `Forever` to `Skip`, that is `Forever Skip`, we get a type equivalent to `Skip ; Forever Skip` which, by the monoidal rules, is equivalent to `Forever Skip`. We are back to square one without ever producing an observable action. In this case, `Forever Skip` is not much different from type `X` above.

Rather than trying to decree such types as invalid, a not-so-easy endeavour, we welcome them all and declare all equal to `Void @k` for an appropriate kind `k`. So, for example, we have `Forever ≡ Void @(1S -> 1S)`.

## Multiplicity polymorphism

We have used function `forkWith` quite often, but we have not been very explicit about its type. We know that it is a polymorphic function, that it accepts a channel endpoint type (a type of base kind `C`, call it `T`) and a function from `Dual T` to `()`, and that it returns a value of type `T`.
So, one possible type for `forkWith` is
```freest
forall (a : 1C) -*-> (Dual a -1-> ()) -*-> a
```
where we have chosen a linear function for the `Dual a` to `()` function. That makes a lot of sense. Such a type signals the client that the function is going to be used exactly once, that the runtime system will not fork two threads, each running the given function.

If the linear arrow gives the client extra assurance, it also hinders code reusability. Suppose the client is endowed with an unrestricted function, a function of type `Dual a -*-> ()`, that they would like to use to fork a thread, trusting the runtime that the function would nevertheless be used once only. There is really no workaround, except perhaps rewriting the code.

So we could set up two signatures for the *same* underlying function.
```freest
forkWith  : forall (a : 1C) -*-> (Dual a -*-> ()) -*-> a
forkWith' : forall (a : 1C) -*-> (Dual a -1-> ()) -*-> a
```

But `forkWith`, we have seen, calls `fork` and passes the incoming function as is to `fork`. We would need two different fork functions:
```freest
fork  : forall (a : *T) -*-> (() -*-> a) -*-> ()
fork' : forall (a : *T) -*-> (() -1-> a) -*-> ()
```

This story ends here because `fork` is primitive, but one can think of scenarios where this problem would cascade through many more functions.

The code of the two versions of `forkWith` is exactly the same, only the signatures vary. The same happens with `fork`. This calls for **multiplicity polymorphism**. There is only one version of each function. Their type signatures are as follows:
```freest
forkWith : forall #m -*-> forall (a : 1C) -*-> (Dual a -m-> ()) -*-> a
fork : forall #m -*-> forall (a : *T) -*-> (() -m-> a) -*-> ()
```

Type `forall #m -*-> T` introduces multiplicity polymorphism. The variable name, `m` in this case, must be preceded by a sharp symbol, `#`, so that it can be distinguished from a type variable. In the body we use `-m->`, not `-#m->`. The syntax is otherwise similar to type polymorphism.

For a further example, consider function composition `f . g`, `f` after `g`. In a programming language without multiplicities in arrows we would expect:
```freest
(.) : forall a b c -> (b -> c) -> (a -> b) -> a -> c
```
Remember that `->` abbreviates `-*->`, so that this type signature is highly restrictive: it applies to two unrestricted functions. What if one or more of the functions are linear? Can we write a type for `(.)` as we did for `forkWith` and `fork`?

The problem here is that `(.)` accepts *two* functions and that the kind of `f . g` depends on the kinds of *both* `f` and `g`. If both are `*`, then `(.)` is `*`. If both are `1`, then `(.)` is `1`. More generally, if at least one of `f` or `g` is `1`, then `(.)` is `1`. Remembering that `*` is a submultiplicity of `1`, written `* <: 1`, we are looking for the *least upper bound* of the two multiplicities. The least upper bound of multiplicities `m` and `n` is written `m+n`. We are now in a position to write the type of `(.)`, or better, we can ask `freest -i`:

```bash
$ freest -i
The FreeST Compiler, version 5.0, https://freest-lang.github.io/, :h for help
Ok, no modules loaded.
freest> :t (.)
(.) : forall #m #n -*-> forall (a : 1T) (b : 1T) (c : 1T) -*-> (b -m-> c) -*-> (a -n-> b) -m-> a -m+n-> c
```