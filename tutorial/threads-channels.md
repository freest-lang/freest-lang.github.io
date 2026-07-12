---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Threads and channels
layout: default
nav_order: 5
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

## Creating threads

The previous section have used the `forkWith` combinator to accomplish two distinct things:
* Create a new channel and
* Fork a new thread.

A channel is created. A thread is forked. One of channel's two endpoints is passed to the new thread. The other endpoint is returned by the combinator, returned to the parent. This should always be plan A. By using `forkWith` alone we are guaranteed to build tree-shaped networks of threads, where threads are the nodes in the tree and channels connect nodes. A tree-shaped network is *guaranteed not to deadlock*.

But there may be cases where one would like to separate the two operations, either because we want two threads to share more than one channel, or because we need a cyclic thread network.

Consider a toy example of a circular network whose nodes exchange messages as follows: each thread receives a message from the thread at the left and forwards it to the thread on the right. Because we want our network to terminate we need:
* Two kinds of messages: `Done` to terminate, `More` continue;
* Simple `forwarder`s, from left to right;
* A distinguished forwarder that decides when enough messages have been exchanged, call it `master`.

The type of the messages exchanged is as follows
```freest
type Forward = &{Done: Wait, More: Forward}
```

Forwarders are easy to write: read from the left (using pattern matching), write on the write (using inverted function composition `|>`):
```freest
forward : Forward -> Dual Forward -1-> ()
forward (&Done Wait) d = d |> select Done |> close
forward (&More c)    d = d |> select More |> forward c
```

The `master` takes an extra parameter, `n`, a non-negative number describing the number of rounds. Rather than read-write, the `master` behaves as write-read. When enough messages have been exchanged (when `n` is zero), `master` selects `Done`, waits for the message to go around the network and reads a `Done`. Otherwise, `master` selects `More`, waits for the message to go around the network, reads a `More`, and recurs.
```freest
master : Int -> Forward -> Dual Forward -1-> ()
master 0 c d =
    let d = d |> select Done |> close
    in case c of
        (&Done Wait) -> ()
master n c d = 
    let d = select More d
    in case c of
        (&More c) -> print n ; master (n - 1) c d
```
Notice the non-exaustive pattern matching in each of the two equations for `master`: if it writes `X` on the right, then `X` goes around the network, through `forwader`s, and only `X` may appear on the left.

Now how do we setup a circular network, composed of `m-1` `forwarder`s and one `master`? We need
* an operation to create channel, and
* another to create threads.

To create a new thread we use expression `channel @T`, where `T` is a channel type. For example `channel @Forward` returns a channel type, pair `(Forward, Dual Forward)` composed of a two endpoints, the first of type `Forward`, the second of type `Dual Forward`. The endpoints are destructed by means of a `let` expressions. To create three channels write:
```freest
let (c1, d1) = channel @Forward
    (c2, d2) = channel @Forward
    (c3, d3) = channel @Forward
in ...
```

To fork a new thread use function `fork`. Fork receive a linear thunk, `t`,creates a thread running `t ()` and returns `()`. Thunks to be used with fork are usually written `(\_ -1-> ...)` with `_` of type `()`. For example, one of the forwarders is created with `fork (\_ -1-> forward c2 d2)`.

Putting everything together we have:
```freest
circle : ()
circle =
    let (c1, d1) = channel @Forward
        (c2, d2) = channel @Forward
        (c3, d3) = channel @Forward
    in fork (\_ -1-> forward c2 d2) ;
       fork (\_ -1-> forward c1 d3) ;
       master 10 c3 d1
```
which prints
```bash
10
9
8
7
6
5
4
3
2
1
```
on the console.