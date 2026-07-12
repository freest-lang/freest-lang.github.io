---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Channels and session types
layout: default
nav_order: 4
parent: Tutorial
---

# Channels and session types
{: .no_toc }

<!-- TODO -->
<!-- some intro text here -->

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Channels, protocols and session types

Channels are how FreeST threads communicate with each other. Each channel is made of **two endpoints** (usulaly abbreviated as channel ends). Threads use the endpoints to write to or read from channels.

## Session types and duality

Channels behave according to predefined **protocols**. A protocol is just a type, a type of a special nature, a **session type**. Protocols are built from eight **basic elements of interaction**:

| Session type | Meaning |
| --- | --- |
| `!T` | send value of type `T` |
| `?T` | receive value of type `T` |
| `!type T` | send a type `T` |
| `?type T` | receive a type `T` |
| `+{l: T, ..}` | select a choice |
| `&{l: T, ..}` | offer a collection of choices |
| `Close` | close the channel |
| `Wait` | wait for the channel to be closed |

The two endpoints of a channel are usually held by two different threads. These threads do not observe the the endpoint equaly. In fact they must follow different protocols. Imagine that both threads see the endpoint at type `!Int`. Then, to conform to the procotol, both threads must write on the channel. In order for communication to proceed smoothly one of the threads must wirte an integer value and the other must read the value, that is, one thread must see the channel as `?Int` and the other as `!Int`. These two types are said to by **dual** to each other. In fact, the eight basic elements of interaction come in dual pairs as follows:

| `S` | `Dual S` |
| --- | --- |
| `!T` | `?T` |
| `?T` | `!T` |
| `!type T` | `?type T` |
| `?type T` | `!type T` |
| `+{l: T, ..}` | `&{l: T, ..}` |
| `&{l: T, ..}` | `+{l: T, ..}` |
| `Close` | `Wait` |
| `Wait` | `Close` |

 The elements of interaction may be composed by means of sequential composition and recursion. We start with sequential composition and leave recursion for later. The sequential composition of (session) types is denote by the semicolon binary operator. Is `T` and `U` are session types, then type `T ; U` denotes the type that first preforms `T` and then `U`.

### Exchanging values and closing channels

Let us start with a very basic protocol: send an integer and then close the channel. This is written as `!Int ; Close`. Let us now write a consumer for this type, that is, a function and receives a channel of type `!Int ; Close` and exhausts the channel (that is, reads a value and closes the channel). Primitive functions `send` and `close` send a value o a given channel and close a given channels, respectively. The former returns a pair composed of a value and a channel endpoint (on which to continue the interaction), the latter returns `()`, the unit type.

```freest
writeFive : !Int ; Close -> ()
writeFive c =
  let c' = send 5 c in close c'
```

What is important to notice here is that `send` returns a channel endpoint of a different type: `c` is of type `!Int ; Close` and `c'` is of type `Close`. In more "functional" style, one can omit the `let` and write:
```freest
writeFive' : !Int ; Close -> ()
writeFive' c =
  close (send 5 c)
```
Do not forget that we first do `send` and only then `close`. If one is looking for a forward reading then we may use the *reversed function application* operator `|>` to get:
```freest
writeFive'' : !Int ; Close -> ()
writeFive'' c =
  c |> send 5 |> close
```
This is our preferred style. The `|>` operator is included in the Prelude and defined as `(|>) x f = f x`. We defer the study of its type section "Multiplicity polymorphism".

 In fact, this idiom (send and close) is so common that the Prelude has a name for it: `sendAndClose`. Using the new combinator, `writeFive` can be further simplified:
 ```freest
writeFive''' : !Int ; Close -> ()
writeFive''' = sendAndClose 5
```
 
 At this point it is worth studying what the type system of FreeST gives us. Channel endpoints such as the above are **linear**. They cannot be copied or discarded. This is central to the goal of ensuring that communication follows smoothly. Suppose we try to reuse channel `c` after having used it in the `send` function:
