---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Types and their kinds
layout: default
nav_order: 10
parent: Tutorial
---

# Types and their kinds
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
* **Channel**, `C`{: .language-freest }, for types whose values can be used to create new channels,
* **Session**, `S`{: .language-freest }, for all session types, including channel types, and
* **Top**, `T`{: .language-freest }, for an arbitrary type, including session types.

Channels should be closed whenever possible. This gives the runtime the opportunity to reclaim memory, for example. Intuitively, a session type is a channel if every one of its finite branches ends in a `Close`{: .language-freest } or `Wait`{: .language-freest }. So `Stream a`{: .language-freest } is a channel type:
```freest
type Stream a = +{Done: Close, More: !a ; Stream a}
```
and so is `IntsForever`{: .language-freest }:
```freest
type IntsForever = !Int ; IntsForever
```
In contrast `TreeC a`{: .language-freest } is not a channel type: it contains a finite branch that does not terminate in `Close`{: .language-freest } or `Wait`{: .language-freest }, namely the `Leaf: Skip`{: .language-freest } branch.
```freest
type TreeC a = +{Leaf: Skip, Node: TreeC a ; !a ; TreeC a}
```

The `channel`{: .language-freest } operator takes a channel type. Expression `channel @Type`{: .language-freest } requires `Type`{: .language-freest } to be of base kind `C`{: .language-freest }. It returns a channel, that is a pair of endpoints `(Type, Dual Type)`{: .language-freest }.

Multiplicities control the number of times values can be used. This treats values as resources that may or may not be duplicated or discarded according to their multiplicity. There are currently two multiplicities:

* **Unrestricted**, `*`{: .language-freest }, for types whose values may be used an arbitrary number of times, that is, zero or more, and
* **Linear**, `1`{: .language-freest }, for types whose values must be used exactly once.

A proper kind is then a baseKind-multiplicity pair, and there are six of them: `1T`{: .language-freest }, `*T`{: .language-freest }, `1S`{: .language-freest }, `*S`{: .language-freest }, `1C`{: .language-freest } and `*C`{: .language-freest }.


## Higher-order kinds

Apart from proper kinds, FreeST also comes equipped with **higher-order kinds**, also known as type families. One example is the `TreeC`{: .language-freest } type above. Kind declarations are often inferred by the compiler, but programmers may provide their own annotations if they so wish, as in:
```freest
type TreeC : 1T -> 1S
type TreeC a = +{Leaf: Skip, Node: TreeC a ; !a ; TreeC a}
```
So type `TreeC`{: .language-freest } is not a proper type, it is a function that expects a type of kind `1T`{: .language-freest }. But because `1T`{: .language-freest } stands at the top of the kind hierarchy, it can be provided with any type. Valid instantiations include `TreeC (Int -1-> Bool)`{: .language-freest } (with `Int -1-> Bool : 1T`{: .language-freest }) and `TreeC *!Char`{: .language-freest } (with `*!Char : *C`{: .language-freest }).


## Subkinding

 A function that declares accepting a value of base kind `T`{: .language-freest } is in fact declaring that it may accept any base kind: `T`{: .language-freest }, `S`{: .language-freest }, or `C`{: .language-freest }. Similarly, a function that declares accepting a value of multiplicity `1`{: .language-freest } may accept `*`{: .language-freest } values as well, for "zero or more uses" includes "one use". We thus see that base kinds come with a hierarchy: `C <: S <: T`{: .language-freest }, and so do multiplicities: `* <: 1`{: .language-freest }. The combination of the two hierarchies can be graphically depicted as follows.
```
    1T
   /  \
  *T   1S
   \  /  \ 
    *S   1C
      \  /
       *C
```

Proper kinds come equipped with a subkind relation (diagram above) and so do higher-order kinds. For a function kind, subkinding follows the standard contravariant/covariant rule for subtyping function types:

<table style="margin: 1.5em auto; border-collapse: collapse; font-family: overpass-mono, monospace;">
  <tr><td style="text-align: center; padding: 0 0.5em 0.3em;">k1' &lt;: k1&nbsp;&nbsp;&nbsp;&nbsp;k2 &lt;: k2'</td></tr>
  <tr><td style="border-top: 1px solid currentColor; padding: 0;"></td></tr>
  <tr><td style="text-align: center; padding: 0.3em 0.5em 0;">k1 -&gt; k2 &lt;: k1' -&gt; k2'</td></tr>
