---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Abstract types
layout: default
nav_order: 9
parent: Tutorial
---

# Abstract types, functional and session
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

## Functional existential types

Data abstraction is an important tool in structuring programs. It establishes an interface between clients and providers of some functionality. The interface specifies what clients can use and providers must provide, allowing clients and providers to work separately. An implementation (prepared by some provider) may be replaced with another if the interface is kept intact, and the behaviour is not affected.

Data abstraction is captured by existential types. An existential type comprises a (bound) type variable `a`, standing for the unspecified abstract type, and a type `U` that stands for the implementation. Such a type is written `(exists a, U)`, or `(exists (a : k), U)`, if the kind `k` of type `a` is important. Type variable `a` may occur in type `U`.

Let us start with a simple abstract type, inspired by Pierce: *Types and Programming Languages*. MIT Press (2002). A counter is an abstract data type that allows for the creation of new counters, reading the value of the counter, and increment of a given counter. The type of the counter itself is kept abstract. Let us call it `a`. We are then interested in three values:
```freest
new : a
get : a -> Int
inc : a -> a
```
Type `a` and the three functions that define the behaviour of the counter are packed in an existential type:
```freest
type Counter = (exists a, ( a         -- new
                          , a -> Int  -- get
                          , a -> a    -- inc
                          )
               )
```

Implementations construct values of type `Counter`. For example, if we take an integer value for the implementation of the counter, a provider can propose an integer counter as follows:
```freest
intCounter : Counter
intCounter = (@Int, ( 0     -- new
                    , id    -- get
                    , succ  -- inc
                    )
             )
```
where new counters are created with value `0`, the identity function for the get operation and the successor function to increment the counter. `id` is a polymorphic function defined as
```freest
id : forall (a : 1T) -> a -> a
id @a x = x
```
Here we are interested in the concrete function `id @Int` (the compiler infers the type application). `succ` is defined as `\x -> x + 1`. Both functions are in the Prelude.

Notice the parallelism between the type and its constructor:
```freest
(exists a, U) -- type
(@T, value)   -- value
```
where `value` is of type `U` with occurrences of `a` replaced by T. In the case of the counter we have:
```freest
0    : Int
id   : Int -> Int
succ : Int -> Int
```

If providers pack values of existential types, clients unpack such values. The only form of unpacking an existential type is by pattern matching:
```freest
let (@a, pattern) = ... in ...
```
In the case of the counter, if the client requires immediate access to the three functions, one can write
```freest
let (@a, (new, get, inc)) = aCounter in ...
```

Let us write a concrete client, a client that creates a new counter, increments it twice, gets the value of the counter and prints it. Notice that the client is parametric on the counter.
```freest
incTwice : Counter -> ()
incTwice counter =
  let (@a, (new, get, inc)) = counter
  in new |> inc |> inc |> get |> print
```

Putting everything together, we may write:
```freest
_ = incTwice intCounter
```
to read `2` on the console.

If `intCounter` is a straightforward implementation of a counter, it is by no means the only one. Here is an alternative implementation using a list of unit (`()`) values:
```freest
listCounter : Counter
listCounter = (@[()], ( []
                      , length
                      , (()::)
                      )
              )
```
where `[]` is the empty list, `length` gives the number of elements in the list and `(()::)` is a *section* that appends a unit value `()` at the head of the list (that is, a function `\xs -> () :: xs`).

The `incTwice` client can handle this counter as well:
```freest
_ = incTwice listCounter
```
and will print `2` once more.

## Building on existentials

The examples above do not make much use of type variable `a` (in fact we could have used a wildcard instead, `@_`). The variable can be used to talk about the type of the counter operations, via *ascription*. A verbose version of the `incTwice` function is as follows:
```freest
let (@a, (new, get, inc)) = counter
in (new : a)        |>
   (inc : a -> a)   |>
   (inc : a -> a)   |>
   (get : a -> Int) |>
   print
```

For a better use of type variable `a`, we build a new abstract datatype. A `FlipFlop` may be on a flip or on a flop state. It consists of four operations: create a new flip-flop, read the value of the flip-flop (a boolean value), toggle the value of the flip-flop, and reset the value of the flip-flop. The type is as follows:
```freest
type FlipFlop = (exists a, ( a          -- new
                           , a -> Bool -- read
                           , a -> a    -- toggle
                           , a -> a    -- reset
                           )
                )
```

