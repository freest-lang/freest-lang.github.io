---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Input and output
layout: default
nav_order: 8
parent: Tutorial
---

# Input and output
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

## Hello, world

We have been printing to the console since the very first examples, always through Prelude functions such as `print`, `putStr`, and `putStrLn`. The simplest FreeST program is no exception:
```freest
main : ()
main = putStrLn "Hello, world!"
```
The functions for talking to the console are as follows:

| Function | Type | Effect |
| --- | --- | --- |
| `putChar` | `Char -> ()` | Print a character to the console |
| `putStr` | `String -> ()` | Print a string |
| `putStrLn` | `String -> ()` | Print a string, followed by a newline |
| `print` | `forall (a : *T) -> a -> ()` | Print the string representation of any value, followed by a newline |
| `getChar` | `() -> Char` | Read a single character from the console |
| `getLine` | `() -> String` | Read a line from the console |

Notice that the `print` function accepts only unrestrited values (of multiplicity `*`). Printing a linear value would be an unfair way of disposing of it (of a value of multiplicity `1`).

A program that greets the user by name reads a line and prints it back:
```freest
main : ()
main =
  putStr "What is your name? ";
  let name = getLine () in
  putStrLn ("Hello, " ++ name ++ "!")
```

There is nothing special about input and output in FreeST: no `IO` monad, just state changing. As we are about to see, the console is *just another channel*, and reading and writing are *just* sending and receiving messages.
<!-- Everything we learned about
[session types](channels-and-session-types.md) and about
[shared channels](shared-channels.md) applies unchanged. -->

## stdout is a channel governed by a session type

Consider this nondeterministic program:
```freest
_ =
  let (j, a) = channel @ForkJoin in
  fork (\_ -> putChar 'a' ; join j) ;
  fork (\_ -> putChar 'b' ; join j) ;
  fork (\_ -> putChar 'c' ; join j) ;
  fork (\_ -> putChar 'd' ; join j) ;
  await 4 a
```
Four letters `a` to `d` are expected on the console, in any possible order.

Now consider this variant:
```freest
_ =
  let (j, a) = channel @ForkJoin in
  fork (\_ -> putChar 'a' ; putChar 'b' ; join j) ;
  fork (\_ -> putChar 'c' ; putChar 'd' ; join j) ;
  await 2 a
```
The number of interleavings is smaller because `a` will always come before `b`, and `c` before `d`.
Still an output of the form `acbd` is highly probable. What if we'd like to make sure that `a` and `b` come together, and similarly for `c` and `d`? Well, a simple solution is to use `putStr "ab"`, rather than two separate `putChar` operations. But that may not be a solution for all situations. Imagine a scenario where the output is very large and cannot fit into a string.