</table>

That is, subkinding is *contravariant* in the domain and *covariant* in the codomain. For example, `1T -> *S <: *T -> 1S`{: .language-freest }, since `*T <: 1T`{: .language-freest } in the domain and `*S <: 1S`{: .language-freest } in the codomain.


## Types

FreeST comes equipped with a rich collection of types. Conventional functional types:
* `Int`{: .language-freest }, `Float`{: .language-freest }, `Char`{: .language-freest }, `Bool`{: .language-freest }, all of kind `*T`{: .language-freest },
* Arrow types, `(-m->)`{: .language-freest }, of kind `1T -> 1T -> mT`{: .language-freest }, where `m`{: .language-freest } is a multiplicity (`*`{: .language-freest }, `1`{: .language-freest } or a variable); `(-*->)`{: .language-freest } can be abbreviated to `(->)`{: .language-freest },
* Tuple types, `(U1, ..., Un)`{: .language-freest }; the base kind of such a type is `T`{: .language-freest } and its multiplicity is the least upper bound of the multiplicities of `U1`{: .language-freest } to `Un`{: .language-freest }, which must be proper types. For example, `(Int, Int) : *T`{: .language-freest } and `(!Int, Int) : 1T`{: .language-freest }.

Session and channel types include:
* `Close`{: .language-freest } and `Wait`{: .language-freest } of kind `1C`{: .language-freest },
* `(!)`{: .language-freest } and `(?)`{: .language-freest } of kind `1T -> 1S`{: .language-freest },
* `+{l1:U1,...,ln:Un}`{: .language-freest } and `&{l1:U1,...,ln:Un}`{: .language-freest } of multiplicity `1`{: .language-freest } and taking same base kind as the least upper bound of the kinds of `U1`{: .language-freest } to `Un`{: .language-freest }, provided these are all session types. For example, `+{A: Skip, B: Close} : 1S`{: .language-freest }
* `!type a. U`{: .language-freest } and `?type a. U`{: .language-freest }, where type variable `a`{: .language-freest } may occur free in `U`{: .language-freest }, have multiplicity `1`{: .language-freest } and the base kind of `U`{: .language-freest },
* `U ; V`{: .language-freest } taking the kind of `U`{: .language-freest } if it has base kind `C`{: .language-freest } (absorbs the continuation, for example `Close; !Int : 1S`{: .language-freest }), otherwise taking the least upper bound of the kinds of types `U`{: .language-freest } and `V`{: .language-freest }, provided both are session types,
* `Skip`{: .language-freest } of kind `*S`{: .language-freest },
* `Dual U`{: .language-freest }, taking the kind of type `U`{: .language-freest }, provided it is a session type.

Type `Skip`{: .language-freest } is uninhabited: there is no value, no channel endpoint, of type `Skip`{: .language-freest }. It turns out however to be quite handy when working with non-tail-recursive types.

Datatype names and type names:
* `X`{: .language-freest } in `data X = ...`{: .language-freest }, taking the least upper bound of the kinds of the datatype constructors in `...`{: .language-freest },
* `X`{: .language-freest } in `type X = U`{: .language-freest }, taking the kind of `U`{: .language-freest } (with some care if `X`{: .language-freest } is recursive).

Universal and existential types:
* Type `forall a -m-> U`{: .language-freest }, where `m`{: .language-freest } is a multiplicity (`*`{: .language-freest }, `1`{: .language-freest } or a variable) and `a`{: .language-freest } may occur free in `U`{: .language-freest }, takes the kind `m T`{: .language-freest }.
* Type `(exists a, U)`{: .language-freest }, where `a`{: .language-freest } may occur free in `U`{: .language-freest }, takes the base kind `T`{: .language-freest } and the multiplicity of type `U`{: .language-freest }.

For example, the counter abstract data type may take the type `(exists a, (a, a -> Int, a -> a))`{: .language-freest }, where `a`{: .language-freest } represents the type of the internal representation of the counter, `a -> Int`{: .language-freest } represents *get* operation, and `a -> a`{: .language-freest } the *inc* operation on the counter.

