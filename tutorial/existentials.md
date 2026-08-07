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

Data abstraction is captured by existential types. An existential type comprises a (bound) type variable `a`{: .language-freest }, standing for the unspecified abstract type, and a type `U`{: .language-freest } that stands for the implementation. Such a type is written `(exists a, U)`{: .language-freest }, or `(exists (a : k), U)`{: .language-freest }, if the kind `k`{: .language-freest } of type `a`{: .language-freest } is important. Type variable `a`{: .language-freest } may occur in type `U`{: .language-freest }.

Let us start with a simple abstract type, inspired by Pierce: *Types and Programming Languages*. MIT Press (2002). A counter is an abstract data type that allows for the creation of new counters, reading the value of the counter, and increment of a given counter. The type of the counter itself is kept abstract. Let us call it `a`{: .language-freest }. We are then interested in three values:
```freest
new : a
get : a -> Int
inc : a -> a
```
Type `a`{: .language-freest } and the three functions that define the behaviour of the counter are packed in an existential type:
```freest
type Counter = (exists a, ( a         -- new
                          , a -> Int  -- get
                          , a -> a    -- inc
                          )
               )
```

Implementations construct values of type `Counter`{: .language-freest }. For example, if we take an integer value for the implementation of the counter, a provider can propose an integer counter as follows:
```freest
intCounter : Counter
intCounter = (@Int, ( 0     -- new
                    , id    -- get
                    , succ  -- inc
                    )
             )
```
where new counters are created with value `0`{: .language-freest }, the identity function for the get operation and the successor function to increment the counter. `id`{: .language-freest } is a polymorphic function defined as
```freest
id : forall (a : 1T) -> a -> a
id @a x = x
```
Here we are interested in the concrete function `id @Int`{: .language-freest } (the compiler infers the type application). `succ`{: .language-freest } is defined as `\x -> x + 1`{: .language-freest }. Both functions are in the Prelude.

Notice the parallelism between the type and its constructor:
```freest
(exists a, U) -- type
(@T, value)   -- value
```
where `value`{: .language-freest } is of type `U`{: .language-freest } with occurrences of `a`{: .language-freest } replaced by T. In the case of the counter we have:
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
to read `2`{: .language-freest } on the console.

If `intCounter`{: .language-freest } is a straightforward implementation of a counter, it is by no means the only one. Here is an alternative implementation using a list of unit (`()`{: .language-freest }) values:
```freest
listCounter : Counter
listCounter = (@[()], ( []
                      , length
                      , (()::)
                      )
              )
```
where `[]`{: .language-freest } is the empty list, `length`{: .language-freest } gives the number of elements in the list and `(()::)`{: .language-freest } is a *section* that appends a unit value `()`{: .language-freest } at the head of the list (that is, a function `\xs -> () :: xs`{: .language-freest }).

The `incTwice`{: .language-freest } client can handle this counter as well:
```freest
_ = incTwice listCounter
```
and will print `2`{: .language-freest } once more.

## Building on existentials

The examples above do not make much use of type variable `a`{: .language-freest } (in fact we could have used a wildcard instead, `@_`{: .language-freest }). The variable can be used to talk about the type of the counter operations, via *ascription*. A verbose version of the `incTwice`{: .language-freest } function is as follows:
```freest
let (@a, (new, get, inc)) = counter
in (new : a)        |>
   (inc : a -> a)   |>
   (inc : a -> a)   |>
   (get : a -> Int) |>
   print
```

For a better use of type variable `a`{: .language-freest }, we build a new abstract datatype, still following Pierce. A `FlipFlop`{: .language-freest } may be on a flip or on a flop state. It consists of four operations: create a new flip-flop, read the value of the flip-flop (a boolean value), toggle the value of the flip-flop, and reset the value of the flip-flop. The type is as follows:
```freest
type FlipFlop = (exists a, ( a          -- new
                           , a -> Bool -- read
                           , a -> a    -- toggle
                           , a -> a    -- reset
                           )
                )
```

An implementation of a flip-flop using a counter is as follows: we first unpack the `intCounter`{: .language-freest } abstract type (`a`{: .language-freest }) and its three operations, and then pack the `flipFlop`{: .language-freest } using the abstract type of the counter and four new operations. The `new`{: .language-freest } operation of the `flipFlop`{: .language-freest } is that of the counter, the read operation applies the `even`{: .language-freest } predicate to the value read from the counter (where we have used point-free programming, but could have written `\c -> even (read c)`{: .language-freest }), toggle is counter increment, and reset ignores the counter parameter and creates a new counter.
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
Here we see that the (bound) type variable `a`{: .language-freest } obtained by unpacking the counter is used as representation type of the new package. (The explicit kind annotation forces `a`{: .language-freest } to be of unrestricted nature, to match the expected kind in the representation type of the pack operation).

