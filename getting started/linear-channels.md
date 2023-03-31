---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Linear channels and session types
layout: default
nav_order: 4
parent: Getting started
---

# Linear channels and session types
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

## Channels, Protocols and Session types
<!-- channels as a way of connecting threads (and sharing data) -->
Channels are how FreeST threads communicate with each other. A channel is made of 
  **two endpoints**.

<!-- structured communication in channels through protocols -->
We create **protocols** for these channels as to structure communication, using **session types**. 

Imagine you want to create a situation of a client and a server of a `MathService`. The 
  `MathService` protocol gives the client two options: either negate a number, or check if a number
  is zero. Textually, we'll describe it as:
```
MathService =  Negate: send an Int, receive its negation
            OR IsZero: send an Int, receive True if it's zero, False otherwise
```

Before writing a proper protocol with session types, let's look at what tools we have to do so:
```
!T          - send value of type T
?T          - receive value of type T
+{l:T, ..}  - select a choice 
&{l:T, ..}  - provide choices
T;U         - sequential composition
End         - close channel (terminate communication)
Skip        - neutral element of ;
```

Now we can translate our textual representation of `MathService`. It is common practice in FreeST
  to write our protocols from the point of view of the client because it is simpler. However, if 
  your particular case is different, feel free to do the opposite.

First, our options (`Negate` and `IsZero`) map directly to selecting choices, so we have
  `+{Negate:T, IsZero:U}`. We only need to describe types `T` and `U`. For `T`, we send an Int
  and then receive an Int, which come as `!Int` and `?Int` respectively, that are then combined
  into `!Int;?Int`. Now type `U` seems much more simple, we send an Int and then receive a Bool,
  so we write `!Int;?Bool`. The full session type in FreeST is:
```
type MathService : 1S = +{ Negate: !Int;?Int
                         , IsZero: !Int;?Bool
                         }; End
```

At the end of each option's interaction the outcome is the same, we end the protocol, hence the
  `End`. If we write it without the `End` type, it default to `Skip`, however, as a rule of FreeST
  **you cannot instantiate a channel of a type which does not come to an `End`**. Thus, `Skip` is
  useful when the intention is to combine the session type with others.

To obtain the server's point of view of the `MathService` protocol, is to apply the **dualof** type
  operator to it. Thus, instead of writing it by hand, we just write `dualof MathService`, and 
  FreeST will do the work for us.


## Interacting with channels
<!-- primitives on channels -->
We've talked about session types for structured communication through channels, but how does it
  translate into code? Each session type has a corresponding channel operation (with exceptions
  to `Skip` and the session type combinator):
```
!T          - send
?T          - receive
+{l:T, ..}  - select
&{l:T, ..}  - match
End         - close
``` 

And to instantiate new channels we use `new`. For function types and comprehensive documentation,
  check out the [Prelude]({{ site.url }}{{ site.baseurl }}/documentation/prelude) documentation
  page.

To implement a client of our `MathServer` is to follow the protocol (specified in the session 
  type). A very effective tip on programming with channels in FreeST is to **always program around
  the session type**. If you first focus on your protocols, you give priority to designing how you
  structure your processes and what each will do, and then the implementation will come naturally
  by following said protocols.

Let us begin implementing a simple `MathServer` client that wants the negation of `5`. Looking at 
  the session type, our first step is to select an option (between `Negate` and `IsZero`):
```
mathClient : MathServer -> Int
mathClient c0 =
  let c1 = select Negate c0 in
  ...
```

Now channel `c1` has type `!Int;?Int;End`, therefore we must send an `Int`, and in this case it's 
  the number we want to negate:
```
mathClient : MathServer -> Int
mathClient c0 =
  ...
  let c2 = send 5 c1 in
  ...
```

Then for `c2` with type `?Int;End` we receive an `Int` (our negated number):
```
mathClient : MathServer -> Int
mathClient c0 =
  ...
  let (i, c3) = receive c2 in
  ...
```

And finally we are left with `End` and simply `close` it:
```
mathClient : MathServer -> Int
mathClient c0 =
  ...
  close c3
  i
```

So our full `mathClient` looks like this:
```
mathClient : MathServer -> Int
mathClient c0 =
  let c1 = select Negate c0 in
  let c2 = send 5 c1 in
  let (i, c3) = receive c2 in
  close c3;
  i
```