Higher-order types:
* Type variables `a`{: .language-freest }, taking the kind provided or inferred at its introduction point,
* Type application `U V`{: .language-freest } taking the kind `k2`{: .language-freest } if `U : k1 -> k2`{: .language-freest } and `V : k1`{: .language-freest },
* Type abstraction `\(a : k1) -> U`{: .language-freest } of kind `k1 -> k2`{: .language-freest } where `k2`{: .language-freest } is the kind of `U`{: .language-freest }.

Most of the times programmers write type abstractions together with datatype or type declarations. For example:
```freest
type App : (1T -> *T) -> 1T -> *T
type App f a = f a
```
Here `App`{: .language-freest } is in fact a type abstraction within a type abstraction (and the signature is optional).

But FreeST also provides for explicit type abstractions as in:
```freest
type App' : (1T -> *T) -> 1T -> *T
type App' = \(a : 1T -> *T) -> \(b : 1T) -> a b 
```
Here the kind signature is required.

There is one final type, `Void`{: .language-freest }. In fact there is a family of `Void`{: .language-freest } types, one for each different kind.
* `Void @k`{: .language-freest } is of kind `k`{: .language-freest }.

`Void`{: .language-freest } (of any kind) is uninhabited. It can be used for *divergent* functions, as for example, a server that forever reads integer values from a shared channel and echoes them:
```freest
echo : *?Int -> Void @*T
echo c = print (receive_ c) ; echo c
```
In this case, the choice of the kind of `Void`{: .language-freest } is arbitrary, for `echo`{: .language-freest } will never return. In fact any type would do for the return type. `Void`{: .language-freest } signals that `echo`{: .language-freest } will never return, better than, say, `()`{: .language-freest }, which may leave the programmer expecting a result from the function.

There is another use of `Void`{: .language-freest } types, which also illustrates why we need a family of void types, and
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
Should this type be considered valid? If one applies `Forever`{: .language-freest } to `Skip`{: .language-freest }, that is `Forever Skip`{: .language-freest }, we get a type equivalent to `Skip ; Forever Skip`{: .language-freest } which, by the monoidal rules, is equivalent to `Forever Skip`{: .language-freest }. We are back to square one without ever producing an observable action. In this case, `Forever Skip`{: .language-freest } is not much different from type `X`{: .language-freest } above.

Rather than trying to decree such types as invalid, a not-so-easy endeavour, we welcome them all and declare all equal to `Void @k`{: .language-freest } for an appropriate kind `k`{: .language-freest }. So, for example, we have `Forever ≡ Void @(1S -> 1S)`{: .language-freest }.

## Multiplicity polymorphism

We have used function `forkWith`{: .language-freest } quite often, but we have not been very explicit about its type. We know that it is a polymorphic function, that it accepts a channel endpoint type (a type of base kind `C`{: .language-freest }, call it `T`{: .language-freest }), and a function from `Dual T`{: .language-freest } to some unrestricted type `U`{: .language-freest } (whatever it returns is simply discarded), and that it returns a value of type `T`{: .language-freest }.
So, one possible type for `forkWith`{: .language-freest } is
```freest
forall (a : 1C) (b : *T) -*-> (Dual a -1-> b) -*-> a
```
where we have chosen a linear function for the `Dual a`{: .language-freest } to `b`{: .language-freest } function. That makes a lot of sense. Such a type signals the client that the function is going to be used exactly once, that the runtime system will not fork two threads, each running the given function.

If the linear arrow gives the client extra assurance, it also hinders code reusability. Suppose the client is endowed with an unrestricted function, a function of type `Dual a -*-> b`{: .language-freest }, that they would like to use to fork a thread, trusting the runtime that the function would nevertheless be used once only. There is really no workaround, except perhaps rewriting the code.

So we could set up two signatures for the *same* underlying function.
```freest
forkWith  : forall (a : 1C) (b : *T) -*-> (Dual a -*-> b) -*-> a
forkWith' : forall (a : 1C) (b : *T) -*-> (Dual a -1-> b) -*-> a
```

