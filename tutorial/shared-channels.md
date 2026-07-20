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
Boé got cake!
Ami got disappointment
```
Another is:
```bash
Ami got disappointment
Boé got cake!
```
But there are more. The program terminates when `cakeLover "Boé" c` terminates, so there will always be a Boé message. But whether you'll read an Ami message, depends on the interleaving of the various operations in the three threads.


## Fork-join

We have seen examples of programs with three threads and they all terminated as expected. But that need be the case. What do you expect to read on the console after running this code?
```freest
main =
    fork (\_ -> print 'A') ;
    fork (\_ -> print 'B') ;
    fork (\_ -> print 'B') ;
    ()
```
The precise answer is any sequence of three distinct letter, of sizes 0 to 3. Yes, no output is a possible answer. It happens when `main` terminates before any of the three print threads did not had a chance to `print`.

If reading the three letters on the console is intended, then `main` must wait for the three threads to terminate. Interthread communication is by message passing alone, and so we need a channel, a channel with three writers and one reader, that is a *shared* channel.
