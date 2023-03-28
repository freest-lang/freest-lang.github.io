---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Prelude
layout: default
nav_order: 1
parent: Documentation
---

# Table of contents
{: .no_toc}

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>


# **Builtin**
## **new**
**Type**: `forall a:1S . () -> (a, dualof a)`

Creates two endpoints of a channels of the given type.
## **send**
**Type**: `forall a:1T . a -> forall b:1S . !a;b 1-> b`

Sends a value on a channel. Returns the continuation channel.
## **receive**
**Type**: `forall a:1T b:1S . ?a;b -> (a, b)`

Receives a value on a channel. Returns the received value and 
the continuation channel.
## **close**
**Type**: `End -> ()`

Closes a channel.

# **Base**
## **Bool**
**Type**: 
```
data Bool = True | False 
```

Bool 
## **not**
**Type**: `Bool -> Bool`

Boolean complement
## **id**
**Type**: `forall a:*T . a -> a`

The identity function. Will return the exact same value.
```
id 5       -- 5
id "Hello" -- "Hello"
```
## **flip**
**Type**: `forall a:*T b:*T c:*T . (a -> b -> c) -> b -> a -> c`

Swaps the order of parameters to a function
```
 -- | Check if the integer is positive and the boolean is true
 test : Int -> Bool -> Bool
 test i b = i > 0 && b
 
 -- | Flipped version of function 'test'
 flippedTest : Bool -> Int -> Bool
 flippedTest = flip @Int @Bool @Bool test
 ```
## **($)**
**Type**: `forall a:*T b:*T. (a -> b) -> a -> b`

Application operator. Takes a function and an argument, and applies 
the first to the latter. This operator has low right-associative binding 
precedence, allowing parentheses to be omitted in certain situations.
For example:
```
f $ g $ h x = f (g (h x))
```
## **(|>)**
**Type**: `forall a:*T b:*T. a -> (a -> b) -> b`

Reverse application operator. Provides notational convenience, especially
when chaining channel operations. For example:
```
let (w,r) = !Int;!Bool;End in 
w |> send 5 |> send True |> close;
c |> receive |> receiveAndClose
```
Its binding precedence is higher than `$`.
## **until**
**Type**: `forall a:*T . (a -> Bool) -> (a -> a) -> a -> a`

Applies the function passed as the second argument to the third one and
uses the predicate in the first argument to evaluate the result, if it comes
as True it returns it, otherwise, it continues to apply the function on
previous results until the predicate evaluates to True.

```
-- | First base 2 power greater than a given limit
firstPowerGreaterThan : Int -> Int
firstPowerGreaterThan limit = until @Int (> limit) (*2) 1
```  
## **curry**
**Type**: `forall a:*T b:*T c:*T . ((a, b) -> c) -> a -> b -> c`

Converts a function that receives a pair into a function that receives its
arguments one at a time.

```
-- | Sums the elements of a pair of integers
sumPair : (Int, Int) -> Int
sumPair p = let (x, y) = p in x + y

-- | Regular sum
sum : Int -> Int -> Int
sum = curry @Int @Int @Int sumPair
```
## **uncurry**
**Type**: `forall a:*T b:*T c:*T . (a -> b -> c) -> ((a, b) -> c)`

Converts a function that receives its arguments one at a time into a
function on pairs.

```
-- | Sums the elements of a pair of integers
sumPair : (Int, Int) -> Int
sumPair = uncurry @Int @Int @Int (+)
```
## **swap**
**Type**: `forall a:*T b:*T . (a, b) -> (b, a)`

Swaps the components of a pair. The expression `swap (1, True)` evaluates to
`(True, 1)`.
## **fix**
**Type**: `forall a:*T . ((a -> a) -> (a -> a)) -> (a -> a)`

Fixed-point Z combinator
## **fst**
**Type**: `forall a:1T b:*T . (a, b) -> a`

Extracts the first element from a pair, discarding the second.
## **snd**
**Type**: `forall a:*T b:1T . (a, b) -> b`

Extracts the second element from a pair, discarding the first.

# **Concurrency and channels**
## **Diverge**
**Type**: 
```
type Diverge = ()
```

A mark for functions that do not terminate
## **sink**
**Type**: `forall a:*T . a -> ()`

Discards an unrestricted value
## **repeat**
**Type**: `forall a:*T . Int -> (() -> a) -> ()`

Executes a thunk n times, sequentially

```
main : ()
main = 
    -- print "Hello!" 5 times sequentially
    repeat @() 5 (\_:() -> putStrLn "Hello!")
```
## **parallel**
**Type**: `forall a:*T . Int -> (() -> a) -> ()`

Forks n identical threads. Works the same as a `repeat` call but in parallel
instead of sequentially.