But `forkWith`{: .language-freest }, we have seen, calls `fork`{: .language-freest } and passes the incoming function as is to `fork`{: .language-freest }. We would need two different fork functions:
```freest
fork  : forall (a : *T) -*-> (() -*-> a) -*-> ()
fork' : forall (a : *T) -*-> (() -1-> a) -*-> ()
```

This story ends here because `fork`{: .language-freest } is primitive, but one can think of scenarios where this problem would cascade through many more functions.

The code of the two versions of `forkWith`{: .language-freest } is exactly the same, only the signatures vary. The same happens with `fork`{: .language-freest }. This calls for **multiplicity polymorphism**. There is only one version of each function. Their type signatures are as follows:
```freest
forkWith : forall #m -*-> forall (a : 1C) (b : *T) -*-> (Dual a -m-> b) -*-> a
fork : forall #m -*-> forall (a : *T) -*-> (() -m-> a) -*-> ()
```

This freedom to discard follows directly from FreeST's linearity discipline: unrestricted values (kind `*T`{: .language-freest }) may be dropped silently, while linear values (kind `1T`{: .language-freest }) must be consumed exactly once. The Prelude leans on this wherever a result is produced but of no interest to the caller. `fork`{: .language-freest }, `parallel`{: .language-freest } and `times`{: .language-freest } each take a thunk returning some `a : *T`{: .language-freest } and discard it once the thunk has run; `forkWith`{: .language-freest } does the same with its handler's result `b : *T`{: .language-freest }. Because that result is only ever thrown away, it can stay fully polymorphic — the thunk may return anything unrestricted, and the caller need not care which.
<!-- `runServer`{: .language-freest }'s `Void @*T`{: .language-freest } return type draws on the same slack for the opposite reason: since the function never returns, no value of that type is ever produced either — nothing to commit to, rather than something to ignore. -->

Type `forall #m -> T`{: .language-freest } introduces multiplicity polymorphism. The variable name, `m`{: .language-freest } in this case, must be preceded by a sharp symbol, `#`{: .language-freest }, so that it can be distinguished from a type variable. In the body we use `-m->`{: .language-freest }, not `-#m->`{: .language-freest }. The syntax is otherwise similar to type polymorphism.

For a further example, consider function composition `f . g`{: .language-freest }, `f`{: .language-freest } after `g`{: .language-freest }. In a programming language without multiplicities in arrows we would expect:
```freest
(.) : forall a b c -> (b -> c) -> (a -> b) -> a -> c
```
Remember that `->`{: .language-freest } abbreviates `-*->`{: .language-freest }, so that this type signature is highly restrictive: it applies to two unrestricted functions. What if one or more of the functions are linear? Can we write a type for `(.)`{: .language-freest } as we did for `forkWith`{: .language-freest } and `fork`{: .language-freest }?

The problem here is that `(.)`{: .language-freest } accepts *two* functions and that the kind of `f . g`{: .language-freest } depends on the kinds of *both* `f`{: .language-freest } and `g`{: .language-freest }. If both are `*`{: .language-freest }, then `(.)`{: .language-freest } is `*`{: .language-freest }. If both are `1`{: .language-freest }, then `(.)`{: .language-freest } is `1`{: .language-freest }. More generally, if at least one of `f`{: .language-freest } or `g`{: .language-freest } is `1`{: .language-freest }, then `(.)`{: .language-freest } is `1`{: .language-freest }. Remembering that `*`{: .language-freest } is a submultiplicity of `1`{: .language-freest }, written `* <: 1`{: .language-freest }, we are looking for the *least upper bound* of the two multiplicities. The least upper bound of multiplicities `m`{: .language-freest } and `n`{: .language-freest } is written `m+n`{: .language-freest }. We are now in a position to write the type of `(.)`{: .language-freest }, or better, we can ask `freest -i`:

```bash
$ freest -i
The FreeST Compiler, version 5.0, https://freest-lang.github.io/, :h for help
Ok, no modules loaded.
freest> :t (.)
(.) : forall #m #n -*-> forall (a : 1T) (b : 1T) (c : 1T) -*-> (b -m-> c) -*-> (a -n-> b) -m-> a -m+n-> c
```