```freest
writeFive : !Int ; Close -> ()
writeFive c =
  let c' = send 5 c in close c
```
The FreeST type checker flags the slip as follows:
```bash
SendClose.fst:5:30–9:31: error:
Variable out of scope: `c`
  | 
5 |   let c' = send 5 c in close c
  |                              ^
```
Suppose now that we forget closing the channel:
```freest
writeFive : !Int ; Close -> ()
writeFive c =
  let c' = send 5 c in ()
```
The type checker complains that the scope of variable `c` ended and the variable was not consumed.
```bash
SendClose.fst:5:7–5:9: error:
Linear variable `c'` of type `Close` is not consumed
  | 
5 |   let c' = send 5 c in ()
  |       ^^
  hint: consume it with `close`
```

Now suppose we try to write two values on the channel, one after the other:
```freest
writeFive' : !Int ; Close -> ()
writeFive' c =
  let c' = send 5 c
      c'' = send 7 c'
  in close c''
```
The type checker complaints that the code does not follow the protocol, in particular that, in order to write an integer value in a channel, its type must be of type `!Int`, not `Close`.
```bash
SendClose.fst:5:20–10:22: error:
Couldn't match expected type `!Int; ạ` with actual type `Close`
  | 
5 |       c'' = send 7 c'
  |                    ^^