We can put a flip-flop to work by unpacking it and chaining its operations, starting with `new`{: .language-freest } and terminating with `read`{: .language-freest } (followed by `print`{: .language-freest }). We leave to the reader guessing the value on the console.
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

A consumer receives a counter (we use `receive_`{: .language-freest } to receive on shared channels), unpacks the counter and uses its operations as we have seen before.
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

We bring the two functions together by means of `forkWith`{: .language-freest }.
```freest
_ = forkWith counterProvider |> incTwice
```

This is all very unsurprising. After all we are passing existential values on channels, not much different than integer values. All the operations that define the abstract datatype are pre-defined, packed and sent. What if the operations take time to prepare? What if they are computed one by one? What if the set of operations is much larger than the one required by a particular client? Clients would like not to download the whole lot; they could download the operations on an as-needed basis. Could we not send each individual operation as they get ready? That is what session types are for. If we need to send two integer values we may compute both and then send a pair of type `(Int, Int)`{: .language-freest }. Or else we may dispatch the integers as they get ready, one at a time, in two separate messages, both of type `Int`{: .language-freest }.

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
Type `CounterProvider`{: .language-freest } first sends a type `a`{: .language-freest } and then continues as `Provide a`{: .language-freest }. The latter type must be given a name because it is recursive. We would not be able to "expand" its definition, and get rid of occurrences of `Provide`{: .language-freest }. Type `Provide`{: .language-freest } is parameterized on the existential value `a`{: .language-freest }. It offers the three operations, `New`{: .language-freest }, `Get`{: .language-freest } and `Inc`{: .language-freest } with the expected types. Clients may download each operation as often as needed. The interaction should be terminated by selecting `Done`{: .language-freest }.

We start with the server. It sends a type, `Int`{: .language-freest }, and then goes in a recursive function, `provide`{: .language-freest }, that consumes a value, a channel, of type `Provide Int`{: .language-freest }.
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

The client, on the other end of the channel, consumes an endpoint of type `Dual CounterProvider`{: .language-freest }. It first receives an existential pack, which it deconstructs straightaway with pattern matching, thus obtaining the existential type (bound to `@a`{: .language-freest } and never *explicitly* used) and the continuation channel `c`{: .language-freest } on which to continue interaction. It then downloads functions on an as needed basis, while computing the counter expression `get (inc (inc new))`{: .language-freest }. In the end it closes the channel endpoint and prints the result.
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
None of the various occurrences of `receive`{: .language-freest } is annotated. Let us try annotating the first:
```freest
      (inc, c) = c |> select Inc  |> receive @(a -> a) @(Dual (Provide a))
```
The first is the type of the inc function, parametric on `a`{: .language-freest }, the second the type of the continuation channel, again parametric on `a`{: .language-freest }.

Finally, to test we use the scheme we have used so often. Expect to read `2`{: .language-freest } on the console
```freest
_ = forkWith counterProvider |> incTwice
```

In `incTwice`{: .language-freest } we managed to get away with no type annotations. Unfortunately this is not the case in `counterProvider`{: .language-freest }. Try removing the `@(Int -> Int)`{: .language-freest } annotation in `send id`{: .language-freest }. The compiler currently complains with
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
| Functional (`T`{: .language-freest })| `(exists (a : k), U)`{: .language-freest } | `forall (a : k) -> U`{: .language-freest } |
| Session (`S`{: .language-freest } or `C`{: .language-freest }) | `!type (a : k). U`{: .language-freest } | `?type (a : k). U`{: .language-freest } |

Each is introduced and eliminated by a matching pair of expressions:

| | Introduced by | Eliminated by |
| --- | --- | --- |
| Functional existential | pack: `(@U, v)`{: .language-freest } | unpack: `let (@a, x) = exp in exp`{: .language-freest } |
| Functional universal | abstract: `\@(a : k) -> exp`{: .language-freest } | apply: `exp @U`{: .language-freest } |
| Session existential | (**\***) |  receive type: `receiveType exp`{: .language-freest } |
| Session universal | (**\***) | send type: `sendType @U exp`{: .language-freest } |

(**\***) Unlike their functional counterparts, the session types do not feature specific introduction operators. Session types may be introduced by the `channel`{: .language-freest } primitive. For example, `channel @(?type (a : k). U)`{: .language-freest } introduces a pair of channel endpoints, the first of which is of type `?type (a : k). U`{: .language-freest }. But expression `send 5 c`{: .language-freest } also introduces such a type if `c`{: .language-freest } is of type `!Int ; ?type (a : k). U`{: .language-freest }.

<!-- `receiveType : (?type (a : k). U) -> (exists (a : k), U)`{: .language-freest }
`sendType @V : (!type (a : k). U) -> ((\(a : k) -> U)V)`{: .language-freest } -->
