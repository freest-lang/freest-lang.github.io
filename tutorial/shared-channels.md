---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Sharing is caring
layout: default
nav_order: 7
parent: Tutorial
---

# Shared channels
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

## Cake or disappointment?

All the examples we have seen so far feature inter-thread communication via channels, whose endpoints are held by exactly one thread. This scheme makes sure that there are no unexpected messages on buffers: senders write what is supposed to be written, and receivers read exactly values of the expected type. Compounded with the use of the `forkWith` primitive to create new threads and new channels, programs are expected not to deadlock.

But someone must take the last cake in the store. Here's the scenario taken from Kokke, Morris, Wadler: *Towards Races in Linear Logic*. Log. Methods Comput. Sci. 16(4) (2020).

> Ami and Boé are working from home one morning when they each get a
craving for a slice of cake. Being denizens of the web, they quickly find the
nearest store which does home deliveries. Unfortunately for them, they both
order their cake at the *same* store, which has only one slice left. After that,
all it can deliver is disappointment.

The crucial difference between this example and those seen so far is that Ami and Boé both order their cake at the *same* store. If the interaction with the store is via a channel (what else could it be?), then both cake lovers would have to *share* one channel endpoint.

Not any channel endpoint can be shared. If two threads share a channel of type `!Int ; !Char` and they do not synchronise, chances are that the `Char` message may arrive at the destination before the `Int` message. The only channels that can be shared are *stateless*, channels whose contents do not change over time, and in particular that cannot be explicitly closed. Intuitively, one such channel can be understood as `!Int ; !Int ; ...`.

For channels that forever send values of type `U` we use a type of the form `*!U`. For a channel that forever selects label `l` or `m`, we write `*+{l,m}`. The table below summarises the unrestricted types.

| Type | Description |
| --- | --- |
| `*!U` | Forever send `U` |
| `*?U` | Forever receive `U` |
| `*+{l1,...,ln}` | Forever send one of the `l1`,...,`ln` labels |
| `*&{l1,...,ln}` | Forever receive one of the `l1`,...,`ln` labels |

All shared types are of kind `*C`, meaning that a) they can be shared (`*`) and b) that they can be used to create channels (`C`).

We start with the type of the cake store, as seen from the side of the store: it either provides `Cake` or `Disappointment`.
```freest
type CakeStore = *+{Cake, Disappointment}
```

The cake store first selects `Cake`, then `Disappointment`, and then terminates.
```freest
cakeStore : CakeStore -> ()
cakeStore  c = c |> select Cake
                 |> select Disappointment ; ()
```
Notice how the function "abandons" channel `c`. The expression `c |> select Cake |> select Disappointment` is of type `CakeStore`. Because of its unrestricted nature, it can be discarded, in this case at the left-hand-side of the semicolon operator.

Cake lovers branch on the incoming label and print a message accordingly.
```freest
cakeLover : String -> Dual CakeStore -> ()
cakeLover name (&Cake c)           = putStrLn (name ++ " got cake!")
cakeLover name (&Disappointment c) = putStrLn (name ++ " got disappointment")
```

To run a system with a store and two clients, we create a `CakeStore` channel and distribute its two endpoints to the appropriate actors.
```freest
_ = let (s, c) = channel @CakeStore in
    fork (\_ -> cakeLover "Ami" c);
    fork (\_ -> cakeStore s);
    cakeLover "Boé" c
```
Let us analyse the possible outputs of the above program. One is
```bash
Ami got disappointment
Boé got cake!
```
Another is:
```bash
Boé got disappointment
Ami got cake!
```
But there are many others. The program terminates when thread `cakeLover "Boé" c` terminates, so there will always be a Boé message. But whether you'll read an Ami message or not, depends on the interleaving of the various operations in the three threads.

There are different solutions to this problem. A simple one uses the fork-join pattern discussed in the next section. It requires an extra, separate, channel to communicate task completion. Another refactors the program, so that the same channel that conveys cakes or disappointments also signals task completion. We postpone this solution until a later section.


## Fork-join

