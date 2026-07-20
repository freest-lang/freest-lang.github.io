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

All the examples we have seen so far feature inter-tread communication via channels, whose endpoints are held by exactly one thread. This scheme makes sures that there are unexpected messages on buffers: senders write what is supposed to be written, and receivers read exactly values of the expected type. Compounded with the use of the `forkWith` primitive to create new threads and new channels, programs are expected not to deadlock.

But someone must take the last cake in the cake in the store. Here's the scenario taken from Kokke, Morris, Wadler: *Towards Races in Linear Logic*. Log. Methods Comput. Sci. 16(4) (2020).

> Ami and Boé are working from home one morning when they each get a
craving for a slice of cake. Being denizens of the web, they quickly find the
nearest store which does home deliveries. Unfortunately for them, they both
order their cake at the *same* store, which has only one slice left. After that,
all it can deliver is disappointment.

The crucial difference between this example and those seen so far is that Ami and Boé they both order their cake at the *same* store. If the interaction with the store is via a channel (what else could it be?), then both cake lovers would have to *share* one channel endpoint.

Not any channel endpoint can be shared. If two threads share a channel of type `!Int ; !Char` and they not synchronise, chances are that the `Char` message may arrive at the destination before the `Int` message. The only channels that can be shared are *stateless*, channels whose contents do not change over time, and in particular that cannot be explicitely closed. Intuitively, one such channel can be understood as `!Int ; !Int ; ...`.

For channels that forever send values of type `U` we use a type of the form `*!U`. For a channel that forever selects label `l` or `m`, we write `+_{l,m}`. The table below summarises the for unstricted types.

| Type | Description |
| --- | --- |
| `*!U` | Forever send `U` |
| `*?U` | Forever receive `U` |
| `+{l1,...ln}` | Forever send one of the `l1`,...,`ln` labels |
| `&{l1,...ln}` | Forever receive one of the `l1`,...,`ln` labels |

All shared types are of kind `*C`, meaning that a) they can be shared (`*`) and b) that they can be used to create channels (`C`).

We start with the type of the cake store, as seen from the side of the store: it either provides `Cake` or `Disappointment`.
```freest
type CakeStore = *+{Cake, Disappointment}
```

The cake store first selects `Cake`, then `Disappointment`, and the terminates.
```freest
cakeStore : CakeStore -> ()
cakeStore  c = c |> select Cake
                 |> select Disappointment ; ()
```
Notice how the function "abandons" channel `c`. The expression `c |> select Cake |> select Disappointment` is of type `CakeStore`. Because of an unrestricted nature, it can be discarder, in this case at the left-hand-side of the semicolon operator.

Cake lovers branch on the incoming label and print a message accordingly.
```freest
cakeLover : String -> Dual CakeStore -> ()
cakeLover name (&Cake c)           = putStrLn (name ++ " got cake!")
cakeLover name (&Disappointment c) = putStrLn (name ++ " got disappointment")
```

To run a system with a store and two clients, we create a `CakeStore` channel and distribute its two endpoints to the appropriate actors.
```freest
_ = let (s, c) = channel @CakeStore in
    fork (\_ -1-> cakeLover "Ami" c);
    fork (\_ -1-> cakeStore s);
    cakeLover "Boé" c
```
Let us analyse the possible outputs of the above program. One is
```bash
Ami got disappointment
Boé got cake!
```
Another is:
```bash
Boé got disappointment!
Ami got cake
```
But there are may others. The program terminates when thread `cakeLover "Boé" c` terminates, so there will always be a Boé message. But whether you'll read an Ami message or not, depends on the interleaving of the various operations in the three threads.

There are different solutions to this problem. A simple one uses the fork-join pattern discussed in the next section. It requires an extra, separated, channel to communicate task completion. Another refactors the program, so that the same channel that conveys cakes or disappointments also signals task completion. We postpone this solution until a later section.


## Fork-join

Let us leave the case store for a while.
Not all the programs we have seen terminate as expected. What do you expect to read on the console after running this code?
```freest
main =
    fork (\_ -> putChar 'A') ;
    fork (\_ -> putChar 'B') ;
    fork (\_ -> putChar 'C') ;
    ()
```
The precise answer is any sequence of distinct letters taken from the set {`A`, `B`, `C`}, of sizes 0 to 3. Yes, no output is a possible answer. It happens when `main` terminates before any of the three `putChar` threads managed to write their character.

If reading the three letters on the console is intended, then `main` must wait for the three threads to terminate. Since inter thread communication is by message passing alone, we need a channel, a channel with three writers and one reader, that is a *shared* channel.

The fork-join pattern is a solution to this problem. if comes with three ingredients: a `ForkJoin` channel type
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
We are now guaranteed to read three distinct charactes on the console, even if we cannot antecipate their order.

It is instructive to study the implementation of the fork-join primitves. A `ForkJoin` channel is a channel on which threads can `select Over` an unbounded number of times.
```freest
type ForkJoin = *+{Over}
```

To signal completion of a child thread to the parent waiting on the join channel, we `select Over` on a `ForkJoin` channel. The operation returns the continuation channel, of type `ForkJoin`. The semicolon operator discard the (unrestricted) channel and returns `()`.
```freest
join : ForkJoin -> ()
join c = select Over c ; ()
```

To wait until `n` child threads have signalled completion through the join channel, we use the `await` primitive which receives `n` `Over` labels, by making use of the `times` operation in the Prelude.
```freest
await : Int -> Dual ForkJoin -> ()
await n c = times @() n (\_ -> case c of &Over _ -> ())
```