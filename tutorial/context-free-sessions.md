---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Context-free sessions
layout: default
nav_order: 8
parent: Tutorial
---

# By the power of context-free sessions!

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

Let us start with a simple exercise, that of sending and receiving a list on a channel. We could send the whole list in one go and that would be it. But we are interested in really large data that needs to be streamed piecewise.

Let us the set up a type to convey (a finite or infinite) number of values of a given type `a` on a channel. The type takes the view of the writer process.
```freest
type Stream a = +{Done: Close, More: !a ; Stream a}
```

To consume one such channel, we write a function that takes a list of elements of type `a` and a channel and sends the elements in the list, one at a time, on the channel:
```freest
marshall : forall a -> [a] -> Stream a -> ()
marshall []        c = c |> select Done |> close
marshall (x :: xs) c = c |> select More |> send x |> marshall xs
```

To consume the other endpoint of the channel, that is, to consume a channel of type `Dual (Stream a)`, we take advantage of pattern-matching on session operations:
```freest
unmarshall : forall a -> Dual (Stream a) -> [a]
unmarshall (&Done Wait)     = []
unmarshall (&More (?x ; c)) = x :: unmarshall c
```

Here's a little test. Expect to read `[1, 2, 3, 4, 5]` in the console.
```freest
_ = forkWith (marshall [1, 2, 3, 4, 5]) |> unmarshall |> print
```

Now imagine that, rather than a list, we are interested in marshalling and unmarshalling binary trees. The datatype for binary trees of arbitrary elements `a` is as follows:
```freest
data Tree a = Leaf | Node (Tree a) a (Tree a)
```

A first instinct is to reuse the flat `Stream a` we already have. It can carry a tree, but at a price. A `Stream a` conveys a one-dimensional run of payloads terminated by `Done`; it records nothing about tree shape. To move a `Tree a` across it, the sender first *flattens* the tree along an agreed traversal and, since a bare payload cannot tell a `Leaf` from a `Node`, each element must also carry that shape bit — for instance streaming the tree as a `Stream (Maybe a)`, emitting `Nothing` for every `Leaf` and `Just x` for the root of   every `Node`.

Fix a **pre-order** walk: emit the node, then its left subtree, then its right. The receiver rebuilds the tree by reading tokens in that same order. The catch is that a `Stream` only guarantees a well-typed *sequence* of tokens, not that its length and the structure `Nothing` and `Maybe` (that is, of leafs and root nodes) matches any tree, so the reader must add two runtime checks that a structured protocol would not need:

* **premature `Done`** — a token is required but the stream has ended (a truncated tree), and
* **trailing tokens** — the tree is complete yet the stream still offers `More` (leftover data).

We leave to the reader writing a function that tries to unmarshall a tree from a stream, while checking for the two error situations above:
```freest
unmarshall : forall a -> Dual (Stream (Maybe a)) -> Tree a
```

The bookkeeping and error-handling is exactly what a dedicated, structured channel type for trees lets us avoid, by duplicating the tree's shape into the protocol itself:
```freest
type TreeC a = +{Leaf: Skip, Node: TreeC a ; !a ; TreeC a}
```
The session type now admits precisely the well-formed serialisations, and the two checks above become impossible to violate. The remainder of this section develops the `TreeC a` approach.

The first thing to note is that the `TreeC` protocol does not close the channel. We say that `TreeC` is a *session* type but not a *channel* type. It cannot be used to create channels; in particular it cannot be used with `forkWith`.

Why don't we then write the type as `+{Leaf: Close, Node: ...}`, similarly to what we have done for type `Stream`? Imagine a `Node` tree whose left tree is a `Leaf`: after selecting `Node` and then `Leaf` we are left with the type `Close; !a; TreeC a`. But after closing a channel no further operations are available on the channel, and hence the "remaining" protocol `!a; TreeC a` would not be fulfilled.

Another way of seeing this is to remember that `Close ; T` is equivalent to `Close` for all type `T`.
Types `Close` and `Wait` are the *left-absorbing* elements of the semicolon type operator. If we use symbol `≡` to denote type equivalence, this laws can be written as follows:
```freest
Close ; T ≡ Close
 Wait ; T ≡ Wait
```
For this reason, when time comes to create a channel, we use the type `TreeC a ; Close` (or `TreeC a ; Wait`, but in FreeST we tend to keep the positive — output — and the negative — input — type constructors together).

So let us go back to the example of a `Node` tree whose left tree is a `Leaf`. Now, after selecting `Node` and then `Leaf` we are left with the type `Skip; !a; TreeC a`. But `Skip` is the (left and right) neutral element of the semicolon type operator. We write this as follows:
```freest
Skip ; T ≡ T
T ; Skip ≡ T
```
Then `Skip; !a; TreeC a` is equivalent to `!a; TreeC a` and we are free to continue consuming the channel.

This reasoning takes us to the conclusion that marshalling (and unmarshalling) a tree cannot be written with a single (recursive) function as we have done for the list case. Instead, we need a recursive function to consume a `TreeC a`, and a driver function to consume `TreeC a ; Close` while calling the recursive function.
Now, the recursive function must return a channel for two reasons: the driver function must be given access to the continuation channel so that it may close the channel, and the first recursive call must return the continuation channel so that one may then send the root and the right subtree.

