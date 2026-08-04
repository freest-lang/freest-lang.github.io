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

We have been printing to the console since the very first examples, always through Prelude functions such as `print`{: .language-freest }, `putStr`{: .language-freest }, and `putStrLn`{: .language-freest }. The simplest FreeST program is no exception:
```freest
main : ()
main = putStrLn "Hello, world!"
```
The functions for talking to the console are as follows:

| Function | Type | Effect |
| --- | --- | --- |
| `putChar`{: .language-freest } | `Char -> ()`{: .language-freest } | Print a character to the console |
| `putStr`{: .language-freest } | `String -> ()`{: .language-freest } | Print a string |
| `putStrLn`{: .language-freest } | `String -> ()`{: .language-freest } | Print a string, followed by a newline |
| `print`{: .language-freest } | `forall (a : *T) -> a -> ()`{: .language-freest } | Print the string representation of any value, followed by a newline |
| `getChar`{: .language-freest } | `() -> Char`{: .language-freest } | Read a single character from the console |
| `getLine`{: .language-freest } | `() -> String`{: .language-freest } | Read a line from the console |

The `getChar`{: .language-freest } function returns as soon as a key is pressed; unlike `getLine`{: .language-freest }, it does not wait for the end of the line. Notice that the `print`{: .language-freest } function accepts only unrestricted values (of multiplicity `*`{: .language-freest }). Printing a linear value would be an unfair way of disposing of it (of a value of multiplicity `1`{: .language-freest }).

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
Four letters `a`{: .language-freest } to `d`{: .language-freest } are expected on the console, in any possible order.

Now consider this variant:
```freest
_ =
  let (j, a) = channel @ForkJoin in
  fork (\_ -> putChar 'a' ; putChar 'b' ; join j) ;
  fork (\_ -> putChar 'c' ; putChar 'd' ; join j) ;
  await 2 a
```
The number of interleavings is smaller because `a`{: .language-freest } will always come before `b`{: .language-freest }, and `c`{: .language-freest } before `d`{: .language-freest }.
Still an output of the form `acbd`{: .language-freest } is highly probable. What if we'd like to make sure that `a`{: .language-freest } and `b`{: .language-freest } come together, and similarly for `c`{: .language-freest } and `d`{: .language-freest }? Well, a simple solution is to use `putStr "ab"`{: .language-freest }, rather than two separate `putChar`{: .language-freest } operations. But that may not be a solution for all situations. Imagine a scenario where the output is very large and cannot fit into a string.

