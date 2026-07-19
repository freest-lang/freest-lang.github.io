---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Threads and channels
layout: default
nav_order: 6
parent: Tutorial
---

# Threads and channels, channels and threads
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

## Creating threads and channels, separately

The previous section has used the `forkWith` combinator to accomplish two distinct things:
* Create a new channel and
* Fork a new thread.

A channel is created. A thread is forked. One of the channel's two endpoints is passed to the new thread. The other endpoint is returned by the combinator, returned to the parent. This should always be plan A. By using `forkWith` alone we are guaranteed to build tree-shaped networks of threads, where threads are the nodes in the tree and channels connect nodes. A tree-shaped network is *guaranteed not to deadlock*.

But there may be cases where one would like to separate the two operations, either because we want two threads to share more than one channel, or because we need a cyclic thread network.

Consider a token ring whose nodes exchange messages as follows: each thread receives a message from the thread on its left and relays it to the thread on its right. Because we want our network to terminate we need:
* Two kinds of messages: `Done` to terminate, `More` to continue;
* Simple `relay` nodes;
* A distinguished node that decides when enough messages have been exchanged, call it `root`.

The type of the messages exchanged is as follows
```freest
type Forward = &{Done: Wait, More: Forward}
```

Forwarders are easy to write: read from the left (using pattern matching), write on the right (using reverse function application `|>`):
```freest
relay : Forward -> Dual Forward -1-> ()
relay (&Done Wait) d = d |> select Done |> close
relay (&More c)    d = d |> select More |> relay c
```

The `root` takes an extra parameter, `n`, a non-negative number describing the number of rounds. Rather than read-write, the `root` behaves as write-read, thus breaking circularity. When enough messages have been exchanged (when `n` is zero), `root` selects `Done`, waits for the message to go around the network and reads a `Done`. Otherwise, `root` selects `More`, waits for the message to go around the network, reads a `More`, and recurs.
```freest
root : Int -> Forward -> Dual Forward -1-> ()
root 0 c d =
    let d = d |> select Done |> close
    in case c of (&Done Wait) -> ()
root n c d = 
    let d = select More d
    in case c of (&More c) -> print n ; root (n - 1) c d
```
Notice the non-exhaustive pattern matching in each of the two equations for `root`: if the `root` writes `X` on the right, then `X` goes around the network, through `relay`s, and only `X` may appear on the left.

Now how do we set up a circular network, composed of `m-1` `relay`s and one `root`? We need
* an operation to create a channel, and
* another to create threads.

To create a new channel we use expression `channel @T`, where `T` is a channel endpoint type. For example `channel @Forward` returns a channel, that is, the pair `(Forward, Dual Forward)` composed of two endpoints, the first of type `Forward`, the second of type `Dual Forward`. The endpoints are deconstructed by means of `let` expressions. To create three channels write:
```freest
let (c1, d1) = channel @Forward
    (c2, d2) = channel @Forward
    (c3, d3) = channel @Forward
in ...
```

To fork a new thread use function `fork`. Fork receives a linear thunk, `t`, creates a thread running `t ()` and returns `()`. Thunks to be used with fork are usually written `(\_ -1-> ...)` with `_` of type `()`. The function is linear; the client rests assured that the function shall be used once only. For example, one of the relays is created with `fork (\_ -1-> relay c1 d2)`.

Putting everything together we have:
```freest
circle : ()
circle =
    let (c1, d1) = channel @Forward
        (c2, d2) = channel @Forward
        (c3, d3) = channel @Forward
    in fork (\_ -1-> relay c1 d2) ;  -- ch1 → ch2
       fork (\_ -1-> relay c2 d3) ;  -- ch2 → ch3
       root 5 c3 d1                  -- ch3 → ch1  (closes the ring 1→2→3→1)
```
which prints
```bash
5
4
3
2
1
```
on the console.


## Revisiting `forkWith`

Equipped with `channel` and `fork` we can figure out the behaviour of `forkWith`:
```freest
forkWith @a f =
  let (x, y) = channel @a in
  fork (\_  -1-> f y);
  x
```
The discussion of its type is postponed for a later section.


## Understanding termination of a FreeST program

The rule is simple: a program terminates when its main thread completes its execution.

All examples seen so far were carefully crafted so that the main thread waits for the last thread to complete. Recall the function that writes number five on an appropriate channel and then closes the channel:
```freest
writeFive : !Int ; Close -> ()
writeFive = sendAndClose 5
```

On the other channel endpoint we have:
```freest
readInt : ?Int ; Wait -> ()
readInt c =
  let (x, c') = receive c in print x ; wait c'
```
and we decided to fork thread `writeFive` and continue with `readInt`.
```freest
_ = forkWith writeFive |> readInt
```
This allowed thread `writeFive` to write its integer and close the channel. Recall that `send` and `close` are non-blocking operations, so that thread `writeFive` may complete without the cooperation of the main thread. The latter however, now running `readInt`, receives a value and waits for the channel to be closed. Because thread  writes first and closes then, we expect to read `5` from the console.

Now consider the reverse situation: fork `readInt` and continue with `writeFive`:
```freest
_ = forkWith readInt |> writeFive
```
In this case, we *may* not see `5` (or any other value) on the console. After forking, the main thread, performs its two non blocking operations and terminates. Thread `readInt` may not have time to read and print a value from the buffer.

All the examples in the preceeding section were carefully crafted so that the main thread always `wait`s for its child thread, and not the other way round.

## The buffered nature of channels

Channels are buffered. This means that output operations never block and input operations block only when the buffer is empty.

If we have an output-only channel endpoint (hence, an input-only at the other end), then we can have *intra*-thread communication via communication channels.
Take a simple channel endpoint that outputs two integer values before being closed. Remember that `Close` is an output type.
```freest
type SendIntInt = !Int ; !Int ; Close
```

Consuming `SendIntInt` is easy, taking advantage of the `|>` operator.
```freest
writeInts : SendIntInt -> ()
writeInts c = c |> send 1 |> send 2 |> close
```

To consume `Dual SendIntInt` we take advantage of pattern matching. The function returns the sum of the two numbers read from the channel.
```freest
readInts : Dual SendIntInt -> Int
readInts (?x ; ?y ; Wait) = x + y
```

To run each function in a different thread we use `forkWith` as before:
```freest
_ = forkWith writeInts |> readInts |> print
```

But because `SendIntInt` is *output only* we may run the two functions in the same thread, as long as we run `writeInts` prior to `readInts`:
```freest
_ = let (x, y) = channel @SendIntInt
    in writeInts x ;
       print $ readInts y
```
Expect to read `3` on the console.

Now suppose that we replace `Close` by `Wait` in the `SendIntInt` type. The two consumers are easy to derive: exchange `close` and `wait`. The type of one endpoint is no longer output-only. The result is, however, catastrophic. The (only) thread waits indefinitely for itself. A *deadlock*.