What we need here is a means for a thread to "grab" the `stdout`, use it in mutual exclusion, and let it go when no longer needed.
Because the `stdout` channel is shared, we use [*session initiation*](shared-channels.md#session-initiation). So `stdout` is a shared channel on which one may obtain a session. The session is an output stream.
```
stdout : *?OutStream
```

An output stream, in turn, is described by the type `OutStream`. It offers a choice between writing a string, writing a line, and closing:
```freest
type OutStream : 1C
type OutStream = +{ PutStr   : !String ; OutStream
                  , PutStrLn : !String ; OutStream
                  , Stop     : Wait
                  }
```
The type is recursive: after each write the channel is again an `OutStream`, so you may write as many times as you like. When you are done, you select `Stop` and wait for the other end to close.

Rather than selecting and sending by hand, the Prelude provides one combinator per operation. Each writes to the stream and returns the continuation, so calls chain nicely with `|>`:
```freest
hPutStr   : String -> OutStream -> OutStream
hPutStrLn : String -> OutStream -> OutStream
hPutChar  : Char -> OutStream -> OutStream
hPrint    : forall (a : *T) -> a -> OutStream -> OutStream
hCloseOut : OutStream -> ()
```

For example, `hPutStr` is defined as follows.
```freest
hPutStr : String -> OutStream -> OutStream
hPutStr x outStream = outStream |> select PutStr |> send x
```

We can solve our problem by manipulating `stdout` directly. First use `receive_ stdout` to get hold of a channel of type `OutStream`. Then consume the channel to the end. Using the predefined combinators, a function that prints two characters in mutual exclusion can be written as follows.
```freest
put2Chars : Char -> Char -> ()
put2Chars a b = receive_ stdout |> hPutChar a |> hPutChar b |> hCloseOut
```

The below code produces `abcd` or `cdab`, but no other interleaving of four letters.
```freest
_ =  let (j, a) = channel @ForkJoin in
  fork (\_ -> put2Chars 'a' 'b' ; join j) ;
  fork (\_ -> put2Chars 'c' 'd' ; join j) ;
  await 2 a
```

What about the put and the print operations described in the table in the [*input and output*](io.md#input-and-output) section? Each of this operations grabs a session, puts its operand and stops. For example, `putStr` can be defined as follows:
```freest
putStr : String -> ()
putStr x = stdout |> receive_ |> hPutStr x |> hCloseOut
```

The endpoint from `receive_ stdout` is linear (`OutStream : 1C`): forgetting the final `hCloseOut`, or using the channel twice, is a type error.

A word on cooperative threading. The guarantee we just described is one of *safety*: every thread that obtains the `stdout` session follows the `OutStream` protocol faithfully, so the characters written by one `put2Chars` can never be interleaved with those of another. What the type system does *not* guarantee is *liveness* — that a thread which grabs the stream will eventually give it back. The shared server behind `stdout` hands out one `OutStream` session at a time, and only accepts the next request once the current holder selects `Stop`; meanwhile every other thread sits blocked inside its own `receive_ stdout`. Programs must therefore use `stdout` in a *cooperative* manner. Nothing preempts a running thread and since writing to a stream uses only non-blocking operations, a thread that acquires `stdout` and then loops forever, or simply never reaches `hCloseOut`, holds the stream hostage and starves everyone else. Releasing the stream promptly, by consuming the session all the way to `Stop`, is the programmer's responsibility, not the type checker's.


## stdin is just another channel

<!-- Input mirrors output. An input stream offers to read a character, read a line, test for the end of input, and close:
```freest
type InStream : 1C
type InStream = +{ GetChar : ?Char   ; InStream
                 , GetLine : ?String ; InStream
                 , IsEOF   : ?Bool   ; InStream
                 , Stop    : Wait
                 }
```
and the Prelude provides the matching combinators, each returning the value read together with the continuation channel:
```freest
hGetChar    : InStream -> (Char,   InStream)
hGetLine    : InStream -> (String, InStream)
hIsEOF      : InStream -> (Bool,   InStream)
hCloseIn    : InStream -> ()
```
As with output, the console's standard input is a *provider*, `stdin : *?InStream`,
and the familiar `getLine ()` is just "acquire an endpoint, read one line, close it".

Reading one line at a time is where an explicit endpoint pays off, because we can
keep the same `InStream` open across several reads. Here is a function that echoes
the next `n` lines of its input, threading the endpoint through the recursion and
returning the continuation so the caller can close it:
```freest
echoLines : Int -> InStream -> InStream
echoLines n inp | n <= 0    = inp
echoLines n inp | otherwise =
    let (line, inp) = hGetLine inp in
       putStrLn line;
       echoLines (n - 1) inp

_ =
  receive_ stdin |> echoLines 3 |> hCloseIn
```
Notice how `inp` is threaded through the loop: each read consumes the endpoint and
hands back a fresh continuation, which we rebind under the same name, until the count
reaches zero and the endpoint is handed back to `main` to close with `hCloseIn`.

Why count the lines rather than read until end of input? Because `stdin` is *always
open* — its `hIsEOF` answers `False` forever — so an EOF-driven loop over the console
would never stop. For sources that do end, such as a file opened for reading, `hIsEOF`
reports the end, and `hGetContent` reads everything up to it in a single call.

Input and output, then, are not a separate corner of the language. They are session
types at work: a stream is a channel, its protocol is a type, and the linearity
checker guarantees that we read, write, and close exactly as the protocol demands. -->
