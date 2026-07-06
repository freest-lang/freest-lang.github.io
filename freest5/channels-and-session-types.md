---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Channels and session types
layout: default
nav_order: 4
parent: Freest5
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

| `S` | ` Dual S` |
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

Let us start with a very basic protocol: send an integer and then close the channel. This is written as `!Int ; Close`. Let us now write a consumer for this type, that is, a function and receives a channel of type `!Int ; Close` and exhausts the channel (that is, reads a value and closes the channel). Primitive functions `send` and `close` send a value o a given channel and close a given channels, respectively. The former returns a pair composed of a value and a channel endpoint (on which to continue the interaction), the latter returns `()`, the unit type.

```freestx
writeFive : !Int ; Close -> ()
writeFive c =
  let c' = send 5 c in close c'
```

What is important to notice here is that `send` returns a channel end point of a different type: `c` is of type `!Int ; Close` and `c'` is of type `Close`. In more "functionl" style, one can omit the `let` and write:
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
This is our preferred style. In fact, this idiom (send and close) is common that the Prelude has name for it: `sendAndClose` of type `a -*-> !a; Close -1-> ()`. [To Be Completed]

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
Suppose now that we forget closing the channel: [To Be Completed]

Now suppose we try to write two values on the channel, one after the other:
```freest
writeFive' : !Int ; Close -> ()
writeFive' c =
  let c' = send 5 c
      c'' = send 7 c'
  in close c''
```
The type checker complaints that the code does not follow the protocol, in particular that, in order to write an integer value an a channel, its type must be of type `!Int`, not `Close`.
```bash
SendClose.fst:5:20–10:22: error:
Couldn't match expected type `!Int; ạ` with actual type `Close`
  | 
5 |       c'' = send 7 c'
  |                    ^^
```

Let us now look at the other end of the channel and write a consumer for type `?Int; Wait`. This time we use primitive functions `receive` and `wait`. The former returns a pair composed of the value dequeued from the channel endpoint and the continuation enpoint, the latter returns `()`.
```freest
receiveInt : ?Int ; Wait -> ()
receiveInt c =
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
receiveInt'' : ?Int ; Wait -> Int
receiveInt'' = receiveAndWait
```

### A word on the semicolon expression operator

Expression `receive c in wait c'` is of type `()`, an *unrestricted* type. And that is the reason why it can de discarded in expression `receive c in wait c' ; x`.

What is important to notice here is that `receive` rer


 Its dual is the type that reads an integer value and then waits for the channel to be closed. And this is written as `?Int ; Wait`.





Imagine a server offering basic mathematical operations, governed by a protocol (or type) named `MathService`. The  `MathService` type gives clients two options: either negate a number or test whether a number is zero. Textually, we'll describe it as:
```
MathService =  Negate: send an Int, receive its negation
            OR IsZero: send an Int, receive True if it's zero, False otherwise
```

Before writing a proper protocol with session types, let's look at what tools we have to do so:
```
!T           - send value of type T
?T           - receive value of type T
+{l: T, ..}  - select a choice 
&{l: T, ..}  - offer a set of choices
T ; U        - do T, then U
Close        - close the channel
Wait         - wait for channel to be closed
Skip         - neutral element of ;
```

Now we can translate our textual representation of `MathService`. It is common practice in FreeST
to write our protocols from the point of view of the client because it is simpler. However, if 
your particular case is different, feel free to work from the point of view of the server.

First, our options (`Negate` and `IsZero`) map directly to selecting choices, so we have
`+{Negate:T, IsZero:U}`. We only need to describe types `T` and `U`. For `T`, we send an `Int`
and then receive an `Int`, which comes as `!Int` and `?Int` respectively, that are then combined
into `!Int ; ?Int`. Now type `U` seems much simpler, we send an `Int` and then receive a `Bool`,
so we write `!Int ; ?Bool`. The full session type in FreeST is:
```
type MathService = +{ Negate: !Int ; ?Int
                    , IsZero: !Int ; ?Bool
                    } ; Close
```