```
main : ()
main = 
    -- print "Hello!" 5 times in parallel
    parallel @() 5 (\_:() -> putStrLn "Hello!")
```
## **consume**
**Type**: `forall a:*T b:1S . (a -> ()) {- Consumer a -} -> ?a;b 1-> b`

Receives a value from a linear channel and applies a function to it.
Returns the continuation channel

```
main : ()
main =
    -- create channel endpoints
    let (c, s) = new @(?String; End) () in
    -- fork a thread that prints the received value (and closes the channel)
    fork (\_:() 1-> c |> consume @String @End putStrLn |> close);
    -- send a string through the channel (and close it)
    s |> send "Hello!" |> close
```
## **receiveAndClose**
**Type**: `forall a:1T . ?a;End -> a`

Receives a value from a channel that continues to `End`, closes the 
continuation and returns the value.

```
main : ()
main =
    -- create channel endpoints
    let (c, s) = new @(?String; End) () in
    -- fork a thread that prints the received value (and closes the channel)
    fork (\_:() 1-> c |> receiveAndClose @String |> putStrLn);
    -- send a string through the channel (and close it)
    s |> send "Hello!" |> close
```
## **receive_**
**Type**: `forall a:1T . *?a -> a`

Receives a value from a star channel. Unrestricted version of `receive`.
## **send_**
**Type**: `forall a:1T . a -> *!a 1-> ()`

Sends a value on a star channel. Unrestricted version of `send`.
## **accept**
**Type**: `forall a:1S . *!a -> dualof a`

Session initiation. Accepts a request for a linear session on a shared
channel. The requester uses a conventional `receive` to obtain the channel
end.
## **forkWith**
**Type**: `forall a:1S b . (dualof a 1-> b) -> a`

Creates a new child process and a linear channel through which it can
communicate with its parent process. Returns the channel endpoint.

```
main : ()
main =
    -- fork a thread that receives a string and prints
    let c = forkWith @(!String;End) @() (\s:(?String;End) 1-> s |> receiveAndClose @String |> putStrLn) in
    -- send the string to be printed
    c |> send "Hello!" |> close
```
## **runServer**
**Type**: `forall a:1S b:*T . (b -> dualof a 1-> b) -> b -> *!a -> Diverge`

Runs an infinite shared server thread given a function to serve a client (a
handle), the initial state, and the server's shared channel endpoint. It can
be seen as an infinite sequential application of the handle function over a
newly accepted session, while continuously updating the state.
    
Note: this only works with session types that use session initiation.

```
type SharedCounter : *S = *?Counter
type Counter : 1S = +{ Inc: End
                     , Dec: End
                     , Get: ?Int; End
                     }

-- | Handler for a counter
counterService : Int -> dualof Counter 1-> Int
counterService i (Inc ch) = close ch; i + 1 
counterService i (Dec ch) = close ch; i - 1
counterService i (Get ch) = ch |> send i |> close; i

-- | Counter server
runCounterServer : dualof SharedCounter -> Diverge
runCounterServer = runServer @Counter @Int counterService 0 
```

# **Output and input streams**
## **OutStream**
**Type**: 
```
type OutStream : 1S = +{ PutChar : !Char; OutStream
                       , PutStr  : !String; OutStream
                       , PutStrLn: !String; OutStream
                       , Close   : End
                       }
```

The `OutStream` type describes output streams (such as `stdout`, `stderr`
and write mode files). `PutChar` outputs a character, `PutStr` outputs a string,
and `PutStrLn` outputs a string followed by the newline character (`\n`).
Operations in this channel must end with the `Close` option.
## **OutStreamProvider**
**Type**: 
```
type OutStreamProvider : *S = *?OutStream
```

Unrestricted session type for the `OutStream` type.
## **InStream**
**Type**: 
```
type InStream : 1S = +{ GetChar     : ?Char  ; InStream
                      , GetLine     : ?String; InStream
                      , IsEOF       : ?Bool  ; InStream
                      , Close       : End
                      }
```

The `InStream` type describes input streams (such as `stdin` and read
files). `GetChar` reads a single character, `GetLine` reads a line, and
`IsEOF` checks for the EOF (End-Of-File) token, i.e., if an input stream
reached the end. Operations in this channel end with the `Close` option.
## **InStreamProvider**
**Type**: 
```
type InStreamProvider : *S = *?InStream
```

Unrestricted session type for the `OutStream` type.
## **hCloseOut**
**Type**: `OutStream -> ()`

Closes an `OutStream` channel endpoint. Behaves as a `close`.
## **hPutChar**
**Type**: `Char -> OutStream -> OutStream`