An implementation of a flip-flop using a counter is as follows: we first unpack the `intCounter` abstract type (`a`) and its three operations, and then pack the `flipFlop` using the abstract type of the counter and four new operations. The `new` operation of the `flipFlop` is that of the counter, the read operation applies the `even` predicate to the value read from the counter (where we have used point-free programming, but could have written `\c -> even (read c)`), toggle is counter increment, and reset ignores the counter parameter and creates a new counter.
```freest
flipFlop : FlipFlop
flipFlop =
  let (@(a : *T), (new, get, inc)) = intCounter
  in (@a, ( new        -- new
          , even . get -- read
          , inc        -- toggle
          , \_ -> new  -- reset
          )
     )
```
Here we see that the (bound) type variable `a` obtained by unpacking the counter is used as representation type of the new package. (The explicit kind annotation forces `a` to be of unrestricted nature, to match the expected kind in the representation type of the pack operation).

We can put a flip-flop to work by unpacking it and chaining its operations, starting with `new` and terminating with `read` (followed by `print`). We leave to the reader guessing the value on the console.
```freest
_ =
  let (@_, (new, read, toggle, reset)) = flipFlop
  in new |> toggle |> reset |> toggle |> read |> print
```

## Session existentials and universals

Existential packages can be passed in messages. Channels in FreeST may exchange values of any type, existentials included.
Here is a shared channel that provides counter abstract data types:
```freest
type CounterProvider = *?Counter
```

A consumer receives a counter (we use `receive_` to receive on shared channels), unpacks the counter and uses its operations as we have seen before.
```freest
incTwice : CounterProvider -> ()
incTwice s =
  let (@_, (new, get, inc)) = receive_ s
  in new |> inc |> inc |> get |> print
```

A consumer of the dual type, that is a function that provides counters, can be written as follows.
```freest
counterProvider : Dual CounterProvider -> ()
counterProvider c =
  c |> send_ intCounter ; counterProvider c
```

We bring the two functions together by means of `forkWith`.
```freest
_ = forkWith counterProvider |> incTwice
```

This is all very unsurprising. After all we are passing existential values on channels, not much different than integer values. All the operations that define the abstract datatype are pre-defined, packed and sent. What if the operations take time to prepare? What if they are computed one by one? What if the set of operations is much larger than the one required by a particular client? Clients would like not to download the whole lot; they could download the operations on an as-needed basis. Could we not send each individual operation as they get ready? That is what session types are for. If we need to send two integer values we may compute both and then send a pair of type `(Int, Int)`. Or else we may dispatch the integers as they get ready, one at a time, in two separate messages, both of type `Int`.