At the end of each option we want to terminate the protocol, hence the `Close`. The type without the `Close` (and the semiclon) would still be valid, however, **FreeST does not allow creating a channel of a type which does not come to a `Close` or `Wait` type**.
   <!-- Thus, `Skip` is
  useful when the intention is to combine the session type with others. -->

To obtain the server's point of view of the `MathService` protocol, one can simply use the `dualof` type operator. Thus, instead of computing explicitly the dual type, as in
```
type MathServer = &{ Negate: ?Int ; !Int
                   , IsZero: ?Int ; !Bool
                   } ; Wait
```
we just write `dualof MathService` and FreeST will do the work for us.

Notice nevertheless how the dual of `MathServer` is computed from `MathService`: `!` (output) becomes `?` (input) and vice-versa; `+` (internal choice) becomes `&` (external choice) and vice-versa; and `Close` becomes `Wait` and vice-versa. The contents of messages (`Int` and `Bool` in this case) remain unchanged.


## Thread interaction
<!-- primitives on channels -->
We've discussed session types for structured communication on channels, but how does it translate into code? Each session type has a corresponding channel operation (with exceptions to `Skip` and the semicolon operator):
```
!T          - send
?T          - receive
+{l:T, ..}  - select
&{l:T, ..}  - match
Close       - close
Wait        - wait
``` 

To instantiate new channels we use `new`. For function types and comprehensive documentation, check out the [Prelude]({{ site.url }}{{ site.baseurl }}/libraries/prelude) documentation page.

To implement a client of our `MathService` we follow the protocol (specified by the session type). A very effective tip on programming with channels in FreeST is to **always program around the session type**. If you focus on your protocols, you give priority to designing how you structure your processes, and then the implementation will come naturally by following said protocol.

Let us begin implementing a simple `MathService` client that wants the negation of `5`. Looking at the session type, our first step is to select an option (between `Negate` and `IsZero`):
```
mathClient : MathService -> Int
mathClient c0 =
  let c1 = select Negate c0 in
  ...
```

Now channel `c1` has type `!Int ; ?Int ; Close`, therefore we must send an `Int`, and in this case it's 
  the number we want to negate:
```
mathClient : MathService -> Int
mathClient c0 =
  ...
  let c2 = send 5 c1 in
  ...
```

Then for `c2` with type `?Int ; Close` we receive an `Int` (our negated number):
```
mathClient : MathService -> Int
mathClient c0 =
  ...
  let (i, c3) = receive c2 in
  ...
```

And finally we are left with `c3` of type `Close` and we simply `close` the channel:
```
mathClient : MathService -> Int
mathClient c0 =
  ...
  close c3;
  i
```

So our full `mathClient` looks like this:
```
mathClient : MathService -> Int
mathClient c0 =
  let c1 = select Negate c0 in
  let c2 = send 5 c1 in
  let (i, c3) = receive c2 in
  close c3;
  i
```

To avoid the first two `let` expressions, we can use the `|>` operator to streamline session operations, and `close` the channel together with the `receive` using `receiveAndClose`. Our final client is:
```
mathClient : MathService -> Int
mathClient c =
  c |> select Negate |> send 5 |> receiveAndClose @Int
```

Our client is done, we are only missing a **server**. Here the main difference is that instead of a single select like the client, the server has to provide for every option. Taking advantage of pattern-matching we start as
```
mathServer : dualof MathService -> ()
mathServer (Negate c1) = ...,
mathServer (IsZero c1) -> ...
```
In each equation we must handle the corresponding type. For example, in the `Negate` equation, channel `c1` has type `?Int ; !Int`. In either case we are left with type `Wait`, which calls for a call to the `wait` function. The full implementation is as follows:

```
mathServer : dualof MathService -> ()
mathServer (Negate c1) =
  let (i, c2) = receive c1 in
  c2 |> send (-i) |> wait
mathServer (IsZero c1) =
  let (i, c2) = receive c1 in
  c2 |> send (i == 0) |> wait
```

