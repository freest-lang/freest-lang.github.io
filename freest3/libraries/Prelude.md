---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Prelude
layout: default
nav_order: 1
parent: Libraries
grand_parent: FreeST3
---

# Prelude
{: .no_toc}

<div class="lib-note" markdown="1">
The **Prelude** is FreeST's standard library. Its types and functions are in
scope in every program, with no import required — everything listed on this
page is available by default.

The terse arithmetic, logic and text operators are collected into tables below;
the more involved combinators, channel operations and stream types each get
their own entry with a description and, where useful, a worked example.
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

## Arithmetic

### Integer arithmetic
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `{freest} (+)` | `Int -> Int -> Int` |
| `(-)` | `Int -> Int -> Int` |
| `(*)` | `Int -> Int -> Int` |
| `(/)` | `Int -> Int -> Int` |
| `div` | `Int -> Int -> Int` |
| `(^)` | `Int -> Int -> Int` |
| `mod` | `Int -> Int -> Int` |
| `rem` | `Int -> Int -> Int` |
| `max` | `Int -> Int -> Int` |
| `min` | `Int -> Int -> Int` |
| `quot` | `Int -> Int -> Int` |
| `gcd` | `Int -> Int -> Int` |
| `lcm` | `Int -> Int -> Int` |
| `subtract` | `Int -> Int -> Int` |
| `succ` | `Int -> Int` |
| `pred` | `Int -> Int` |
| `abs` | `Int -> Int` |
| `negate` | `Int -> Int` |
| `even` | `Int -> Bool` |
| `odd` | `Int -> Bool` |

### Integer comparison
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `(==)` | `Int -> Int -> Bool` |
| `(/=)` | `Int -> Int -> Bool` |
| `(<)` | `Int -> Int -> Bool` |
| `(>)` | `Int -> Int -> Bool` |
| `(<=)` | `Int -> Int -> Bool` |
| `(>=)` | `Int -> Int -> Bool` |

### Floating-point arithmetic and comparison
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `(+.)` | `Float -> Float -> Float` |
| `(-.)` | `Float -> Float -> Float` |
| `(*.)` | `Float -> Float -> Float` |
| `(/.)` | `Float -> Float -> Float` |
| `(>.)` | `Float -> Float -> Float` |
| `(<.)` | `Float -> Float -> Float` |
| `(>=.)` | `Float -> Float -> Float` |
| `(<=.)` | `Float -> Float -> Float` |
| `absF` | `Float -> Float` |
| `negateF` | `Float -> Float` |
| `maxF` | `Float -> Float -> Float` |
| `minF` | `Float -> Float -> Float` |
| `recip` | `Float -> Float` |

### Floating-point functions
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `pi` | `Float` |
| `exp` | `Float -> Float` |
| `log` | `Float -> Float` |
| `sqrt` | `Float -> Float` |
| `(**)` | `Float -> Float -> Float` |
| `logBase` | `Float -> Float -> Float` |
| `sin` | `Float -> Float` |
| `cos` | `Float -> Float` |
| `tan` | `Float -> Float` |
| `asin` | `Float -> Float` |
| `acos` | `Float -> Float` |
| `atan` | `Float -> Float` |
| `sinh` | `Float -> Float` |
| `cosh` | `Float -> Float` |
| `tanh` | `Float -> Float` |
| `log1p` | `Float -> Float` |
| `expm1` | `Float -> Float` |
| `log1pexp` | `Float -> Float` |
| `log1mexp` | `Float -> Float` |

### Numeric conversions
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `truncate` | `Float -> Int` |
| `round` | `Float -> Int` |
| `ceiling` | `Float -> Int` |
| `floor` | `Float -> Int` |
| `fromInteger` | `Int -> Float` |

## Booleans, characters and strings