So we need a means to send the type first, and then the various operations on the type. We need to send and receive types, and we have seen how to do this before, in section [*exchanging types*](channels-and-session-types.md#exchanging-types).

So here is the plan for the remote counter: we send the abstract type first, and then the operations, one by one, as requested by the client. That is, rather than eagerly sending all three operations in a row, we let clients ask for each one of them, individually and by an arbitrary order.
Here is the type that governs the channel as seen from the end of the counter provider (the server):
```freest
type Provide a = &{ New: !a ; Provide a
                  , Get: !(a -> Int) ; Provide a
                  , Inc: !(a -> a) ; Provide a
                  , Done: Wait }

type CounterProvider = !type a. Provide a
```
Type `CounterProvider` first sends a type `a` and then continues as `Provide a`. The latter type must be given a name because it is recursive. We would not be able to "expand" its definition, and get rid of occurrences of `Provide`. Type `Provide` is parameterized on the existential value `a`. It offers the three operations, `New`, `Get` and `Inc` with the expected types. Clients may download each operation as often as needed. The interaction should be terminated by selecting `Done`.

We start with the server. It sends a type, `Int`, and then goes in a recursive function, `provide`, that consumes a value, a channel, of type `Provide Int`.
```freest
counterProvider : CounterProvider -> ()
counterProvider c =
  c |> sendType @Int |> provide
  where
    provide : Provide Int -> ()
    provide (&New  c) = c |> send 0                |> provide
    provide (&Get  c) = c |> send @(Int -> Int) id |> provide
    provide (&Inc  c) = c |> send succ             |> provide
    provide (&Done c) = c |> wait
```

The client, on the other end of the channel, consumes an endpoint of type `Dual CounterProvider`. It first receives an existential pack, which it deconstructs straightaway with pattern matching, thus obtaining the existential type (bound to `@a` and never *explicitly* used) and the continuation channel `c` on which to continue interaction. It then downloads functions on an as needed basis, while computing the counter expression `get (inc (inc new))`. In the end it closes the channel endpoint and prints the result.
```freest
incTwice : Dual CounterProvider -> ()
incTwice c =
  let (@a, c) = receiveType c
      (v,   c) = c |> select New  |> receive
      (inc, c) = c |> select Inc  |> receive @(a -> a) @(Dual (Provide a))
      v        = inc (inc v)
      (get, c) = c |> select Get  |> receive
      n        = get v
      ()       = c |> select Done |> close
  in print n
```

If you are wondering why one has to bind a type variable when unpacking an existential value, and then not use it, remember that the compiler conducts a lot of inference. For example, recall the type of receive:
```freest
receive : forall (a : 1T) (b : 1S) -> ?a; b -> (a, b)
```
None of the various occurrences of `receive` is annotated. Let us try annotating the first:
```freest
      (inc, c) = c |> select Inc  |> receive @(a -> a) @(Dual (Provide a))
```
The first is the type of the inc function, parametric on `a`, the second the type of the continuation channel, again parametric on `a`.

Finally, to test we use the scheme we have used so often. Expect to read `2` on the console
```freest
_ = forkWith counterProvider |> incTwice
```

In `incTwice` we managed to get away with no type annotations. Unfortunately this is not the case in `counterProvider`. Try removing the `@(Int -> Int)` annotation in `send id`. The compiler currently complains with
```bash
Type mismatch:
   | 
11 |     provide (&Get  c) = c |> send id |> provide
   |                         ^
Couldn't match expected type `!(forall (a : 1T) -*-> a -*-> a); Provide Int`, taken from:
    StandardLib/Prelude.fst:339:55–339:59
    | 
339 | send : forall #m (a : m T) -> a -> forall (b : 1S) -> !a;b -m-> b
    |                                                       ^^^^
with actual type `!(Int -*-> Int); Provide Int`, taken from:
  RemoteLazyCounter.fst:1:47–1:70
  | 
1 | type Provide a = &{New : !a ; Provide a, Get: !(a -> Int) ; Provide a,  Inc: !(a -> a) ; Provide a, Done: Wait}
  |                                               ^^^^^^^^^^^^^^^^^^^^^^^
A polymorphic value was not instantiated here (note the `forall`).
Consider giving it an explicit type argument (e.g. `Nothing @a`) or a type annotation.
```
We decided to follow the suggestion "Consider giving it an explicit type argument", et voilà! The compiler is happy.

## A summary of existential and universal types

FreeST has both functional and session variants of existential and universal quantification. The table below puts them side by side.

| Kind | Existential | Universal |
| --- | --- | --- |
| Functional (`T`)| `(exists (a : k), U)` | `forall (a : k) -> U` |
| Session (`S` or `C`) | `!type (a : k). U` | `?type (a : k). U` |

Each is introduced and eliminated by a matching pair of expressions:

| | Introduced by | Eliminated by |
| --- | --- | --- |
| Functional existential | pack: `(@U, v)` | unpack: `let (@a, x) = exp in exp` |
| Functional universal | abstract: `\@(a : k) -> exp` | apply: `exp @U` |
| Session existential | ... |  receive type: `receiveType exp` |
| Session universal | ... | send type: `sendType @U exp` |

Unlike their functional counterparts, the session types do not feature specific introduction operators. Session types may be introduced by the `channel` primitive. For example, `channel @(?type (a : k). U)` introduces a pair of channel endpoints, the first of which is of type `?type (a : k). U`. But expression `send 5 c` also introduces such a type if `c` is of type `!Int ; ?type (a : k). U`.

<!-- `receiveType : (?type (a : k). U) -> (exists (a : k), U)`
`sendType @V : (!type (a : k). U) -> ((\(a : k) -> U)V)` -->