Finally, taking advantage of the Prelude's function `sendAndWait`, we can simply write:
```
mathServer : dualof MathService -> ()
mathServer (Negate c1) =
      let (i, c2) = receive c1 in
      sendAndWait @Int (-i) c2
mathServer (IsZero c1) =
      let (i, c2) = receive c1 in
      sendAndWait @Bool (i == 0) c2
```
<!-- The version with match - no need
 through a `match` expression (very similar to a `case` expression).
```
mathServer : dualof MathService -> ()
mathServer c0 = 
  match c0 with {
    Negate c1 -> ...,
    IsZero c1 -> ...
  }
  ...
```

For each branch of the `match` expression, we must handle the corresponding type. For example, in the `Negate` branch, channel `c1` has type `?Int ; !Int`. After the `match` expression, we are left with `Wait`, to which we can pipe into a close. The full implementation is as follows:
```
mathServer : dualof MathService -> ()
mathServer c0 = 
  match c0 with {
    Negate c1 -> 
      let (i, c2) = receive c1 in
      send (-i) c2,
    IsZero c1 -> 
      let (i, c2) = receive c1 in
      send (i == 0) c2
  } |> wait
```
FreeST offers pattern matching on the different cases of a `match` expression. Function `mathServer` may be written with two equations, one for `Negate`, the other for `IsZero`. In this case each individual equation must `wait` for the channel to be closed. The function then becomes as follows.
-->

## By the power of context-free session types!
<!-- context-free session types -->

The sequential composition operator of session types - the semicolon - allows for a convenient protocol composition and decomposition.

Imagine a simple protocol to conduct an integer predicate. Again, as seen from the side of the client, the protocol outputs an integer and then inputs the result in the form of a boolean value. The type can be written as follows.
```freest
type IntPred = !Int ; ?Bool
```

We can then write a function to consume such a protocol, a function that receives an `IntPred`. But the function must work on part of the protocol of some channel. At the very least, the channel must be closed. The function could then receive a channel end of type `IntPred ; Close`. But we may want to proceed with some extra communications before closing the channel. Taking advantage of polymorphism, we let the function accept a channel end of type `IntPred ; a`, consume the `IntPred` part, and return the unused part of the channel end, at type `a`. For example a function that invokes the predicate on a given integer `n` and prints the result can be written as follows.
```freest
invokeIntPred : Int -> forall a . IntPred ; a -> a
invokeIntPred n c =
  let (x, c) = c |> send n |> receive in
  print @Bool x;
  c
```

Functions that accept a channel end of type `T ; a` and return the same channel end, this time at time `a` are quite common in FreeST. The channel may then be used in the continuation.

Let us now look at a function that produces an `IntPred`, that is to say that consumes a channel end of type `dualof IntPred`. The function receives a predicate, a channel end of type `dualof IntPred ; a` and a returns the channel at type `a`, for `a` a linear session type.

```freest
serveIntPred : (Int -> Bool) -> forall a . dualof IntPred ; a -> a
serveIntPred p c =
  let (x, c) = receive c in
  send (p x) c
```

We now play the same game, this time for binary integer operations. The type of the protocol is
```freest
type IntBinOp = !Int ; !Int ; ?Int
```

A consumer of this type invokes the operator with two given integer values, prints the result, and returns the unused part of the channel end.
```freest
invokeIntBinOp : Int -> Int -> forall a . IntBinOp ; a -> a
invokeIntBinOp n m c =
  let (x, c) = c |> send n |> send m |> receive in
  print @Int x ;
  c
```
Similarly to `serveIntPred`, the server side for binary integer operators can be written as follows.
```freest
serveIntBinOp : (Int -> Int -> Int) -> forall a . dualof IntBinOp ; a -> a
serveIntBinOp f c =
  let (x, c) = receive c in
  let (y, c) = receive c in
  send (f x y) c
```