```

Let us now look at the other end of the channel and write a consumer for type `?Int; Wait`. This time we use primitive functions `receive` and `wait`. The former returns a pair composed of the value dequeued from the channel endpoint and the continuation enpoint, the latter returns `()`.
```freest
readInt : ?Int ; Wait -> ()
readInt c =
  let (_, c') = receive c in wait c'
```

If we would rather return the value just read, we may use the semicolon operation *on expressions* (not on types) as follows:
```freest
receiveInt' : ?Int ; Wait -> Int
receiveInt' c =
  let (x, c') = receive c in wait c' ; x
```
Once again, this pattern is so common that the Prelude provides for a combinator `receiveAndWait : ?a; Wait -*-> a`. Then we can use `receiveAndWait` in place of `receiveInt` as follows:
```freest
readInt'' : ?Int ; Wait -> Int
readInt'' = receiveAndWait
```

**Note.** The easiest way to check the type of a primitive operator is ask FreeST's interactive console `freest -i`:
 ```bash
$ freest -i
The FreeST Compiler, version 5.0, https://freest-lang.github.io/, :h for help
Ok, no modules loaded.
freest> :t (;)
receiveAndWait : forall (a : 1T) -*-> ?a; Wait -*-> a
```

Let us a try a slightly more complex protocol: that of a remote adder. The remote adder reads two integer values and writes an integer, before waiting for the channel to be closed. The type of the communication channel is `?Int ; ?Int ; !Int ; Wait`. A consumer for the channel is as follows:
```freest
adder : ?Int ; ?Int ; !Int ; Wait -> ()
adder c =
  let (x, c) = receive c
      (y, c) = receive c
  in sendAndWait (x + y) c
```
Notice that we don't use different names for the different incarnations of channel `c`. The channel is rebound twice, always with its original name, `c`. This is quite commom in FreeST source code.

The other end of the channel is of type `!Int ; !Int ; ?Int ; Close`. A function that consumes such a channel can be concisely written with the reverse function application operator `|>` and the Prelude function `receiveAndClose`.
```freest
onePlusOne : !Int ; !Int ; ?Int ; Close -> Int
onePlusOne c =
  c |> send 1 |> send 1 |> receiveAndClose
```


## Pattern matching on session input operations

Pattern matchings provides for concise and readable code. Apart from the conventional pattern matching on datatypes and literals, FreeST supports
pattern matching on all input (also know as negative) operations. We have discussed two so far: receiving a message and waiting for a channel to be closed.

We have seen a function `readInt : ?Int ; Wait -> ()` that reads an integer value and then waits for the channel to be read. This can be written as follows.
```freest
readInt : ?Int ; Wait -> ()
readInt (?x ; Wait) = print x
```
Pattern `(?x ; p)` receives a value from a channel (the channel argument to the function), binds the value to `x` and continues as prescribed by pattern `p`. So this pattern matches type `?T ; U` if `p` is a pattern of type `U`. In this case the continuation `p` stands for `Wait`, and `Wait` is the pattern for type `Wait` (the pattern and the type shared the same name).

Patterns may have as many semicolons as needed. For example to print the sum of three integer values read from a channel (and waiting for the channel to be closed), one can write
```freest
sumThree : ?Int ; ?Int ; ?Int ; Wait -> ()
sumThree (?x ; ?y ; ?z ; Wait) = print $ x + y + z
```

Pattern matching on sessions is available only for input operations; one cannot pattern match on send or close. There are two further session patterns that we discuss below.


### Creating new channels and new threads

At this point we have a consumer for endpoint `?Int ; ?Int ; !Int ; Wait` and another for the dual endpoint `!Int ; !Int ; ?Int ; Close`. How do we put the two together in a program? We need to create a new channel and to fork a new thread. The plan is for "main" to fork a thread with the code for the `adder` and continue with `onePlusOne`.

The more concise, and also the safest, way is to use the Prelude combinator `forkWith`. The combinator receives a function `f` (from a channel `T` to type `()`() and creates a channel of type `T`. Then uses one of the thus obtained channel end, say `y`, to fork a thread runing `f y` and returns the other end of the cannel, say `x`.

For example, the expression below is expected to print `2` on the console.
```freest
forkWith adder |> onePlusOne |> print
```

If the above syntax seems confusing, you may always use plain old function application, but you'd better read the code right-to-left.
```freest
print (onePlusOne (forkWith adder))
```
or
```freest
print $ onePlusOne $ forkWith adder
```


## Running scripts in FreeST

A FreeST script is a list of declarations, as for example, `adder` and `onePlusOne`. To run the above code one has to place it inside a declaration. For example:
```freest
main = forkWith adder |> onePlusOne |> print
```
But `main` is just another name. And since we are nor using it, we may as well use an wildcard:
```freest
_ = forkWith adder |> onePlusOne |> print
```


## A word on the semicolon expression operator

Expression `receive c in wait c'` is of type `()`, an *unrestricted* type. And that is the reason why it can de discarded in expression `receive c in wait c' ; x`.

The type of the semicolon operator is `forall (a : *T) (b : 1T) -*-> a -*-> b -*-> b`. [To be Completed]


## Selecting and offering choices

We have seen how to exchange values on channels and how to close channels. We now look at how we select and offer choices on channels. Imagine channel offering three choices after which it waits for the channel to be closed, in all cases. The channel can be written `&{Green: Wait, Yellow: Wait, Red: Wait}`, a semaphore as seen from the point of view of the reader.

A function that consumes one such channel endpoint and returns an appropriate string, needs to take a different action depending of the choice found at the front of the queue. The easiest way to deconstruct an `&` type is to use pattern matching.
```freest
showSemaphore : &{Green: Wait, Yellow: Wait, Red: Wait} -> String
showSemaphore (&Green s)  = wait s ; "Green"
showSemaphore (&Yellow s) = wait s ; "Yellow"
showSemaphore (&Red s)    = wait s ; "Red"
```

If pattern matching is not an option, one can always try a `case` expression:
```freest
showSemaphore' : &{Green: Wait, Yellow: Wait, Red: Wait} -> String
showSemaphore' s = case s of
  &Green s  -> wait s ; "Green"
  &Yellow s -> wait s ; "Yellow"
  &Red s    -> wait s ; "Red"
```
Notice that `s` is once again rebound in each case, under the same name.

The dual of the semahore type, that is the type of the other channel endpoint, is `+{Green: Close, Yellow: Close, Red: Close}`. To consume one such channel endpoint, we take advantage of expression `select Green` (in this case):
```freest
selectGreen : +{Green: Close, Yellow: Close, Red: Close} -> ()
selectGreen c = c |> select Green |> close
```
Since `select Green` is an expression (`select` alone is not), one may as well write the above function using point free programming, taking advantage of the function composition operator `.`:
```freest
selectGreen' : +{Green: Close, Yellow: Close, Red: Close} -> ()
selectGreen' = close . select Green
```

Putting the two functions together in a FreeST script we may write:
```freest
_ = forkWith selectGreen |> showSemaphore |> print
```
and expect to read `"Green"` on the console.


## Exchanging types

The last pair of dual session operators provide for exchanging types on channels. This is closely related to conventional (universal and existential) polymorphism, but applied to session types. Exchanging types allow writing protocols on which subsequent actions depend on the type exchanged.

Imagine a rendering service that transforms to strings values of different types. Clearly the service cannot know in advance all types in the world, and hence we leave to the client supplying the function that converts its type to a string. So, in the end, the role of the server is to conduct the (possibly heavy) process of converting a value into a string, given a client supplied rendering function.

To accept a type on a channel, bound it to type variable `a`, and then continue as `T` one writes `?type a . T`. With this in mind, the type of the channel the rendering service reads is:
```freest
?type a . ?(a -1-> String) ; ?a ; !String ; Wait 
```
Here we have chosen a linear function, `a -1-> String`, as way of signaling the client that the service will not reuse the function, but we could equaly have used an unrestricted function `a -> String`.

The best way to receive a type is to use pattern-matching. The pattern `?type a . p` receives a type, binds it to `a` and continues as pattern `p`. The pattern may then use type variable `a` if needed. Back to our example, the first three operations on the channel are all of input nature, and that calls for a four level deep pattern: receive a type `a`, receive a value `f`, receive a value `x`, and continue with channel `c`. Then we apply `x` to `f` and call the Prelude function `sendAndWait` to send `f x` and wait for the channel to be closed.

```freest
render : ?type a . ?(a -1-> String) ; ?a ; !String ; Wait -> ()
render (?type a . ?f ; ?x ; c) =
  sendAndWait (f x) c
```

To interact with `render` we need to chose a type `T`, provide for a function to convert `T` into a string, send a value of type `T`, wait for a string, and close the channel. To send a type `T` we use expression `sendType @T` which returns the continuation channel endpoint. Here's a client that chose `Char` for `T`. We use the backwards function application operator `|>` to chain all the three outputs, and then use the Prelude's function `receiveAndClose` to complete the protocol.
```freest
charRenderer : !type a . !(a -1-> String) ; !a ; ?String ; Close -> String
charRenderer c =
  c |> sendType @Char |> send showChar |> send 'F' |> receiveAndClose
  where
    showChar : Char -1-> String
    showChar c = "My favourite char is " ++ show c
```

Here's a different client that interacts with the renderer by using a pair `(String, Double)`.
```freest
pairRenderer : !type a . !(a -1-> String) ; !a ; ?String ; Close -> String
pairRenderer c =
  c |> sendType @(String, Float) |> send showPair |> send ("FreeST", 5.0) |> receiveAndClose
  where
    showPair : (String, Float) -1-> String
    showPair (x, y) = x ++ " " ++ show y
```

To put a server and a client together, we proceed as usual.
```freest
_ = forkWith render |> pairRenderer |> print
```

[TODO: `receiveType` and `sendType`]


## Unbounded protocols

All protocols we have seen so far comprise a fixed number of interactions. For example, to consume type `?type a . ?(a -1-> String) ; ?a ; !String ; Wait`, five interactions are needed.

There are however cases when one cannot antecipate the exact number of interactions. Imagine a server that reads from a channel integer values until a negative value is received. Clearly the type constructors we have seen so far cannot describe this protocol. Here's how the server may act: receive a value; if negative signal the client that no more numbers are expected; if positive ask for a new number. In the former case the server waits for the channel to be closed; in the latter the server "goes back to the beginning" of the protocol. To implement the "going back" part we name the protocol and use this name as a type.

Then, the `Repeat` protocol becomes: receive an int, select between options `Done` or `More`. If the former is selected, `Wait`, otherwise `Repeat`:
```freest
type Repeat = ?Int ; +{Done: Wait, More: Repeat}
```

For a consumer of type `Repeat` we setup an adder that sums all numbers until a negative number is encountered. Notice the first guard `x < 0`, leading to `select Done` and then `wait`. The result is `0` in this case. The second guard, being the negation of the first, is not strictly needed.
```freest
adder : Repeat -> Int
adder (?x ; c) | x < 0  =      c |> select Done |> wait ; 0
adder (?x ; c) | x >= 0 = x + (c |> select More |> adder)
```

For the client, we setup a function that consumes the dual of `Repeat`. The difficult, error prone way, is to define a different type, for example `Feed` or `CoRepeat`. The easy way is to use the `Dual` type operator, that takes a session type and returns another session type, with all operations dualised.

Then a client that sums the first `n` natural numbers can be written as follows.
```freest
sumTo : Int -> Dual Repeat -> ()
sumTo n c = case send n c of
    &More c -> sumTo (n - 1) c
    &Done c -> close c
```

Finally, we put the two process together as we have done before. Expect to read `55` on the console.
```freest
_ = forkWith (sumTo 10) |> adder |> print
```

***Note:*** 
Most functional programming languages provide for *type abbreviations*, often introduced with keyword `type`. FreeST is no exception. For example
```freest
type IntPair = (Int, Int)
```
introduces a name for type `(Int, Int)`. Code may use `IntPair` and `(Int, Int)` interchangeably.

But the `type` keyword in FreeST may introduce genuine new types, as `Repeat` above. This is a recursive type and the only means of introducing recursive types is via a `type` construction. 

## By the power of context-free sessions!

Let us start with a simple exercise: sending and receiving a list on a channel. We could send the whole list in one go and that would be it. But we are interested in really large data that needs to be streamed piecewise.

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
```
Close ; T ≡ Close
 Wait ; T ≡ Wait
```
For this reason, when time comes to create a channel, we use the type `TreeC a ; Close` (or `TreeC a ; Wait`, but in FreeST we tend to keep the positive — output — and the negative — input — type constructors together).

So let us go back to the example of a `Node` tree whose left tree is a `Leaf`. Now, after selecting `Node` and then `Leaf` we are left with the type `Skip; !a; TreeC a`. But `Skip` is the (left and right) neutral element of the semicolon type operator. We write this as follows:
```
Skip ; T ≡ T
T ; Skip ≡ T
```
Then `Skip; !a; TreeC a` is equivalent to `!a; TreeC a` and we are free to continue consuming the channel.

This reasoning takes us to the conclusion that marshalling (and unmarshalling) a tree cannot be written with a single (recursive) function as we have done for the list case. Instead, we need a recursive function to consume a `TreeC a`, and a driver function to consume `TreeC a ; Close` while calling the recursive function.
Now, the recursive function must return a channel for two reasons: the driver function must be given access to the continuation channel so that it may close the channel, and the first recursive call must return the continuation channel so that one may then send the root and the right subtree.

Let us start with the exercise of marshalling a tree. The driver function is `marshall` and the recursive function is `mars`. The driver is easy to write:
```freest
marshall : forall a -> Tree a -> TreeC a; Close -> ()
marshall t c = mars t c |> close
```

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
Impredicative polymorphism and the rich set of laws of context-free session types is an explosive mixture, streching the limits of the Quicklook algorithm. The FreeST compiler does its best at inferring type annotations as parameters to functions. If the compiler struggles then it may be a good idea to help it by providing some type annotations.

We are now in a position the write `mars`. We make use of the `where` clause and write:

```freest
marshall : forall a -> Tree a -> TreeC a; Close -> ()
marshall t c = mars t c |> close
    where
      mars : forall a b -> Tree a -> TreeC a; b -> b
      mars Leaf         c = 
        c |> select Leaf
      mars (Node l x r) c =
        c |> select Node |> mars l |> send x |> mars r
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