### Booleans
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `(&&)` | `Bool -> Bool -> Bool` |
| <code>(&#124;&#124;)</code> | `Bool -> Bool -> Bool` |

### Characters
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `ord` | `Char -> Int` |
| `chr` | `Int -> Char` |

### Strings
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `(^^)` | `String -> String -> String` |

### Showing and reading values
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `show` | `forall a:*T . a -> String` |
| `readBool` | `String -> Bool` |
| `readInt` | `String -> Int` |
| `readChar` | `String -> Char` |

## General-purpose functions

### `Bool`
{: .no_toc}
```freest
data Bool = True | False 
```

### `not`
{: .no_toc}
```freest
not : Bool -> Bool
```
Boolean complement

### `id`
{: .no_toc}
```freest
id : forall a:*T . a -> a
```
The identity function. Will return the exact same value.
```freest
id 5       -- 5
id "Hello" -- "Hello"
```

### `flip`
{: .no_toc}
```freest
flip : forall a:*T b:*T c:*T . (a -> b -> c) -> b -> a -> c
```
Swaps the order of parameters to a function
```freest
 -- | Check if the integer is positive and the boolean is true
 test : Int -> Bool -> Bool
 test i b = i > 0 && b
 
 -- | Flipped version of function 'test'
 flippedTest : Bool -> Int -> Bool
 flippedTest = flip @Int @Bool @Bool test
 ```

### `($)`
{: .no_toc}
```freest
($) : forall a:*T b:*T. (a -> b) -> a -> b
```
Application operator. Takes a function and an argument, and applies 
the first to the latter. This operator has low right-associative binding 
precedence, allowing parentheses to be omitted in certain situations.
For example:
```freest
f $ g $ h x = f (g (h x))
```

### `(|>)`
{: .no_toc}
```freest
(|>) : forall a:*T b:*T. a -> (a -> b) -> b
```
Reverse application operator. Provides notational convenience, especially
when chaining channel operations. For example:
```freest
f : !Int ; !Bool ; Close -> () 
f c = c |> send 5 |> send True |> close
```
Its binding precedence is higher than `$`.

### `(;)`
{: .no_toc}
```freest
(;) : forall a:*T b:*T . a -> b -> b
```
Sequential composition. Takes two expressions, evaluates the former and
discards the result, then evaluates the latter. For example:
```freest
3 ; 4
```
evaluates to 4.
Its binding precedence is rather low.

### `until`
{: .no_toc}
```freest
until : forall a:*T . (a -> Bool) -> (a -> a) -> a -> a
```
Applies the function passed as the second argument to the third one and
uses the predicate in the first argument to evaluate the result, if it comes
as True it returns it, otherwise, it continues to apply the function on
previous results until the predicate evaluates to True.

```freest
-- | First base 2 power greater than a given limit
firstPowerGreaterThan : Int -> Int
firstPowerGreaterThan limit = until @Int (> limit) (*2) 1
```  

### `curry`
{: .no_toc}
```freest
curry : forall a:*T b:*T c:*T . ((a, b) -> c) -> a -> b -> c
```
Converts a function that receives a pair into a function that receives its
arguments one at a time.

```freest
-- | Sums the elements of a pair of integers
sumPair : (Int, Int) -> Int
sumPair p = let (x, y) = p in x + y

-- | Regular sum
sum : Int -> Int -> Int
sum = curry @Int @Int @Int sumPair
```

### `uncurry`
{: .no_toc}
```freest
uncurry : forall a:*T b:*T c:*T . (a -> b -> c) -> ((a, b) -> c)
```
Converts a function that receives its arguments one at a time into a
function on pairs.

```freest
-- | Sums the elements of a pair of integers
sumPair : (Int, Int) -> Int
sumPair = uncurry @Int @Int @Int (+)
```

### `swap`
{: .no_toc}
```freest
swap : forall a:*T b:*T . (a, b) -> (b, a)
```
Swaps the components of a pair. The expression `swap (1, True)` evaluates to
`(True, 1)`.

### `fix`
{: .no_toc}
```freest
fix : forall a:*T . ((a -> a) -> (a -> a)) -> (a -> a)
```
Fixed-point Z combinator

### `fst`
{: .no_toc}
```freest
fst : forall a:1T b:*T . (a, b) -> a
```
Extracts the first element from a pair, discarding the second.

### `snd`
{: .no_toc}
```freest
snd : forall a:*T b:1T . (a, b) -> b
```
Extracts the second element from a pair, discarding the first.

### Partial functions
{: .no_toc}

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `error` | `forall a:*T . String -> a` |
| `undefined` | `forall a:*T . a` |

## Channels and concurrency

### `new`
{: .no_toc}
```freest
new : forall a:1A . () -> (a, dualof a)
```
Creates two endpoints of a channels of the given type.

### `send`
{: .no_toc}
```freest
send : forall a:1T . a -> forall b:1S . !a ; b 1-> b
```
Sends a value on a channel. Returns the continuation channel

### `receive`
{: .no_toc}
```freest
receive : forall a:1T b:1S . ?a ; b -> (a, b)
```
Receives a value on a channel. Returns the received value and 
the continuation channel.

### `close`
{: .no_toc}
```freest
close : Close -> ()
```
Closes a channel.

### `wait`
{: .no_toc}
```freest
wait : Wait -> ()
```
Waits for a channel to be closed.

### `fork`
{: .no_toc}
```freest
fork : forall a:*T. (() 1-> a) -> ()
```

### `Diverge`
{: .no_toc}
```freest
type Diverge = ()
```

A mark for functions that do not terminate

### `sink`
{: .no_toc}
```freest
sink : forall a:*T . a -> ()
```
Discards an unrestricted value

### `repeat`
{: .no_toc}
```freest
repeat : forall a:*T . Int -> (() -> a) -> ()
```
Executes a thunk n times, sequentially

```freest
main : ()
main = 
  -- print "Hello!" 5 times sequentially
  repeat @() 5 (\_:() -> putStrLn "Hello!")
```

### `parallel`
{: .no_toc}
```freest
parallel : forall a:*T . Int -> (() -> a) -> ()
```
Forks n identical threads. Works the same as a `repeat` call but in parallel
instead of sequentially.

```freest
main : ()
main = 
  -- print "Hello!" 5 times in parallel
  parallel @() 5 (\_:() -> putStrLn "Hello!")
```

### `receiveAndWait`
{: .no_toc}
```freest
receiveAndWait : forall a:1T . ?a ; Wait -> a
```
Receives a value from a linear channel and applies a function to it.
Discards the result and returns the continuation channel.

```freest
main : ()
main =
  -- create channel endpoints
  let (c, s) = new @(?String ; Wait) () in
  -- fork a thread that prints the received value (and closes the channel)
  fork (\_:() 1-> c |> readApply @String @End putStrLn |> wait);
  -- send a string through the channel (and close it)
  s |> send "Hello!" |> close
```
Receives a value from a channel that continues to `Wait`, closes the 
continuation and returns the value.

```freest
main : ()
main =
  -- create channel endpoints
  let (c, s) = new @(?String ; Wait) () in
  -- fork a thread that prints the received value (and closes the channel)
  fork (\_:() 1-> c |> receiveAndWait @String |> putStrLn);
  -- send a string through the channel (and close it)
  s |> send "Hello!" |> close
```

### `receiveAndClose`
{: .no_toc}
```freest
receiveAndClose : forall a:1T . ?a ; Close -> a
```
As in receiveAndWait only that the type is Close and the function closes the
channel rather the waiting for the channel to be closed.

### `sendAndWait`
{: .no_toc}
```freest
sendAndWait : forall a:1T . a -> !a ; Wait 1-> ()
```
Sends a value on a given channel and then waits for the channel to be
closed. Returns ().

### `sendAndClose`
{: .no_toc}
```freest
sendAndClose : forall a:1T . a -> !a ; Close 1-> ()
```
Sends a value on a given channel and then closes the channel.
Returns ().

### `receive_`
{: .no_toc}
```freest
receive_ : forall a:1T . *?a -> a
```
Receives a value from a star channel. Unrestricted version of `receive`.

### `send_`
{: .no_toc}
```freest
send_ : forall a:1T . a -> *!a 1-> ()
```
Sends a value on a star channel. Unrestricted version of `send`.

### `accept`
{: .no_toc}
```freest
accept : forall a:1A . *!a -> dualof a
```
Session initiation. Accepts a request for a linear session on a shared
channel. The requester uses a conventional `receive` to obtain the channel
end.

### `forkWith`
{: .no_toc}
```freest
forkWith : forall a:1A b . (dualof a 1-> b) -> a
```
Creates a new child process and a channel through which it can
communicate with its parent process. Returns the channel endpoint.

```freest
main : ()
main =
  -- fork a thread that receives a string and prints
  let c = forkWith @(!String ; Wait) @() (\s:(?String ; End) 1-> s |> receiveAndWait @String |> putStrLn) in
  -- send the string to be printed
  c |> send "Hello!" |> wait
```

### `runServer`
{: .no_toc}
```freest
runServer : forall a:1A b:*T . (b -> dualof a 1-> b) -> b -> *!a -> Diverge
```
Runs an infinite shared server thread given a function to serve a client (a
handle), the initial state, and the server's shared channel endpoint. It can
be seen as an infinite sequential application of the handle function over a
newly accepted session, while continuously updating the state.
  
Note: this only works with session types that use session initiation.

```freest
type SharedCounter : *S = *?Counter
type Counter : 1S = +{ Inc: Wait
                     , Dec: Wait
                     , Get: ?Int ; Wait
                     }

-- | Handler for a counter
counterService : Int -> dualof Counter 1-> Int
counterService i (Inc c) = close c ; i + 1 
counterService i (Dec c) = close c ; i - 1
counterService i (Get c) = c |> send i |> close ; i

-- | Counter server
runCounterServer : dualof SharedCounter -> Diverge
runCounterServer = runServer @Counter @Int counterService 0 
```

## Output and input streams

### `OutStream`
{: .no_toc}
```freest
type OutStream : 1S = +{ PutChar : !Char ; OutStream
                       , PutStr  : !String ; OutStream
                       , PutStrLn: !String ; OutStream
                       , SClose  : Close
                       }
```

The `OutStream` type describes output streams (such as `stdout`, `stderr`
and write mode files). `PutChar` outputs a character, `PutStr` outputs a string,
and `PutStrLn` outputs a string followed by the newline character (`\n`).
Operations in this channel must end with the `Close` option.

### `OutStreamProvider`
{: .no_toc}
```freest
type OutStreamProvider : *S = *?OutStream
```

Unrestricted session type for the `OutStream` type.

### `InStream`
{: .no_toc}
```freest
type InStream : 1S = +{ GetChar: ?Char   ; InStream
                      , GetLine: ?String ; InStream
                      , IsEOF  : ?Bool   ; InStream
                      , SWait  : Wait
                      }
```

The `InStream` type describes input streams (such as `stdin` and read
files). `GetChar` reads a single character, `GetLine` reads a line, and
`IsEOF` checks for the EOF (End-Of-File) token, i.e., if an input stream
reached the end. Operations in this channel end with the `SWait` option.

### `InStreamProvider`
{: .no_toc}
```freest
type InStreamProvider : *S = *?InStream
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
hPrint : forall a:*T . a -> OutStream -> OutStream
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
hPrint_ : forall a:*T . a -> OutStreamProvider -> ()
```
Unrestricted version of `hPrint`. Behaves similarly, except that it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPrint` and then closes the enpoint with `hCloseOut`.

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

## Standard IO

{: .lib-table}
| Function | Type | Description |
|:---------|:-----|:------------|
| `stdout` | `OutStreamProvider` | Standard output stream. Prints to the console. |
| `putChar` | `Char -> ()` | Prints a character to `stdout`. Behaves the same as `hPutChar_ c stdout`, where `c` is the character to be printed. |
| `putStr` | `String -> ()` | Prints a string to `stdout`. Behaves the same as `hPutStr_ s stdout`, where `s` is the string to be printed. |
| `putStrLn` | `String -> ()` | Prints a string to `stdout`, followed by the newline character `\n`. Behaves as `hPutStrLn_ s stdout`, where `s` is the string to be printed. |
| `print` | `forall a:*T . a -> ()` | Prints the string representation of a given value to `stdout`, followed by the newline character `\n`. Behaves the same as `hPrint_ @t v stdout`, where `v` is the value to be printed and `t` its type. |
| `stderr` | `OutStreamProvider` | Standard error stream. Prints to the console. |
| `stdin` | `InStreamProvider` | Standard input stream. Reads from the console. |
| `getChar` | `Char` | Reads a single character from `stdin`. |
| `getLine` | `String` | Reads a single line from `stdin`. |

## File types

### `FilePath`
{: .no_toc}
```freest
type FilePath = String
```

File paths.

### `FileHandle`
{: .no_toc}
```freest
data FileHandle = FileHandle ()
```

### `IOMode`
{: .no_toc}
```freest
data IOMode = ReadMode | WriteMode | AppendMode
```
