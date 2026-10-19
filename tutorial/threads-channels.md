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

The previous section has used the `forkWith`{: .language-freest } combinator to accomplish two distinct things:
* Create a new channel and
* Fork a new thread.

A channel is created. A thread is forked. One of the channel's two endpoints is passed to the new thread. The other endpoint is returned by the combinator, returned to the parent. This should always be plan A. By using `forkWith`{: .language-freest } alone we are guaranteed to build tree-shaped networks of threads, where threads are the nodes in the tree and channels connect nodes. A tree-shaped network is *guaranteed not to deadlock*.

But there may be cases where one would like to separate the two operations, either because we want two threads to share more than one channel, or because we need a cyclic thread network.

Consider a token ring whose nodes exchange messages as follows: each thread receives a message from the thread on its left and relays it to the thread on its right. Because we want our network to terminate we need:
* Two kinds of messages: `Done`{: .language-freest } to terminate, `More`{: .language-freest } to continue;
* Simple `relay`{: .language-freest } nodes;
* A distinguished node that decides when enough messages have been exchanged, call it `root`{: .language-freest }.

The type of the messages exchanged is as follows
```freest
type Forward = &{Done: Wait, More: Forward}
```

Forwarders are easy to write: read from the left (using pattern matching), write on the right (using reverse function application `|>`{: .language-freest }):
```freest
relay : Forward -> Dual Forward -1-> ()
relay (&Done Wait) d = d |> select Done |> close
relay (&More c)    d = d |> select More |> relay c
```

The `root`{: .language-freest } takes an extra parameter, `n`{: .language-freest }, a non-negative number describing the number of rounds. Rather than read-write, the `root`{: .language-freest } behaves as write-read, thus breaking circularity. When enough messages have been exchanged (when `n`{: .language-freest } is zero), `root`{: .language-freest } selects `Done`{: .language-freest }, waits for the message to go around the network and reads a `Done`{: .language-freest }. Otherwise, `root`{: .language-freest } selects `More`{: .language-freest }, waits for the message to go around the network, reads a `More`{: .language-freest }, and recurs.
```freest
root : Int -> Forward -> Dual Forward -1-> ()
root 0 c d =
  let d = d |> select Done |> close
  in case c of (&Done Wait) -> ()
root n c d = 
  let d = select More d
  in case c of (&More c) -> print n ; root (n - 1) c d
```
Notice the non-exhaustive pattern matching in each of the two equations for `root`{: .language-freest }: if the `root`{: .language-freest } writes `X`{: .language-freest } on the right, then `X`{: .language-freest } goes around the network, through `relay`{: .language-freest }s, and only `X`{: .language-freest } may appear on the left.

Now how do we set up a circular network, composed of `m-1` `relay`{: .language-freest }s and one `root`{: .language-freest }? We need
* an operation to create a channel, and
* another to create threads.

To create a new channel we use expression `channel @T`{: .language-freest }, where `T`{: .language-freest } is a channel endpoint type. For example `channel @Forward`{: .language-freest } returns a channel, that is, the pair `(Forward, Dual Forward)`{: .language-freest } composed of two endpoints, the first of type `Forward`{: .language-freest }, the second of type `Dual Forward`{: .language-freest }. The endpoints are deconstructed by means of `let`{: .language-freest } expressions. To create three channels write:
```freest
let (c1, d1) = channel @Forward
    (c2, d2) = channel @Forward
    (c3, d3) = channel @Forward
in ...
```

To fork a new thread use function `fork`{: .language-freest }. Fork receives a linear thunk, `t`{: .language-freest }, creates a thread running `t ()`{: .language-freest } and returns `()`{: .language-freest }. Thunks to be used with fork are usually written `(\_ -1-> ...)`{: .language-freest } with `_`{: .language-freest } of type `()`{: .language-freest }. The function is linear; the client rests assured that the function shall be used once only. For example, one of the relays is created with `fork (\_ -1-> relay c1 d2)`{: .language-freest }.

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


## Revisiting `forkWith`{: .language-freest }

Equipped with `channel`{: .language-freest } and `fork`{: .language-freest } we can figure out the behaviour of `forkWith`{: .language-freest }:
```freest
forkWith @a f =
  let (x, y) = channel @a in
  fork (\_  -1-> f y);
  x
```
The discussion of its type is postponed for a later section.


## Understanding program termination in FreeST

The rule is simple: a program terminates when its main thread completes its execution. All remaining threads, if any, shall be silently terminated, even if having work to do.

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
and we decided to fork thread `writeFive`{: .language-freest } and continue with `readInt`{: .language-freest }.
```freest
_ = forkWith writeFive |> readInt
```
This allowed thread `writeFive`{: .language-freest } to write its integer and close the channel. Recall that `send`{: .language-freest } and `close`{: .language-freest } are non-blocking operations, so that thread `writeFive`{: .language-freest } may complete without the cooperation of the main thread. The latter however, now running `readInt`{: .language-freest }, receives a value and waits for the channel to be closed. Because thread  prints first and closes then, we expect to read `5`{: .language-freest } from the console.

Now consider the reverse situation: fork `readInt`{: .language-freest } and continue with `writeFive`{: .language-freest }:
```freest
_ = forkWith readInt |> writeFive
```
In this case, we *may* not see `5`{: .language-freest } (or any other value) on the console. After forking, the main thread, performs its two non blocking operations and terminates. Thread `readInt`{: .language-freest } may not have time to read and print a value from the buffer.

All the examples in the preceeding section were carefully crafted so that the main thread always `wait`{: .language-freest }s for its child thread, and not the other way round. In addition the clied threads perform no work after sending the `close`{: .language-freest } message.


## The buffered nature of channels

Channels are buffered. This means that output operations never block and input operations block only when the buffer is empty.

If we have an output-only channel endpoint (hence, an input-only at the other end), then we can have *intra*-thread communication via communication channels.
Take a simple channel endpoint that outputs two integer values before being closed. Remember that `Close`{: .language-freest } is an output type.
```freest
type SendIntInt = !Int ; !Int ; Close
```

Consuming `SendIntInt`{: .language-freest } is easy, taking advantage of the `|>`{: .language-freest } operator.
```freest
writeInts : SendIntInt -> ()
writeInts c = c |> send 1 |> send 2 |> close
```

To consume `Dual SendIntInt`{: .language-freest } we take advantage of pattern matching. The function returns the sum of the two numbers read from the channel.
```freest
readInts : Dual SendIntInt -> Int
readInts (?x ; ?y ; Wait) = x + y
```

To run each function in a different thread we use `forkWith`{: .language-freest } as before:
```freest
_ = forkWith writeInts |> readInts |> print
```

But because `SendIntInt`{: .language-freest } is *output only* we may run the two functions in the same thread, as long as we run `writeInts`{: .language-freest } prior to `readInts`{: .language-freest }:
```freest
_ =
  let (x, y) = channel @SendIntInt
  in writeInts x ;
     print $ readInts y
```
Expect to read `3`{: .language-freest } on the console.

Now suppose that we replace `Close`{: .language-freest } by `Wait`{: .language-freest } in the `SendIntInt`{: .language-freest } type. The two consumers are easy to derive: exchange `close`{: .language-freest } and `wait`{: .language-freest }. The type of one endpoint is no longer output-only. The result is, however, catastrophic. The (only) thread waits indefinitely for itself. A *deadlock*.
