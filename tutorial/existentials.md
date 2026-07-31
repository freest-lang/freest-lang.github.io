---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Abstract types
layout: default
nav_order: 9
parent: Tutorial
---

# Abstract types, functional and session

## Functional existential types

Data abstraction is an important tool in structuring programs. It establishes an interface between clients and providers of some functionality. The interface specifies what clients can use and providers must provide, allowing clients and providers to work separately. An implementation (prepared by some provider) may be replaced with another if the interface is kept intact, and the behaviour is not affected.

Data abstraction is captured by existential types. An existential type comprises a (bound) type variable `a`, standing for the unspecified abstract type, and a type `U` that stands for the implementation. Such a type is written `(exists a, U)`, or `(exists (a : k), U)`, if the kind `k` of type `a` is important. Type variable `a` may occur in type `U`.

Let us start with a simple abstract type, inspired on Pierce,
Types and programming languages. MIT Press 2002. A counter is an abstract that type that allows for the creation of new counters, reading the value of the counter, and increment of a given counter. The type if the counter itself is kept abstract. Let us call it `a`. We are then interested in three values:
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

Implementations construct values of type `Counter`. For example, if we take an integer value for the implementation of the counter, a provider can propose a integer counter as follows:
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
here we are interested in the concrete function `id @Int` (the compiler infers the type aplication). `succ` is defined as `\x -> x + 1`. Both functions are in the Prelude.

Notice the paralellism between the type and its contrutor:
```freest
(exists a, U)     -- type
(exists T, value) -- value
```
where `value` is of type `U` with occurrences of `a` replaced by T. In the case of the counter we have:
```freest
0    : Int
id   : Int -> Int
succ : Int -> Int
```

If providers pack values of existential types, clients unpack such values. The only form of upacking an existential type is by pattern matching:
```freest
let (@a, pattern) = ... in ...
```
In the case of the counter, if the client requires immediate access to the three functions, one can write
```freest
let (@a, (new, get, inc)) = aCounter in ...
```

Let's us write a concrete client, a client that creates a new counter, increments it twice, gets the value of the counter and prints it. Notice that client is parametric on the counter.
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

If `intCounter` is a straighforward implementation of a counter, it is by no means the only. Here is an alternative implementation using a list of unit,`()`, values:
```freest
listCounter : Counter
listCounter = (@[()], ( []
                      , length
                      , (()::)
                      )
              ) 
```
where `[]` is the empty list, `length` gives the number of elements in the list and `(()::)` is a *section* that appends an unit value `()` at the head of the list (that is, a function `\xs -> () :: xs)`).

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

An implementation of a flip-flop using a counter is as follows: we first unpack the `counter` abstract type (`a`) and its three operations and the pack the `flipFlop` using the abstract type of the `counter` and four new operations. The `new` operation of the `flipFlop` is that of the `counter`, the read operation applies the `even` predicate to the value read from the counter (where we have use point-free prgramming, but clould have written `\c -> even (read c)`), toggle is counter increment, and reset ignores the counter parameter and creates a new counter.
```freest
flipFlop : FlipFlop
flipFlop =
  let (@(a : *T), (new, get, inc)) = counter
  in (@a, ( new        -- new
          , even . get -- read
          , inc        -- toggle
          , \_ -> new  -- reset
          )
     )
```
Here we see that the (bound) type variable `a` obtained by unpacking the counter is used as representation type of the new package. (The explicit kind annotation forces `a` to be of unrestricted nature, to match the expected kind in the representation type of the pack operation).

We can put a flip-flop to work by unpacking it and chaining its operations, starting wth `new` and terminating with `read` (followed by `print`). We leave to the reader guessing the value on the console.
```freest
_ = let (@_, (new, read, toggle, reset)) = flipFlop
    in new |> toggle |> reset |> toggle |> read |> print
```

## Session existentials and universals

Existential packages can be passed in messages. Channels in FreeST may exchange values of any tupe, existentals included.
Here is shared channel that provides counter abstract data types:
```freest
type CounterProvider = *?Counter
```

A consumer, receives a counter (we use `receive_` to receive on shared channels), unpacks the counter and uses its operations as we have seen before.
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

We bring the two functions together by means of `forkJpoin`.
```freest
_ = forkWith counterProvider |> incTwice
```

This is all very unsurprising, we are passing existential values on channels, as we do with integer values. All the operations that define the abstract datatype are pre-defined, packed and sent. What if the operations take time to prepared, what if they are computed one by one? what if the set of operations is much larger than the one required by particular clients? Clients need bot download the whole lot; they could download the operations on as needed base. Could we not send each individual operation as they get ready? That is what session types are for. If we need to send two integer values we may compute both and then send a pair of type `(Int, Int}`. Or else we may dispatch the integers as they get ready, one at a time, in two separate messages, both of type `Int`.

So we need a means to send the type first, and then the various operations on the type. We need to send and receive types, and we have seen how ro do this before, in section [*exchanging types*](channels-and-session-types.md#exchanging-types).

So here is the plan for the remote counter: we send the abstract type first, and the the operations, one by one. Rather than eagerly sending all three operations in a row, we let clients ask for each one of them, individually and by an arbitrary order.