Let us leave the cake store for a while.
Not all the programs we have seen terminate as expected. What do you expect to read on the console after running this code?
```freest
main =
    fork (\_ -> putChar 'A') ;
    fork (\_ -> putChar 'B') ;
    fork (\_ -> putChar 'C') ;
    ()
```
The precise answer is any sequence of distinct letters taken from the set {`A`, `B`, `C`}, of sizes 0 to 3. Yes, no output is a possible answer. It happens when `main` terminates before any of the three `putChar` threads managed to write their character.

If reading the three letters on the console is intended, then `main` must wait for the three threads to terminate. Since inter-thread communication is by message passing alone, we need a channel, a channel with three writers and one reader, that is a *shared* channel.

The fork-join pattern is a solution to this problem. It comes with three ingredients: a `ForkJoin` channel type
```freest
type ForkJoin
```
a `join` operation for child channels to communicate task completion:
```freest
join : ForkJoin -> ()
```
and a `await` operation for the parent thread to wait for a given number of children:
```freest
await : Int -> Dual ForkJoin -> ()
```

Using fork-join is easy. The parent threads creates a `ForkJoin` channel, distributes one end to each of its children (while forking them) and `awaits` the completion:
```freest
_ =
    let (w, r) = channel @ForkJoin in
    fork (\_ -> putChar 'A'; join w) ;
    fork (\_ -> putChar 'B'; join w) ;
    fork (\_ -> putChar 'C'; join w) ;
    await 3 r
```
We are now guaranteed to read three distinct characters on the console, even if we cannot anticipate their order.

It is instructive to study the implementation of the fork-join primitives. A `ForkJoin` channel is a channel on which threads can `select Over` an unbounded number of times.
```freest
type ForkJoin = *+{Over}
```

To signal completion of a child thread to the parent waiting on the join channel, we `select Over` on a `ForkJoin` channel. The operation returns the continuation channel, of type `ForkJoin`. The semicolon operator discards the (unrestricted) channel and returns `()`.
```freest
join : ForkJoin -> ()
join c = select Over c ; ()
```

To wait until `n` child threads have signalled completion through the join channel, we use the `await` primitive which receives `n` `Over` labels, by making use of the `times` operation in the Prelude.
```freest
await : Int -> Dual ForkJoin -> ()
await n c = times @() n (\_ -> case c of &Over _ -> ())
```


## Session initiation

