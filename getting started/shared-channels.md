---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Sharing is caring
layout: default
nav_order: 6
parent: Getting started
---

# Sharing is caring
{: .no_toc }

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>


<!-- limitations of linear channels -->
You've come far in FreeST, you've used channels in many different ways but you ask yourself "Can I connect more than two processes with linear channels?", and the answer is a reluctant "Yes, but...". Linear channels are expressive but can only connect two participants. 
  
One way to implement one-to-many, many-to-one or even many-to-many communication is to use lists of channel ends and iterate through them as needed. This solution works only when the number of clients and servers is fixed and known à priori. But even in this case the solution looks simpler than it is. Reading on a FreeST's channel is a blocking operation, and thus, reading values from a list of channels may become a slow sequential operation if writers are not ready.
<!-- Remember that linear channels are short-sighted and you can't "wait" for some channel to have a ready participant on the other side, you go in blind to whether or not the other side is ready to talk.  -->

<!-- shared channels -->
To fulfil the use-cases left open by linear channels, FreeST offers unrestricted, or shared, channels. Shared channels are simpler in their types but they can be copied and used (or not) by as many processes as needed. The most important aspect of shared channels for you to remember is **shared channels are stateless, they offer the same behaviour forever**.

We can express a shared integer stream from the point of view of the reader as `*?Int`. Many processes can `receive` from this channel as long as there are processes on the other side available to `send` integer values.

There are four shared session types at your disposal: 
```freest
*?T
*!T
*+{l, ..}
*&{l, ..}
```
Why do choices have no continuation? You might ask. Because shared session types offer the same behaviour forever, and the choice by itself is the behaviour offered. There cannot be a continuation different from the choice itself.

## Reading and Writing on Shared Channels

Let us a consider the type of a stream of integer values as seen from the producer side.
```freest
type IntStream : *S = *!Int
```

To produce an unbounded number of integers `n` on an `IntStream` channel end one may write:
```freest
produce : Int -> IntStream -> Diverge
produce n p =
  p |> send n |> produce n
```
Type `Diverge` is a mark for functions that do not terminate; it is defined as `()`. 

To consume a stream and print its values we may write:
```freest
consume' : dualof IntStream -> Diverge
consume' c =
  let (x, c') = receive c in
  print @Int x;
  consume' c'
```
In all cases (linear or unrestricted) variables `c` and `c'` denote the *same* channel end. When `c` is of a linear type the type of `c'` differs from that of `c`. But unrestricted types offer an uniform behaviour, so that one may write instead:
```freest
consume' : dualof IntStream -> Diverge
consume' c =
  let (x, _) = receive c in
  print @Int x;
  consume' c
```
In order to simplify reading from shared channels, FreeST offers function `receive_` that discards the channel from the pair and returns the value read. One can then write:
```freest
consume' : dualof IntStream -> Diverge
consume' c =
  c |> receive_ @Int |> print @Int ;
  consume' c
```
We can then write a simple program that consumes and prints numbers from two producers:
```freest
main : Diverge
main =
  let c = forkWith @IntStream @() consume' in
  fork (\_: () -> produce 1 c);
  produce 2 c
```

## Discarding Shared Channels

Linear channels cannot be discarded; they must be used to the `End` (if they terminate at all). Shared channels on the other hand may be discarded at any time. This program creates a channel that it never uses.
```freest
main : (IntStream, dualof IntStream)
main =
  new @IntStream ()
```
Notice that shared channels can never be closed even if they are not used.

A more interesting example consumes a finite number of values from an integer stream. The result is the sum of the numbers read.
```freest
consume' : Int -> dualof IntStream -> Int
consume' n c =
  if n == 0
  then 0
  else receive_ @Int c +  consume' (n - 1) c
```
The `main` function is now composed of two infinite producers and one finite consumer.
```freest
main : Int
main =
  let (p, c) = new @IntStream () in
  fork (\_: () 1-> produce 1 p);
  fork (\_: () 1-> produce 2 p);
  consume' 5 c
```
We have also rearranged the code in such a way that `consume'` runs on the main thread, so that the program may terminate once the five values are read. The program should print a number between `5` and `10`.

<!-- TODO: -->
<!-- send_ -->

## Session initiation
If shared channels are more practical than linear ones, why bother with linear channels? You can't
  serialize a tree directly in a shared channel for example. Shared channels lack the capacity of
  expressing interesting protocols. 

The trick with shared channels is to use them not as a single communication point, but as a rendez-vous point to establish more complex communication in a linear channel by exchanging endpoints. We call this process **session initiation**.

Let's think of a very useful case in programming, a shared data structure, in this case a single memory cell.
```
type Cell : 1S = +{ Read: ?Int
                  , Write: !Int
                  }; Close
```

The `Cell` session type describes our possible interaction with an `Int` memory cell.
```
type SharedCell : *S = *?Cell
```

The `SharedCell` type describes a channel on which a client can `receive` another channel with the `Cell` type. An example of a client that writes to the cell is:
```
cellClient : SharedCell -> ()
cellClient c =
  c |> receive      -- acquire a linear channel 
    |> select Write -- interact on the linear channel
    |> send 5
    |> close
```

However, it is the server that bears the important part of session initiation: to create the new channel and send one of its ends. 
To aid session initiation, FreeST offers the `accept` function which creates the channel endpoints, sends one to the client and returns the other. We thus write:
```
cellServer : dualof SharedCell -> ()
cellServer c =
  match accept @Cell c with {
    Read s ->
      send 0 s,
    Write s ->
      let (i, c) = receive s in c
  } |> close
```

We usually initiate sessions at the server side for we usually have more clients that servers and hence spare all clients from the process of creating and distributing channels. Nevertheless sessions may easily be started at the client side if needed.

The `accept` function can be easily written with `new` and `send` as follows:
```
accept : forall a:1A . *!a -> dualof a
accept ch =
    let (x, y) = new @a () in
    send x ch;
    y
```

<!-- The following is a one-shot server that only serves one client and then stops:
```
cellServer : dualof SharedCell -> ()
cellServer c =
    let (client, server) = new @Cell () in -- create linear endpoints
    send client c;                         -- send one to the client
    match server with {                    -- serve the other
        Read s ->
          send 0 s,
        Write s ->
            let (i, c) = receive s in c
    } |> close
``` -->

<!-- TODO: -->
<!-- runServer -->

<!-- TODO: -->
<!-- ## Useful constructs with shared channels -->
<!-- synchronization process -->
<!-- shared data structures -->