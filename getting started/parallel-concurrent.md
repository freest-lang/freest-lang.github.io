---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Concurrent programming
layout: default
nav_order: 5
parent: Getting started
---

# Concurrent programming
{: .no_toc }

<!-- TODO -->
<!-- some intro text here -->

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

<!-- TODO -->
<!-- intro to parallel programming in FreeST -->
<!-- parallel programming is an important subject in FreeST -->

## It's not a spoon, it's a `fork`

We have seen a function to consume a channel end of type `MathService`, namely
```freest
mathClient : MathService -> Int
```
We have also seen a function to consume the other end of the channel, namely
```freest
mathServer : dualof MathService -> ()
```
Now we would like to put the client in contact with the server. For this we need a *communication channel*. The channel shall have two endpoints, one obeys type `MathService`, the other `dualof MathService`. The former is passed to `mathClient`, the latter to `mathServer`.
Client and server must run in different threads; we fork a new thread to run the server while running the client on the main thread.
```freest
main : Int
main =
  forkWith @MathService @() mathServer
  |>
  mathClient
```
Function `forkWith` receives the type of a channel end (`MathService` in this case), the return type of the function to fork (`()`) and the function to fork (`mathServer`). It creates a new channel, passes one end to function `mathServer` and forks a new thread to run the function. The return value of the newly forked thread is discarded. Finally, function `forkWith` returns the other end of the channel. In function `main`, this end is then passed to function `mathClient` via the inverse function application operator `|>`. We could have written function `main` as
```freest
main : Int
main =
  let c = forkWith @MathService @() mathServer in
  mathClient c
```
or
```freest
main : Int
main =
  mathClient $ forkWith @MathService @() mathServer
```
but we prefer the first.

A program has at least one thread, the **main** thread. Program execution always ends when the main thread ends, no matter how many running threads  there are.

Function `forkWith` should always be our plan A, but there may be situations when we need to create a channel and fork a thread as two separate operations. For such situations FreeST provides the `new` and the `fork` functions.

Function `new` receives a type `T`, the type of one of the ends of the channel to create and becomes a suspended computation (usually called a *thunk*) that, when activated, returns the two ends of the channel (a pair of type `(T, dualof T)`). The typical usage is as follows.
```freest
main : Int
main =
  let (c, s) = new @MathService () in ...
```
where `c` is a channel end of type `MathService` and `s` of type `dualof MathService`.

Function `fork` receives a type `T` and a suspended computation, of type `() 1-> T`, and returns `()`.  The `1` in the type of the function guarantees that `fork` will run the function exactly once.
```freest
main : Int
main =
  ...
  fork @() (\_:() -> mathServer s) ;
  ...
```

Note that expression `\_:() -> mathServer s` builds a suspended computation that, when run, executes `mathServer s`. Putting everything together we have
```freest
main : Int
main =
  let (c, s) = new @MathService () in
  fork @() (\_:() -> mathServer s) ;
  mathClient c
```

Equipped with functions `new` and `fork` we can easily write `forkWith`. Nevertheless, `forkWith` stands at an higher level of abstraction and is prone to less concurrency errors, hence it remains our favourite choice.

```
forkWith : forall a:1A b . (dualof a 1-> b) -> a
forkWith f =
    let (x, y) = new @a () in
    fork (\_:() -> f y);
    x
```
<!-- TODO explain that fork accepts a linear thunk -->

<!-- As a language dedicated to communication and concurrency, FreeST provides the `fork` function to execute code in parallel, i.e., in another thread.

```freest
fork : forall a:*T . (() 1-> a) -> ()
```
A value of type `() 1-> a`, usually called a *thunk*, represents a suspended computation. If `f` is a suspended computation, then `f ()` runs the computation. This is exactly how `fork` behaves: runs the computation in a separate thread and discards the result. The `1` in the type of the function guarantees that `fork` will run the function exactly once. -->