Sends a character through an `OutStream` channel endpoint. Behaves as 
`|> select PutChar |> send`.
## **hPutStr**
**Type**: `String -> OutStream -> OutStream`

Sends a String through an `OutStream` channel endpoint. Behaves as 
`|> select PutString |> send`.
## **hPutStrLn**
**Type**: `String -> OutStream -> OutStream`

Sends a string through an `OutStream` channel endpoint, to be output with
the newline character. Behaves as `|> select PutStringLn |> send`.
## **hPrint**
**Type**: `forall a:*T . a -> OutStream -> OutStream`

Sends the string representation of a value through an `OutStream` channel
endpoint, to be outputed with the newline character. Behaves as `hPutStrLn
(show @t v)`, where `v` is the value to be sent and `t` its type.
## **hPutChar_**
**Type**: `Char -> OutStreamProvider -> ()`

Unrestricted version of `hPutChar`. Behaves the same, except it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPutChar` and then closes the enpoint with `hCloseOut`.
## **hPutStr_**
**Type**: `String -> OutStreamProvider -> ()`

Unrestricted version of `hPutStr`. Behaves similarly, except that it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPutStr` and then closes the enpoint with `hCloseOut`.
## **hPutStrLn_**
**Type**: `String -> OutStreamProvider -> ()`

Unrestricted version of `hPutStrLn`. Behaves similarly, except that it
first receives an `OutStream` channel endpoint (via session initiation),
executes an `hPutStrLn` and then closes the enpoint with `hCloseOut`.
## **hPrint_**
**Type**: `forall a:*T . a -> OutStreamProvider -> ()`

Unrestricted version of `hPrint`. Behaves similarly, except that it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPrint` and then closes the enpoint with `hCloseOut`.
## **hCloseIn**
**Type**: `InStream -> ()`

Closes an `InStream` channel endpoint. Behaves as a `close`.
## **hGetChar**
**Type**: `InStream -> (Char, InStream)`

Reads a character from an `InStream` channel endpoint. Behaves as 
`|> select GetChar |> receive`.
## **hGetLine**
**Type**: `InStream -> (String, InStream)`

Reads a line (as a string) from an `InStream` channel endpoint. Behaves as 
`|> select GetLine |> receive`.
## **hIsEOF**
**Type**: `InStream -> (Bool, InStream)`

Checks if an `InStream` reached the EOF token that marks where no more input can be read. 
Does the same as `|> select IsEOF |> receive`.
## **hGetContent**
**Type**: `InStream -> (String, InStream)`

Reads the entire content from an `InStream` (i.e. until EOF is reached). Returns the content
as a single string and the continuation channel.
## **hGetChar_**
**Type**: `InStreamProvider -> Char`

Unrestricted version of `hGetChar`. Behaves the same, except it first receives an `InStream` 
channel endpoint (via session initiation), executes an `hGetChar` and then closes the 
enpoint with `hCloseIn`.
## **hGetLine_**
**Type**: `InStreamProvider -> String`

Unrestricted version of `hGetLine`. Behaves the same, except it first receives an `InStream` 
channel endpoint (via session initiation), executes an `hGetLine` and then closes the 
enpoint with `hCloseIn`.
## **hGetContent_**
**Type**: `InStreamProvider -> String`

Unrestricted version of `hGetContent`. Behaves the same, except it first receives an `InStream`
channel endpoint (via session initiation), executes an `hGetContent` and then closes the
endpoint with `hCloseIn`.

# **Standard IO**
## **stdout**
**Type**: `OutStreamProvider`

Standard output stream. Prints to the console.
## **putChar**
**Type**: `Char -> ()`

Prints a character to `stdout`. Behaves the same as `hPutChar_ c stdout`, where `c`
is the character to be printed.
## **putStr**
**Type**: `String -> ()`

Prints a string to `stdout`. Behaves the same as `hPutStr_ s stdout`, where `s` is
the string to be printed.
## **putStrLn**
**Type**: `String -> ()`

Prints a string to `stdout`, followed by the newline character `\n`. Behaves
as `hPutStrLn_ s stdout`, where `s` is the string to be printed.
## **print**
**Type**: `forall a:*T . a -> ()`

Prints the string representation of a given value to `stdout`, followed by
the newline character `\n`. Behaves the same as `hPrint_ @t v stdout`, where `v` is
the value to be printed and `t` its type.
## **stderr**
**Type**: `OutStreamProvider`

Standard error stream. Prints to the console.
## **stdin**
**Type**: `InStreamProvider`

Standard input stream. Reads from the console.
## **getChar**
**Type**: `Char`

Reads a single character from `stdin`.
## **getLine**
**Type**: `String`

Reads a single line from `stdin`. 

# **File types**
## **FilePath**
**Type**: 
```
type FilePath = String
```

File paths.