Let us start with the exercise of marshalling a tree. The driver function is `marshall` and the recursive function is `mars`. The driver is easy to write:
```freest
marshall : forall a -> Tree a -> TreeC a; Close -> ()
marshall t c = c |> mars t |> close
```
(or `close (mars t c)` if you prefer.)

What is the type of `mars`? Would the below type work?
```freest
forall a -> Tree a -> TreeC a -> Tree a
```
Let analyse the type of the parameter channel as function `mars` progresses. The type of the channel is `Tree a`. We pattern match on the channel. Let us analyse the `Node` case. The type is now `TreeC a ; !a ; TreeC a` and we cannot call `mars` for the left subtree, for `mars` is expecting a `Tree a`, not a `Tree a` followed by something else (different from `Skip`). Therefore, `mars` must be *parametric on the continuation*. The function must be declared as
```freest
mars : forall a b -> Tree a -> TreeC a; b -> b
```
where `b` denotes the protocol that remains to be consumed after a call to `mars` having consumed a `TreeC a`. Hence the resulting type, `b`.

What is then the type of the continuation channel `b` when `marshall` calls `mars`? In order for `marshall` to be able to close the channel returned by `mars`, it must be `Close`. So, in a fully annotated syntax, `marshall` is written as follows:
```freest
marshall @a t c = mars @a @Close t c |> close
```
Type parameters are introduced as `@a` at the head of the function, explict type arguments are introduced in the body of the function also with the `@` notation, but this time followed by a type (`@Close`).

***Note:***
Impredicative polymorphism and the rich set of laws of context-free session types make an explosive mixture, streching the limits of the Quicklook algorithm. The FreeST compiler does its best at inferring type annotations as parameters to functions. If the compiler struggles then it may be a good idea to help it by providing some type annotations.

We are now in a position the write `mars`. We make use of the `where` clause and write:

```freest
marshall : forall a -> Tree a -> TreeC a; Close -> ()
marshall t c = mars t c |> close
    where
      mars : forall a b -> Tree a -> TreeC a; b -> b
      mars Leaf         c = c |> select Leaf
      mars (Node l x r) c = c |> select Node |> mars l |> send x |> mars r
```
The code is extremely compact and lightweight thanks to the `|>` operator and the implicit type parameters.

It is however instructive to to analyse how the type of the channel evolves as `mars` progresses. Let us concentrate on the right hand side of the second equation. `c` is of type `TreeC a; b`. After selecting `Node`, the type becomes `TreeC a ; !a ; TreeC a ; b`. Because `mars` expects `TreeC a; c`, it must be that case that `c` is `!a ; TreeC a ; b`. This is the type annotation for the first recursive call. Now the call to `mars` returns a channel of type `!a ; TreeC a ; b`. We send `x` on the channel to get `TreeC a ; b`. Again, because `mars` expects `TreeC a; c`, it must be that case that `c` is `b`. Hence the type annotation for the second recursive call is `b`. The fully annotated code is as follows.
```freest
mars : forall a b -> Tree a -> TreeC a; b -> b
mars @a @b Leaf         c =
  c |> select Leaf
mars @a @b (Node l x r) c =
  c |> select Node |> mars @a @(!a ; TreeC a; b) l |> send x |> mars @a @b r
```

Unmarshalling follows the same idea: a driver function `unmarshall` and a recursive function `unmars`. The latter must return the continuation channel in addition to the `Tree` read so far, so its signature must be as follows:
```freest
unmars : forall a b -> Dual (TreeC a) ; b -> (Tree a, b)
```
The driver function calls `unmars` to obtain a pair. The pair must be destructed (with a `let` construct), then the function must wait for the channel to be closed, after which it returns the tree in the pair:
```freest
unmarshall : forall a -> Dual (TreeC a) ; Wait -> Tree a
unmarshall c =
  let (t, c) = unmars c in wait c ; t
  where
    unmars : forall a b -> Dual (TreeC a) ; b -> (Tree a, b)
    ...
```
The `unmars` function should be easy to complete. We give the fully annotated version.
```freest
unmars @a @b (&Node c) =
  let (l, c) = unmars @a @(?a ; Dual (TreeC a); b) c
      (x, c) = receive c
      (r, c) = unmars @a @b c
  in (Node l x r, c)
```

*** Note:***
This is a point where the current version of FreeST needs an hand. Not so much on the second parameter (the `b`) but on the first (the `a`).

Complete the exercise with the customary test:
```freest
aTree : Tree Int
aTree = Node (Node Leaf 1 Leaf) 2 (Node (Node Leaf 3 Leaf) 4 Leaf)
_ = forkWith (marshall aTree) |> unmarshall |> print
```
Expect `Node (Node Leaf 1 Leaf) 2 (Node (Node Leaf 3 Leaf) 4 Leaf)` on the console (the "out" and the "in" trees coincide).