We can now compose these four protocols in many different ways. We can compose three `IntPred` in a row, or perhaps an `IntPred` followed by a `IntBinOp`, or even an `IntPred` followed by a `dualof IntBinOp`. In the end, channels must be closed, so that we propose as an example a consumer for type `IntPred ; IntBinOp ; Close`.
```freest
invoke : IntPred ; IntBinOp ; Close -> ()
invoke c =
  c |> invokeIntPred 3 @(IntBinOp ; Close) |> invokeIntBinOp 4 5 @Close |> close
```
For the other end of the channel we may write:
```freest
serve : dualof IntPred ; dualof IntBinOp ; Wait -> ()
serve c =
  c |>
  serveIntPred (>=0) @(dualof IntBinOp ; Wait) |>
  serveIntBinOp (+) @Wait |>
  wait
```
Functions `invoke` and `serve` can be run in different threads while communicating on a channel featuring type `IntPred ; IntBinOp ; Close` on the `invoke` side.

Regular session types are good, but context-free session types are a lot **more powerful**. With context-free session types you can correcty serialize a binary tree of integers using a single channel. We start by defining a conventional datatype for a binary tree of integer values and the corresponding type for a channel that consumes a tree channel.
```
data Tree = Node Tree Int Tree | Leaf

type TreeChannel = +{ Node: TreeChannel ;  !Int ; TreeChannel
                    , Leaf: Skip
                    }
```

<!-- combining session types with Skip -->
Notice how instead of using `Close`, we use `Skip`. If `Close` was used we would not be able to compose a singleton tree (a tree with an integer only) as it would correspond to type `Close ; !Int ; Close`, which doesn't get past the first `Close` because no interaction is possible on a closed channel.

The `TreeChannel` is then able to describe binary tree serialization without allowing for missing or unnecessary subtrees, given that it specifically describes the sending of a left and a right subtree.

<!-- polymorphic recursion -->
We write a function `sendTree` that sends any `Tree` through a `TreeChannel`. Naively we write this:
```
sendTree : Tree -> TreeChannel -> Skip
sendTree Leaf c =
  c |> select Leaf
sendTree (Node lt n rt) c =
  c |> select Node
    |> sendTree lt
    |> send n
    |> sendTree rt
```

And we are greeted by a plethra of errors. The fact is that we where supposed to return the continuation channel, and not `Skip`. But what is this mistery continuation, and how do we type it? The answer is through **polymorphism**.
```
sendTree : Tree -> TreeChannel ; a -> a
sendTree Leaf c =
  c |> select Leaf
sendTree (Node lt i rt) c =
  c |> select Node
    |> sendTree @T lt
    |> send i
    |> sendTree @U rt
```

Using polymorphism we can type a generic channel that begins with `TreeChannel` and continues off to some other type `a`. The next challenge is: which types do we pass to the recursive calls of `sendTree` (marked as `T` and `U`)? To find these types, we look at the type of the channel at the point of each recursive call. In the case of `T`, after we did `select Node`, channel end `c` is of type `TreeChannel ; !Int ; TreeChannel ; a` and function `sendTree` consumes a `TreeChannel`. Because `T` is the type of the continuation channel, it must be equal to `!Int ; TreeChannel; a`. In the case of `U`, after the `send` call, `c` is of type `TreeChannel; a`, hence the continuation is `a` alone.
<!--
Where is the continuation channel? Remember that in context-free session types `Skip` is the neutral element, therefore, after we consume `TreeChannel` we are left with `Skip`.
-->

The full implementation of `sendTree` is:
```
sendTree : Tree -> TreeChannel ; a -> a
sendTree Leaf c =
  c |> select Leaf
sendTree (Node lt i rt) c =
  c |> select Node
    |> sendTree @(!Int ; TreeChannel ; a) lt
    |> send i
    |> sendTree @a rt
```

We leave the `receiveTree` function up to you to try. Use `sendTree` as a template and remember to use the dual channel operations.