To avoid the first two `let` expressions, we can use the `|>` operator to streamline operations 
  into a single expression, and `close` the channel together with the `receive` using 
  `receiveAndClose`. Our final client is:
```
mathClient : MathServer -> Int
mathClient c =
  c |> select Negate |> send 5 |> receiveAndClose
```

Our client is done, we are only missing a **server**. Here the main difference is that instead of
  a single select like the client, the server has to provide for every option through a `match` 
  expression (very similar to a `case` expression).
```
mathServer : dualof MathService -> ()
mathServer c0 = 
  match c0 with {
    Negate c1 -> ...,
    IsZero c1 -> ...
  }
  ...
```

For each branch of the `match` expression, we must handle the corresponding type. For example,
  in the `Negate` branch, channel `c1` has type `?Int;!Int`. After the `match` expression, we
  are left with `End`, to which we can pipe into a close. The full implementation is as follows:
```
mathServer : dualof MathService -> ()
mathServer c0 = 
  match c0 with {
    Negate c1 -> 
      let (i, c2) = receive c1 in
      send (-i) c2,
    IsZero c1 -> 
      let (i, c2) = receive c1 in
      send (i == 0) c2,
  } |> close
```

## By the power of context-free session types!
<!-- context-free session types -->
Regular session types are good, but context-free session types are plain **better**. With 
  context-free session types you can correcty serialize a binary tree of integers with a single 
  channel.
```
data Tree = Node Tree Int Tree | Leaf

type TreeChannel : 1S = +{ Node: TreeChannel; !Int; TreeChannel
                         , Leaf: Skip
                         }
```

<!-- combining session types with Skip -->
Notice how instead of using `End`, we instead use `Skip`. If we used `End` we would not be able to
  compose a singleton `Node` as it would amount to `End; !Int; End`, which doesn't get past the 
  first `End`.

The `TreeChannel` is then able to describe binary tree serialization without allowing for any 
  missing or unnecessary subtrees, because it specifically describes the sending of a left and 
  right subtrees.


<!-- polymorphic recursion -->
Instead of a full client, we'll write a function `sendTree` that sends any `Tree` through a 
  `TreeChannel`. Naively we write this:
```
sendTree : Tree -> TreeChannel -> Skip
sendTree t c =
  case t of {
    Leaf -> c |> select Leaf,
    Node lt i rt ->
      c
      |> select Node
      |> sendTree lt
      |> send i
      |> sendTree rt
  }
```

And we are greeted by a plethra of errors. The fact is we where supposed to return the 
  continuation channel, and not `Skip`. But what is this mistery continuation, and how do we type
  it? The answer is through **polymorphism**.
```
sendTree : forall a:1S . Tree -> TreeChannel;a -> a
sendTree t c =
  case t of {
    Leaf -> c |> select Leaf,
    Node lt i rt ->
      c
      |> select Node
      |> sendTree @T lt
      |> send i
      |> sendTree @U rt
  }
```

Using polymorphism we can type a generic channel that begins with `TreeChannel` and continues off
  to some other type `a`. The next challenge is: which types do we pass to recursive calls of 
  `sendTree` (marked as `T` and `U`)? To solve these types, we look at the type of the channel at
  the point of each recursive call. In the case of `T`, after we did `select Node` we are left with
  `TreeChannel; !Int; TreeChannel`. Because `T` is the type of the channel continuation type, we 
  give it `!Int; TreeChannel`. In the case of `U`, after the `send i` call, we are left with just 
  `TreeChannel`! Where is the continuation channel? Remember that in context-free session types
  `Skip` is the neutral element, therefore, after we consume `TreeChannel` we are left with
  `Skip`.

The full implementation of `sendTree` is:
```
sendTree : forall a:1S . Tree -> TreeChannel;a -> a
sendTree t c =
  case t of {
    Leaf -> c |> select Leaf,
    Node lt i rt ->
      c
      |> select Node
      |> sendTree @(!Int;TreeChannel) lt
      |> send i
      |> sendTree @Skip rt
  }
```

We'll leave the `receiveTree` function up to you to try. Use `sendTree` as a template and remember
  to use the dual channel operations.