What we need here is a means for a thread to "grab" the `stdout`{: .language-freest }, use it in mutual exclusion, and let it go when no longer needed.
Because the `stdout`{: .language-freest } channel is shared, we use [*session initiation*](shared-channels.md#session-initiation). So `stdout`{: .language-freest } is a shared channel on which one may obtain a session. The session is an output stream.
```freest
stdout : *?OutStream
```

An output stream, in turn, is described by the type `OutStream`{: .language-freest }. It offers a choice between writing a string, writing a line, and closing:
```freest
type OutStream : 1C
type OutStream = +{ PutStr   : !String ; OutStream
                  , PutStrLn : !String ; OutStream
                  , Stop     : Wait
                  }
```
The type is recursive: after each write the channel is again an `OutStream`{: .language-freest }, so you may write as many times as you like. When you are done, you select `Stop`{: .language-freest } and wait for the other end to close.

Rather than selecting and sending by hand, the Prelude provides one combinator per operation. Each writes to the stream and returns the continuation, so calls chain nicely with `|>`{: .language-freest }:

| Function | Type | Effect |
| --- | --- | --- |
| `hPutChar`{: .language-freest } | `Char -> OutStream -> OutStream`{: .language-freest } | Write a character to the stream |
| `hPutStr`{: .language-freest } | `String -> OutStream -> OutStream`{: .language-freest } | Write a string |
| `hPutStrLn`{: .language-freest } | `String -> OutStream -> OutStream`{: .language-freest } | Write a string, followed by a newline |
| `hPrint`{: .language-freest } | `forall (a : *T) -> a -> OutStream -> OutStream`{: .language-freest } | Write the string representation of any value, followed by a newline |
| `hCloseOut`{: .language-freest } | `OutStream -> ()`{: .language-freest } | Select `Stop`{: .language-freest } and wait for the stream to close |


For example, `hPutStr`{: .language-freest } is defined as follows.
```freest
hPutStr : String -> OutStream -> OutStream
hPutStr x outStream = outStream |> select PutStr |> send x
```

We can solve our problem by manipulating `stdout`{: .language-freest } directly. First use `receive_ stdout`{: .language-freest } to get hold of a channel of type `OutStream`{: .language-freest }. Then consume the channel to the end. Using the predefined combinators, a function that prints two characters in mutual exclusion can be written as follows.
```freest
put2Chars : Char -> Char -> ()
put2Chars a b = receive_ stdout |> hPutChar a |> hPutChar b |> hCloseOut
```

The below code produces `abcd`{: .language-freest } or `cdab`{: .language-freest }, but no other interleaving of four letters.
```freest
_ =
  let (j, a) = channel @ForkJoin in
  fork (\_ -> put2Chars 'a' 'b' ; join j) ;
  fork (\_ -> put2Chars 'c' 'd' ; join j) ;
  await 2 a
```

What about the put and the print operations described in the table in the [*input and output*](io.md#input-and-output) section? Each of these operations grabs a session, puts its operand and stops. For example, `putStr`{: .language-freest } can be defined as follows:
```freest
putStr : String -> ()
putStr x = stdout |> receive_ |> hPutStr x |> hCloseOut
```

The endpoint obtained by `stdout |> receive_`{: .language-freest } is linear (of type `OutStream : 1C`{: .language-freest }): forgetting the final `hCloseOut`{: .language-freest }, or using the channel twice, is a type error.

Since `putStr`{: .language-freest } grabs the `stdout`{: .language-freest } (and similarly for `putChar`{: .language-freest }, `putStrLn`{: .language-freest } and `print`{: .language-freest }), a call to this function cannot interrupt a session on another channel. For example, for the program below:
```freest
_ =
  let (j, a) = channel @ForkJoin in
  fork (\_ -> put2Chars 'a' 'b' ; join j) ;
  fork (\_ -> putChar 'x' ; join j) ;
  await 2 a
```
expect outputs `xab`{: .language-freest } or `abx`{: .language-freest }, but never `axb`{: .language-freest }.

**A word on cooperative threading.** The guarantee we just described is one of *safety*: every thread that obtains the `stdout`{: .language-freest } session follows the `OutStream`{: .language-freest } protocol faithfully, so the characters written by one `put2Chars`{: .language-freest } can never be interleaved with those of another. What the type system does *not* guarantee is *liveness* — that a thread which grabs the stream will eventually give it back. The shared server behind `stdout`{: .language-freest } hands out one `OutStream`{: .language-freest } session at a time, and only accepts the next request once the current holder selects `Stop`{: .language-freest }; meanwhile every other thread sits blocked inside its own `receive_ stdout`{: .language-freest }. Programs must therefore use `stdout`{: .language-freest } in a *cooperative* manner. Nothing preempts a running thread and since writing to a stream uses only non-blocking operations, a thread that acquires `stdout`{: .language-freest } and then loops forever, or simply never reaches `hCloseOut`{: .language-freest }, holds the stream hostage and starves everyone else. Releasing the stream promptly, by consuming the session all the way to `Stop`{: .language-freest }, is the programmer's responsibility, not the type checker's.


## stdin is just another channel

Input mirrors output. An input stream offers to read a character, read a line, test for the end of input, and close:
```freest
type InStream : 1C
type InStream = +{ GetChar : ?Char   ; InStream
                 , GetLine : ?String ; InStream
                 , IsEOF   : ?Bool   ; InStream
                 , Stop    : Wait
                 }
```
and the Prelude provides the matching combinators, each returning the value read together with the continuation channel:

| Function | Type | Effect |
| --- | --- | --- |
| `hGetChar`{: .language-freest } | `InStream -> (Char, InStream)`{: .language-freest } | Read a single character from the stream |
| `hGetLine`{: .language-freest } | `InStream -> (String, InStream)`{: .language-freest } | Read a line |
| `hIsEOF`{: .language-freest } | `InStream -> (Bool, InStream)`{: .language-freest } | Test whether the end of input has been reached |
| `hCloseIn`{: .language-freest } | `InStream -> ()`{: .language-freest } | Select `Stop`{: .language-freest } and wait for the stream to close |

As with output, the console's standard input is a *provider*,
```freest
stdin : *?InStream
```
and the familiar `getLine ()`{: .language-freest } is just "acquire an endpoint, read one line, close it":
```freest
getLine :  () -> String
getLine _ = 
  let (x, c) = stdin |> receive_ |> select GetLine |> receive in
  hCloseIn c; 
  x
```

Reading one line at a time is where an explicit endpoint pays off, because we can keep the same `InStream`{: .language-freest } open across several reads. Here is a function that echoes the next `n`{: .language-freest } lines of its input, threading the endpoint through the recursion and returning the continuation so the caller can close it:
```freest
echoLines : Int -> InStream -> InStream
echoLines n inp | n <= 0    = inp
echoLines n inp | otherwise =
  let (line, inp) = hGetLine inp in
    putStrLn line;
    echoLines (n - 1) inp

main =
  receive_ stdin |> echoLines 3 |> hCloseIn
```
Notice how `inp`{: .language-freest } is threaded through the loop: each read consumes the endpoint and hands back a fresh continuation, which we rebind under the same name, until the count reaches zero and the endpoint is handed back to `main`{: .language-freest } to close with `hCloseIn`{: .language-freest }.

Keeping the same `InStream`{: .language-freest } open across several reads precludes reading interference from other threads. The same cannot be said about writing interference: the different calls to `putStrLn`{: .language-freest } can be interleaved with `stdout`{: .language-freest } operations from other threads. We leave to the reader adjusting the above code, if so is desirable.

We seldom know in advance how many lines there are to read. That is what `IsEOF`{: .language-freest } is for: instead of counting down from a given `n`{: .language-freest }, we ask the stream, before each read, whether there is anything left. A function that counts the lines of its input reads as follows.
```freest
countLines : Int -> InStream -> (Int, InStream)
countLines n inp =
  let (eof, inp) = hIsEOF inp in
  if eof
  then (n, inp)
  else inp |> hGetLine |> snd |> countLines (n + 1)

main : ()
main =
  let (n, inp) = stdin |> receive_ |> countLines 0 in
  hCloseIn inp;
  putStrLn $ "Number of lines: " ++ show n
```
Notice that `hIsEOF`{: .language-freest } is itself a read on the input stream: the `IsEOF`{: .language-freest } branch of type `InStream`{: .language-freest } sends a `Bool`{: .language-freest } back and then continues as `InStream`{: .language-freest }, so testing for the end of input consumes the endpoint and hands back a continuation, exactly as `hGetLine`{: .language-freest } does. This is why `countLines`{: .language-freest } returns a pair. The `Int`{: .language-freest } is the answer we were after, and the `InStream`{: .language-freest } is the endpoint the caller still owes a `hCloseIn`{: .language-freest }. Dropping either half is a type error.

We decided to write `countLines`{: .language-freest } in tail recursion format, by passing `n`{: .language-freest }, the number of lines read so far, as a parameter. This allows a rather compact `else`{: .language-freest } branch, where `snd`{: .language-freest } (the second element in a pair) discards the value read by `hGetLine`{: .language-freest }.

The line read in the `else`{: .language-freest } branch is bound to `_`{: .language-freest }: we count lines, we do not care about their contents. Discarding the `String`{: .language-freest } is harmless because strings are unrestricted; had `hGetLine`{: .language-freest } returned a linear value, the wildcard would not have type checked.

We thus see that input and output are not a separate corner of the language. They are session types at work: a stream is a channel, its protocol is a type, and the linearity checker guarantees that we read, write, and close exactly as the protocol demands. They further provide for mutual exclusion when accessing `stdin`{: .language-freest } and `stdout`{: .language-freest }.