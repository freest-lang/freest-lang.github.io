---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Prelude
layout: default
nav_order: 1
parent: Libraries
---

# Prelude
{: .no_toc}

<div class="lib-note" markdown="1">
The **Prelude** is FreeST's standard library. It is imported by default into
every module, so all the types and functions on this page are in scope without
any import.

Terse operator families are collected into tables; everything else has its own
entry with its signature and — where the library documents it — a description
and a worked example.
</div>

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Booleans

### `Bool`
{: .no_toc}
```freest
type Bool : *T
data Bool = True | False
```

### Boolean operators
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| <code>(&#124;&#124;)</code> | `Bool -> Bool -> Bool`{: .language-freest } |
| `(&&)` | `Bool -> Bool -> Bool`{: .language-freest } |

### `not`
{: .no_toc}
```freest
not : Bool -> Bool
```
Boolean complement.

### `otherwise`
{: .no_toc}
```freest
otherwise : Bool
```
Always `True`. Handy as the last guard of a definition.

## Maybe, Either and Ordering

### `Maybe`
{: .no_toc}
```freest
type Maybe : *T -> *T
data Maybe a = Nothing | Just a
```

### `maybe`
{: .no_toc}
```freest
maybe : forall (a : *T) (b : *T) -> b -> (a -> b) -> Maybe a -> b
```
Consumes a `Maybe`: returns the given default on `Nothing`, or applies the
function to the contents on `Just`.

### `Either`
{: .no_toc}
```freest
type Either : *T -> *T -> *T
data Either a b = Left a | Right b
```

### `either`
{: .no_toc}
```freest
either : forall (a : *T) (b : *T) (c : 1T) -> (a -> c) -> (b -> c) -> Either a b -> c
```
Consumes an `Either`: applies the first function to a `Left`, the second to a
`Right`.

### `Ordering`
{: .no_toc}
```freest
type Ordering : *T
data Ordering = LT | EQ | GT
```

## Characters and strings

### Character conversions
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `ord` | `Char -> Int`{: .language-freest } |
| `chr` | `Int -> Char`{: .language-freest } |

### `String`
{: .no_toc}
```freest
type String : *T
type String = [Char]
```

### `show`
{: .no_toc}
```freest
show : forall (a : *T) -> a -> String
```
Renders a value as a `String`.

## Numbers

### Integer arithmetic
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `(+)` | `Int -> Int -> Int`{: .language-freest } |
| `(-)` | `Int -> Int -> Int`{: .language-freest } |
| `(*)` | `Int -> Int -> Int`{: .language-freest } |
| `(/)` | `Int -> Int -> Int`{: .language-freest } |
| `(^)` | `Int -> Int -> Int`{: .language-freest } |
| `subtract` | `Int -> Int -> Int`{: .language-freest } |
| `quot` | `Int -> Int -> Int`{: .language-freest } |
| `rem` | `Int -> Int -> Int`{: .language-freest } |
| `div` | `Int -> Int -> Int`{: .language-freest } |
| `mod` | `Int -> Int -> Int`{: .language-freest } |
| `min` | `Int -> Int -> Int`{: .language-freest } |
| `max` | `Int -> Int -> Int`{: .language-freest } |
| `gcd` | `Int -> Int -> Int`{: .language-freest } |
| `lcm` | `Int -> Int -> Int`{: .language-freest } |
| `succ` | `Int -> Int`{: .language-freest } |
| `pred` | `Int -> Int`{: .language-freest } |
| `abs` | `Int -> Int`{: .language-freest } |
| `negate` | `Int -> Int`{: .language-freest } |
| `even` | `Int -> Bool`{: .language-freest } |
| `odd` | `Int -> Bool`{: .language-freest } |

### Integer comparison
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `(<)` | `Int -> Int -> Bool`{: .language-freest } |
| `(<=)` | `Int -> Int -> Bool`{: .language-freest } |
| `(==)` | `Int -> Int -> Bool`{: .language-freest } |
| `(>=)` | `Int -> Int -> Bool`{: .language-freest } |
| `(>)` | `Int -> Int -> Bool`{: .language-freest } |
| `(/=)` | `Int -> Int -> Bool`{: .language-freest } |

### Floating-point comparison
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `(>.)` | `Float -> Float -> Bool`{: .language-freest } |
| `(<.)` | `Float -> Float -> Bool`{: .language-freest } |
| `(>=.)` | `Float -> Float -> Bool`{: .language-freest } |
| `(<=.)` | `Float -> Float -> Bool`{: .language-freest } |

### Floating-point arithmetic
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `(+.)` | `Float -> Float -> Float`{: .language-freest } |
| `(-.)` | `Float -> Float -> Float`{: .language-freest } |
| `(*.)` | `Float -> Float -> Float`{: .language-freest } |
| `(/.)` | `Float -> Float -> Float`{: .language-freest } |
| `(**)` | `Float -> Float -> Float`{: .language-freest } |
| `maxF` | `Float -> Float -> Float`{: .language-freest } |
| `minF` | `Float -> Float -> Float`{: .language-freest } |
| `logBase` | `Float -> Float -> Float`{: .language-freest } |

### Floating-point functions
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `absF` | `Float -> Float`{: .language-freest } |
| `negateF` | `Float -> Float`{: .language-freest } |
| `recip` | `Float -> Float`{: .language-freest } |
| `exp` | `Float -> Float`{: .language-freest } |
| `log` | `Float -> Float`{: .language-freest } |
| `sqrt` | `Float -> Float`{: .language-freest } |
| `log1p` | `Float -> Float`{: .language-freest } |
| `expm1` | `Float -> Float`{: .language-freest } |
| `log1pexp` | `Float -> Float`{: .language-freest } |
| `log1mexp` | `Float -> Float`{: .language-freest } |
| `sin` | `Float -> Float`{: .language-freest } |
| `cos` | `Float -> Float`{: .language-freest } |
| `tan` | `Float -> Float`{: .language-freest } |
| `asin` | `Float -> Float`{: .language-freest } |
| `acos` | `Float -> Float`{: .language-freest } |
| `atan` | `Float -> Float`{: .language-freest } |
| `sinh` | `Float -> Float`{: .language-freest } |
| `cosh` | `Float -> Float`{: .language-freest } |
| `tanh` | `Float -> Float`{: .language-freest } |

### Numeric conversions
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `truncate` | `Float -> Int`{: .language-freest } |
| `round` | `Float -> Int`{: .language-freest } |
| `ceiling` | `Float -> Int`{: .language-freest } |
| `floor` | `Float -> Int`{: .language-freest } |
| `pi` | `Float`{: .language-freest } |
| `fromInteger` | `Int -> Float`{: .language-freest } |

## General-purpose functions

### `id`
{: .no_toc}
```freest
id : forall (a : 1T) -> a -> a
```
The identity function. Returns the exact same value.
```freest
id 5       -- 5
id "Hello" -- "Hello"
```

### `const`
{: .no_toc}
```freest
const : forall (a : *T) (b : *T) -> a -> b -> a
```
Returns its first argument and ignores its second.

### `(.)`
{: .no_toc}
```freest
(.) : forall #m #n (a : 1T) (b : 1T) (c : 1T) -> (b -m-> c) -> (a -n-> b) -m-> a -m+n-> c
```
Function composition: `(f . g) x` is `f (g x)`.

### `flip`
{: .no_toc}
```freest
flip : forall #m #n #o (a : 1T) (b : m T) (c : 1T) -> (a -n-> b -o-> c) -> b -n-> a -m+n-> c
```
Swaps the order of the first two parameters of a function.

### `($)`
{: .no_toc}
```freest
($) : forall #m (a : 1T) (b : 1T) -> (a -m-> b) -> a -m-> b
```
Application operator. Takes a function and an argument, and applies the first to
the latter. This operator has low right-associative binding precedence, allowing
parentheses to be omitted in certain situations. For example:
```freest
f $ g $ h x = f (g (h x))
```

### `(|>)`
{: .no_toc}
```freest
(|>) : forall #m #n (a : m T) (b : 1T) -> a -> (a -n-> b) -m-> b
```
Reverse application operator. Provides notational convenience, especially when
chaining channel operations. For example:
```freest
f : !Int ; !Bool ; Close -> ()
f c = c |> send 5 |> send True |> close
```

### `until`
{: .no_toc}
```freest
until : forall (a : *T) -> (a -> Bool) -> (a -> a) -> a -> a
```
Applies the function passed as the second argument to the third one and uses the
predicate in the first argument to evaluate the result: if it comes as `True` it
returns it, otherwise it continues to apply the function on previous results
until the predicate evaluates to `True`.
```freest
-- | First base 2 power greater than a given limit
firstPowerGreaterThan : Int -> Int
firstPowerGreaterThan limit = until @Int (> limit) (*2) 1
```

### `(;)`
{: .no_toc}
```freest
(;) : forall (a : *T) (b : 1T) -> a -> b -> b
```
Sequential composition. Takes two expressions, evaluates the former and discards
the result, then evaluates the latter. For example, `3 ; 4` evaluates to `4`.

### `fix`
{: .no_toc}
```freest
fix : forall (a : *T) -> ((a -> a) -> (a -> a)) -> (a -> a)
```
Fixed-point Z combinator.

## Tuples

### `fst`
{: .no_toc}
```freest
fst : forall (a : 1T) (b : *T) -> (a, b) -> a
```
Extracts the first element from a pair, discarding the second.

### `snd`
{: .no_toc}
```freest
snd : forall (a : *T) (b : 1T) -> (a, b) -> b
```
Extracts the second element from a pair, discarding the first.

### `swap`
{: .no_toc}
```freest
swap : forall (a : 1T) (b : 1T) -> (a, b) -> (b, a)
```
Swaps the components of a pair. The expression `swap (1, True)` evaluates to
`(True, 1)`.

### `curry`
{: .no_toc}
```freest
curry : forall (a : *T) (b : 1T) (c : 1T) -> ((a, b) -> c) -> a -> b -> c
```
Converts a function that receives a pair into a function that receives its
arguments one at a time.

### `uncurry`
{: .no_toc}
```freest
uncurry : forall (a : 1T) (b : 1T) (c : 1T) -> (a -> b -> c) -> ((a, b) -> c)
```
Converts a function that receives its arguments one at a time into a function on
pairs.

## Lists

### `(++)`
{: .no_toc}
```freest
(++) : forall #m (a : m T) -> [a] -> [a] -m-> [a]
```
Appends two lists.

### `head`
{: .no_toc}
```freest
head : forall (a : *T) -> [a] -> a
```
The first element of a list. Errors on the empty list.

### `last`
{: .no_toc}
```freest
last : forall (a : *T) -> [a] -> a
```
The last element of a list. Errors on the empty list.

### `tail`
{: .no_toc}
```freest
tail : forall (a : *T) -> [a] -> [a]
```
Every element of a list except the first. Errors on the empty list.

### `init`
{: .no_toc}
```freest
init : forall (a : *T) -> [a] -> [a]
```
Every element of a list except the last. Errors on the empty list.

### `length`
{: .no_toc}
```freest
length : forall (a : *T) -> [a] -> Int
```
The number of elements in a list.

## Errors

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `undefined` | `forall (a : *T) -> a`{: .language-freest } |
| `error` | `forall (a : *T) -> String -> a`{: .language-freest } |

## Concurrency and channels

### `fork`
{: .no_toc}
```freest
fork : forall #m (a : *T) -> (() -m-> a) -> ()
```
Spawns a thunk as a new thread.

### `send`
{: .no_toc}
```freest
send : forall (a : 1T) -> a -> forall (b : 1S) -> !a;b -1-> b
```
Sends a value on a channel. Returns the continuation channel.

### `receive`
{: .no_toc}
```freest
receive : forall (a : 1T) (b : 1S) -> ?a;b -> (a, b)
```
Receives a value on a channel. Returns the received value and the continuation
channel.

### `wait`
{: .no_toc}
```freest
wait : Wait -> ()
```
Waits for a channel to be closed.

### `close`
{: .no_toc}
```freest
close : Close -> ()
```
Closes a channel.

### `sendAndWait`
{: .no_toc}
```freest
sendAndWait : forall (a : 1T) -> a -> !a ; Wait -1-> ()
```
Sends a value on a given channel and then waits for the channel to be closed.
Returns ().

### `sendAndClose`
{: .no_toc}
```freest
sendAndClose : forall (a : 1T) -> a -> !a ; Close -1-> ()
```
Sends a value on a given channel and then closes the channel. Returns ().

### `receiveAndWait`
{: .no_toc}
```freest
receiveAndWait : forall (a : 1T) -> ?a ; Wait -> a
```
Receives a value from a channel that continues to `Wait`, closes the
continuation and returns the value.

```freest
main : ()
main =
  -- create channel endpoints
  let (c, s) = new @(?String ; Wait) () in
  -- fork a thread that prints the received value (and closes the channel)
  fork (\(_ : ()) -1-> c |> receiveAndWait @String |> putStrLn);
  -- send a string through the channel (and close it)
  s |> send "Hello!" |> close
```

### `receiveAndClose`
{: .no_toc}
```freest
receiveAndClose : forall (a : 1T) -> ?a ; Close -> a
```
As in receiveAndWait only that the type is Wait and the function closes the
channel rather the waiting for the channel to be closed.

### `readApply`
{: .no_toc}
```freest
readApply : forall (a : *T) (b : 1S) -> (a -> ()) {- Consumer a -} -> ?a ; b -1-> b
```
Receives a value from a linear channel and applies a function to it. Discards the
result and returns the continuation channel.

```freest
main : ()
main =
  -- create channel endpoints
  let (c, s) = new @(?String ; Wait) () in
  -- fork a thread that prints the received value (and closes the channel)
  fork (\_:() -1-> c |> readApply @String @End putStrLn |> wait);
  -- send a string through the channel (and close it)
  s |> send "Hello!" |> close
```

### `send_`
{: .no_toc}
```freest
send_ : forall (a : 1T) -> a -> *!a -1-> ()
```
Sends a value on a star channel. Unrestricted version of `send`.

### `receive_`
{: .no_toc}
```freest
receive_ : forall (a : 1T) -> *?a -> a
```
Receives a value from a star channel. Unrestricted version of `receive`.

### `accept`
{: .no_toc}
```freest
accept : forall (a : 1C) -> *!a -> Dual a
```
Session initiation. Accepts a request for a linear session on a shared channel.
The requester uses a conventional `receive` to obtain the channel end.

### `forkWith`
{: .no_toc}
```freest
forkWith : forall #m (a : 1C) (b : *T) -> (Dual a -m-> b) -> a
```
Creates a new child process and a channel through which it can communicate with
its parent process. Returns the channel endpoint.

```freest
main : ()
main =
  -- fork a thread that receives a string and prints
  let c = forkWith @(!String ; Wait) @() (\s:(?String ; End) -1-> s |> receiveAndWait @String |> putStrLn) in
  -- send the string to be printed
  c |> send "Hello!" |> wait
```

### `runServer`
{: .no_toc}
```freest
runServer : forall (a : 1C) (b : *T) -> (b -> Dual a -1-> b) -> b -> *!a -> Void @*T
```
Runs an infinite shared server thread given a function to serve a client (a
handle), the initial state, and the server's shared channel endpoint. It can be
seen as an infinite sequential application of the handle function over a newly
accepted session, while continuously updating the state.

Note: this only works with session types that use session initiation.

```freest
type SharedCounter : *S = *?Counter
type Counter : 1S = +{ Inc: Close
                     , Dec: Close
                     , Get: ?Int ; Close
                     }

-- | Handler for a counter
counterService : Int -> dualof Counter -1-> Int
counterService i (Inc c) = wait c ; i + 1 
counterService i (Dec c) = wait c ; i - 1
counterService i (Get c) = c |> send i |> wait ; i

-- | Counter server
runCounterServer : dualof SharedCounter -> Diverge
runCounterServer = runServer @Counter @Int counterService 0 
```

### `sink`
{: .no_toc}
```freest
sink : forall (a : *T) -> a -> ()
```
Discards an unrestricted value.

### `repeat`
{: .no_toc}
```freest
repeat : forall (a : *T) -> Int -> (() -> a) -> ()
```
Executes a thunk n times, sequentially.

```freest
main : ()
main = 
  -- print "Hello!" 5 times sequentially
  repeat @() 5 (\_:() -> putStrLn "Hello!")
```

### `parallel`
{: .no_toc}
```freest
parallel : forall (a : *T) -> Int -> (() -> a) -> ()
```
Forks n identical threads. Works the same as a `repeat` call but in parallel
instead of sequentially.

```freest
main : ()
main = 
  -- print "Hello!" 5 times in parallel
  parallel @() 5 (\_:() -> putStrLn "Hello!")
```

## Input and output streams

### `InStream`
{: .no_toc}
```freest
type InStream : 1C
type InStream = +{ GetChar: ?Char   ; InStream
                 , GetLine: ?String ; InStream
                 , IsEOF  : ?Bool   ; InStream
                 , SWait  : Wait
                 }
```

The `InStream` type describes input streams (such as `stdin` and read files).
`GetChar` reads a single character, `GetLine` reads a line, and `IsEOF` checks
for the EOF (End-Of-File) token, i.e., if an input stream reached the end.
Operations in this channel end with the `SWait` option.

### `InStreamProvider`
{: .no_toc}
```freest
type InStreamProvider : *C
type InStreamProvider = *?InStream
```

Unrestricted session type for the `OutStream` type.

### `hCloseIn`
{: .no_toc}
```freest
hCloseIn : InStream -> ()
```
Closes an `InStream` channel endpoint. Behaves as a `close`.

### `hGetChar`
{: .no_toc}
```freest
hGetChar : InStream -> (Char, InStream)
```
Reads a character from an `InStream` channel endpoint. Behaves as 
`|> select GetChar |> receive`.

### `hGetLine`
{: .no_toc}
```freest
hGetLine : InStream -> (String, InStream)
```
Reads a line (as a string) from an `InStream` channel endpoint. Behaves as 
`|> select GetLine |> receive`.

### `hIsEOF`
{: .no_toc}
```freest
hIsEOF : InStream -> (Bool, InStream)
```
Checks if an `InStream` reached the EOF token that marks where no more input can be read. 
Does the same as `|> select IsEOF |> receive`.

### `hGetContent`
{: .no_toc}
```freest
hGetContent : InStream -> (String, InStream)
```
Reads the entire content from an `InStream` (i.e. until EOF is reached). Returns the content
as a single string and the continuation channel.

### `hGetChar_`
{: .no_toc}
```freest
hGetChar_ : InStreamProvider -> Char
```
Unrestricted version of `hGetChar`. Behaves the same, except it first receives an `InStream` 
channel endpoint (via session initiation), executes an `hGetChar` and then closes the 
enpoint with `hCloseIn`.

### `hGetLine_`
{: .no_toc}
```freest
hGetLine_ : InStreamProvider -> String
```
Unrestricted version of `hGetLine`. Behaves the same, except it first receives an `InStream` 
channel endpoint (via session initiation), executes an `hGetLine` and then closes the 
enpoint with `hCloseIn`.

### `hGetContent_`
{: .no_toc}
```freest
hGetContent_ : InStreamProvider -> String
```
Unrestricted version of `hGetContent`. Behaves the same, except it first receives an `InStream`
channel endpoint (via session initiation), executes an `hGetContent` and then closes the
endpoint with `hCloseIn`.

### `OutStream`
{: .no_toc}
```freest
type OutStream : 1C
type OutStream = +{ PutChar : !Char ; OutStream
                  , PutStr  : !String ; OutStream
                  , PutStrLn: !String ; OutStream
                  , SWait   : Wait
                  }
```

The `OutStream` type describes output streams (such as `stdout`, `stderr` and
write mode files). `PutChar` outputs a character, `PutStr` outputs a string, and
`PutStrLn` outputs a string followed by the newline character (`\n`). Operations
in this channel must end with the `Close` option.

### `OutStreamProvider`
{: .no_toc}
```freest
type OutStreamProvider : *C
type OutStreamProvider = *?OutStream
```

Unrestricted session type for the `OutStream` type.

### `hCloseOut`
{: .no_toc}
```freest
hCloseOut : OutStream -> ()
```
Closes an `OutStream` channel endpoint. Behaves as a `close`.

### `hPutChar`
{: .no_toc}
```freest
hPutChar : Char -> OutStream -> OutStream
```
Sends a character through an `OutStream` channel endpoint. Behaves as 
`|> select PutChar |> send`.

### `hPutStr`
{: .no_toc}
```freest
hPutStr : String -> OutStream -> OutStream
```
Sends a String through an `OutStream` channel endpoint. Behaves as 
`|> select PutString |> send`.

### `hPutStrLn`
{: .no_toc}
```freest
hPutStrLn : String -> OutStream -> OutStream
```
Sends a string through an `OutStream` channel endpoint, to be output with
the newline character. Behaves as `|> select PutStringLn |> send`.

### `hPrint`
{: .no_toc}
```freest
hPrint : forall (a : *T) -> a -> OutStream -> OutStream
```
Sends the string representation of a value through an `OutStream` channel
endpoint, to be outputed with the newline character. Behaves as `hPutStrLn
(show @t v)`, where `v` is the value to be sent and `t` its type.

### `hPutChar_`
{: .no_toc}
```freest
hPutChar_ : Char -> OutStreamProvider -> ()
```
Unrestricted version of `hPutChar`. Behaves the same, except it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPutChar` and then closes the enpoint with `hCloseOut`.

### `hPutStr_`
{: .no_toc}
```freest
hPutStr_ : String -> OutStreamProvider -> ()
```
Unrestricted version of `hPutStr`. Behaves similarly, except that it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPutStr` and then closes the enpoint with `hCloseOut`.

### `hPutStrLn_`
{: .no_toc}
```freest
hPutStrLn_ : String -> OutStreamProvider -> ()
```
Unrestricted version of `hPutStrLn`. Behaves similarly, except that it
first receives an `OutStream` channel endpoint (via session initiation),
executes an `hPutStrLn` and then closes the enpoint with `hCloseOut`.

### `hPrint_`
{: .no_toc}
```freest
hPrint_ : forall (a : *T) -> a -> OutStreamProvider -> ()
```
Unrestricted version of `hPrint`. Behaves similarly, except that it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPrint` and then closes the enpoint with `hCloseOut`.

## Standard input and output

{: .lib-table}
| Function | Type | Description |
|:---------|:-----|:------------|
| `stdin` | `InStreamProvider`{: .language-freest } | Standard input stream. Reads from the console. |
| `getChar` | `() -> Char`{: .language-freest } | Reads a single character from `stdin`. |
| `getLine` | `() -> String`{: .language-freest } | Reads a single line from `stdin`. |
| `stdout` | `OutStreamProvider`{: .language-freest } | Standard output stream. Prints to the console. |
| `putChar` | `Char -> ()`{: .language-freest } | Prints a character to `stdout`. Behaves the same as `hPutChar_ c stdout`, where `c` is the character to be printed. |
| `putStr` | `String -> ()`{: .language-freest } | Prints a string to `stdout`. Behaves the same as `hPutStr_ s stdout`, where `s` is the string to be printed. |
| `putStrLn` | `String -> ()`{: .language-freest } | Prints a string to `stdout`, followed by the newline character `\n`. Behaves as `hPutStrLn_ s stdout`, where `s` is the string to be printed. |
| `print` | `forall (a : *T) -> a -> ()`{: .language-freest } | Prints the string representation of a given value to `stdout`, followed by the newline character `\n`. Behaves the same as `hPrint_ @t v stdout`, where `v` is the value to be printed and `t` its type. |