The shared protocol of the ["Cake or Disappointment?"](#cake-or-disappointment) section was extremely simple: all the channel could convey was a `Cake` or a `Disappointment` option. What if we aim at more sophisticated protocols? (imagine an online store with *your* shopping cart).

Rather than an online store, we discuss a simple, yet useful abstraction, that of a *reference cell*. Reference cells should answer on shared channels. Clients seek read or write operations. These operations are of different natures. We could try a solution similar to the cake store, featuring two operations, `Read` and `Write`. The problem is that the former should be followed by a receive (`?`) operation and the latter by a send (`!`) operation, something that shared channels do not allow.

The uniform, stateless, nature of shared channels points into another direction: we split each interaction into two phases. First, *session initiation* runs on the shared channel and hands out a fresh linear channel; then the *cell operation* itself runs on that linear channel. In other words, clients read from the shared channel a linear channel on which they can perform the desired operation, read or write.

The type of reference cell of values of type `a` is a shared channel from which channels for conducting cell operations (`CellOp a`) can be read.
```freest
type CellRef : *T -> *C
type CellRef a = *?(CellOp a)
```

Cell operations are `Read` or `Write`, followed by the appropriate read or write operation (`?a` or `!a`). In any case, the channel must be closed.
```freest
type CellOp : *T -> 1C
type CellOp a = +{Read: ?a, Write: !a} ; Close
```
Notice that both `CellRef` and `CellOp` are type operators that expect unrestricted values (`*`). That is because the values are to be read and written an arbitrary number of times. Notice further that they are of base kind `C`; that allows creating channels of both types.

*Session initiation* requires the collaboration of the two parties: the reference cell and its clients. We start with the latter. In fact, all clients need to do is to read from the cell reference a cell operation channel. To read from a shared channel we use function `receive_`:
```freest
receive_ : forall (a : 1T) -> *?a -> a
```
Unlike its linear counterpart, `receive`, this function returns the value read from the channel. The channel itself need not be returned by the function: it can be reused as often as needed.

Given `CellRef`, to write a value `x` to the cell, one first `receive_` a `CellOp` on which one selects `Write`, sends `x` and closes the channel:
```freest
write : forall (a : *T) -> a -> CellRef a -> ()
write x s = receive_ s |> select Write |> sendAndClose x
```

The read operation is similar:
```freest
read : forall (a : *T) -> CellRef a -> a
read s = receive_ s |> select Read |> receiveAndClose
```

We now address the server side of session initiation. The server *accepts* a request for a `CellOp` on a `CellRef` channel. Function `accept` creates a `CellRef` channel, sends one endpoint on `CellOp` and returns the other endpoint:
```freest
accept : forall (a : 1C) -> *!a -> Dual a
```

The cell server accepts a connection from some client, and dispatches on the client operation: `Write` or `Read`. The Prelude functions `receiveAndWait` and `sendAndWait` complete the consumption of the `CellOp` channel. The function then recurs, either with the value received or with the old value.
```freest
cell : forall (a : *T) -> a -> Dual (CellRef a) -> ()
cell n c =
  case accept c of
    &Write s -> cell (receiveAndWait s) c
    &Read  s -> sendAndWait n s ; cell n c
```

To test the cell and its clients we could try forking a few `write` and `read` threads, but we must make sure they all complete their tasks before the main thread ends. For that we use the fork-join pattern again.
The below program forks three `read` threads and two `write` clients. Expect to read any sequence of numbers `0`, `5` and `6`, possibly duplicated or triplicated.
```freest
_ =
  let c      = forkWith (cell 0)
      (j, a) = channel @ForkJoin in
  fork (\_ -> c |> read |> print ; join j) ;
  fork (\_ -> c |> read |> print ; join j) ;
  fork (\_ -> c |> write 5       ; join j) ;
  fork (\_ -> c |> write 6       ; join j) ;
  fork (\_ -> c |> read |> print ; join j) ;
  await 5 a
```


## Multiple producer, multiple consumer

Many programming languages offer channels of the *multiple producer, single consumer* (mpsc) sort. But in session types there is no notion of producer or consumer. This means that we may have more than one thread reading on the same channel (in fact zero or more).

Let us think of a remote predicate evaluator. To make things more precise, think of the `gz`, greater than zero, predicate. As before, we need a shared channel, on which sessions may be initiated. Let us call the shared channel `PredEvalService` and the linear channel `PredEvalSession`.
```freest
type PredEvalSession : 1C
type PredEvalSession = !Int ; ?Bool ; Close

type PredEvalService : *C
type PredEvalService = *?PredEvalSession
```
As before these are two types of base kinds `C` (meaning that channels can be created from the types). Session is linear, `1`, and service is shared, `*`.

Clients interact on `PredEvalService`. They `receive_` a session on which they provide an integer and wait for the result, before closing the channel:
```freest
client : Int -> PredEvalService -> Bool
client n s =
  receive_ s |> send n |> receiveAndClose
```

The `gz` function performs session initiation via a call to `accept`. It then receives an integer and returns the corresponding boolean, before waiting for the channel to be closed.
```freest
gz : Dual PredEvalService -> ()
gz s =
  let (x, c) = receive (accept s) in sendAndWait (x > 0) c
```

We may now place several copies of `gz` and `client` running in parallel. Again, we make use of the fork-join pattern to make sure all threads are given a chance to terminate.
```freest
_ =
  let (c, s) = channel @PredEvalService
      (j, a) = channel @ForkJoin in
  fork (\_ -> s |> gz                   ; join j) ;
  fork (\_ -> c |> client 5    |> print ; join j) ;
  fork (\_ -> c |> client (-1) |> print ; join j) ;
  fork (\_ -> s |> gz                   ; join j) ;
  fork (\_ -> s |> gz                   ; join j) ;
  fork (\_ -> c |> client 0    |> print ; join j) ;
  await 6 a
```
The console should read `True`, `False`, `False`, in any order. The code above is brittle. Because each `gz` server serves one client only, one must have the same number of clients and servers. Any deviation from this pattern would leave a thread blocked indefinitely while waiting to read from a channel endpoint, `s` or `c`.