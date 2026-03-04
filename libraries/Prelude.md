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

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

# **Builtins**
## `(+) : Int -> Int -> Int`
{: .no_toc}

## `(-) : Int -> Int -> Int`
{: .no_toc}

## `(*) : Int -> Int -> Int`
{: .no_toc}

## `(/) : Int -> Int -> Int`
{: .no_toc}

## `div : Int -> Int -> Int`
{: .no_toc}

## `(^) : Int -> Int -> Int`
{: .no_toc}

## `mod : Int -> Int -> Int`
{: .no_toc}

## `rem : Int -> Int -> Int`
{: .no_toc}

## `max : Int -> Int -> Int`
{: .no_toc}

## `min : Int -> Int -> Int`
{: .no_toc}

## `quot : Int -> Int -> Int`
{: .no_toc}

## `gcd : Int -> Int -> Int`
{: .no_toc}

## `lcm : Int -> Int -> Int`
{: .no_toc}

## `subtract : Int -> Int -> Int`
{: .no_toc}

## `succ : Int -> Int`
{: .no_toc}

## `pred : Int -> Int`
{: .no_toc}

## `abs : Int -> Int`
{: .no_toc}

## `negate : Int -> Int`
{: .no_toc}

## `even : Int -> Bool`
{: .no_toc}

## `odd : Int -> Bool`
{: .no_toc}

## `(==) : Int -> Int -> Bool`
{: .no_toc}

## `(/=) : Int -> Int -> Bool`
{: .no_toc}

## `(<) : Int -> Int -> Bool`
{: .no_toc}

## `(>) : Int -> Int -> Bool`
{: .no_toc}

## `(<=) : Int -> Int -> Bool`
{: .no_toc}

## `(>=) : Int -> Int -> Bool`
{: .no_toc}

## `(+.) : Float -> Float -> Float`
{: .no_toc}

## `(-.) : Float -> Float -> Float`
{: .no_toc}

## `(*.) : Float -> Float -> Float`
{: .no_toc}

## `(/.) : Float -> Float -> Float`
{: .no_toc}

## `(>.) : Float -> Float -> Float`
{: .no_toc}

## `(<.) : Float -> Float -> Float`
{: .no_toc}

## `(>=.) : Float -> Float -> Float`
{: .no_toc}

## `(<=.) : Float -> Float -> Float`
{: .no_toc}

## `absF : Float -> Float`
{: .no_toc}

## `negateF : Float -> Float`
{: .no_toc}

## `maxF : Float -> Float -> Float`
{: .no_toc}

## `minF : Float -> Float -> Float`
{: .no_toc}

## `truncate : Float -> Int`
{: .no_toc}

## `round : Float -> Int`
{: .no_toc}

## `ceiling : Float -> Int`
{: .no_toc}

## `floor : Float -> Int`
{: .no_toc}

## `recip : Float -> Float`
{: .no_toc}

## `pi : Float`
{: .no_toc}

## `exp : Float -> Float`
{: .no_toc}

## `log : Float -> Float`
{: .no_toc}

## `sqrt : Float -> Float`
{: .no_toc}

## `(**) : Float -> Float -> Float`
{: .no_toc}

## `logBase : Float -> Float -> Float`
{: .no_toc}

## `sin : Float -> Float`
{: .no_toc}

## `cos : Float -> Float`
{: .no_toc}

## `tan : Float -> Float`
{: .no_toc}

## `asin : Float -> Float`
{: .no_toc}

## `acos : Float -> Float`
{: .no_toc}

## `atan : Float -> Float`
{: .no_toc}

## `sinh : Float -> Float`
{: .no_toc}

## `cosh : Float -> Float`
{: .no_toc}

## `tanh : Float -> Float`
{: .no_toc}

## `log1p : Float -> Float`
{: .no_toc}

## `expm1 : Float -> Float`
{: .no_toc}

## `log1pexp : Float -> Float`
{: .no_toc}

## `log1mexp : Float -> Float`
{: .no_toc}

## `fromInteger : Int -> Float`
{: .no_toc}

## `(&&) : Bool -> Bool -> Bool`
{: .no_toc}

## `(||) : Bool -> Bool -> Bool`
{: .no_toc}

## `ord : Char -> Int`
{: .no_toc}

## `chr : Int -> Char`
{: .no_toc}

## `(^^) : String -> String -> String`
{: .no_toc}

## `show : forall a:*T . a -> String`
{: .no_toc}

## `readBool : String -> Bool`
{: .no_toc}

## `readInt : String -> Int`
{: .no_toc}

## `readChar : String -> Char`
{: .no_toc}

## `fork : forall a:*T. (() 1-> a) -> ()`
{: .no_toc}

## `error : forall a:*T . String -> a`
{: .no_toc}

## `undefined : forall a:*T . a`
{: .no_toc}

## `new : forall a:1A . () -> (a, dualof a)`
{: .no_toc}
Creates two endpoints of a channels of the given type.

## `send : forall a:1T . a -> forall b:1S . !a ; b 1-> b`
{: .no_toc}
Sends a value on a channel. Returns the continuation channel

## `receive : forall a:1T b:1S . ?a ; b -> (a, b)`
{: .no_toc}
Receives a value on a channel. Returns the received value and 
the continuation channel.

## `close : Close -> ()`
{: .no_toc}
Closes a channel.

## `wait : Wait -> ()`
{: .no_toc}
Waits for a channel to be closed.


# **Base**
## `Bool`
{: .no_toc}
```
data Bool = True | False 
```

## `not : Bool -> Bool`
{: .no_toc}
Boolean complement

## `id : forall a:*T . a -> a`
{: .no_toc}
The identity function. Will return the exact same value.
```
id 5       -- 5
id "Hello" -- "Hello"
```

## `flip : forall a:*T b:*T c:*T . (a -> b -> c) -> b -> a -> c`
{: .no_toc}
Swaps the order of parameters to a function
```
 -- | Check if the integer is positive and the boolean is true
 test : Int -> Bool -> Bool
 test i b = i > 0 && b
 
 -- | Flipped version of function 'test'
 flippedTest : Bool -> Int -> Bool
 flippedTest = flip @Int @Bool @Bool test
 ```

## `($) : forall a:*T b:*T. (a -> b) -> a -> b`
{: .no_toc}
Application operator. Takes a function and an argument, and applies 
the first to the latter. This operator has low right-associative binding 
precedence, allowing parentheses to be omitted in certain situations.
For example:
```
f $ g $ h x = f (g (h x))
```

## `(|>) : forall a:*T b:*T. a -> (a -> b) -> b`
{: .no_toc}
Reverse application operator. Provides notational convenience, especially
when chaining channel operations. For example:
```
f : !Int ; !Bool ; Close -> () 
f c = c |> send 5 |> send True |> close
```
Its binding precedence is higher than `$`.

## `(;) : forall a:*T b:*T . a -> b -> b`
{: .no_toc}
Sequential composition. Takes two expressions, evaluates the former and
discards the result, then evaluates the latter. For example:
```
3 ; 4
```
evaluates to 4.
Its binding precedence is rather low.

## `until : forall a:*T . (a -> Bool) -> (a -> a) -> a -> a`
{: .no_toc}
Applies the function passed as the second argument to the third one and
uses the predicate in the first argument to evaluate the result, if it comes
as True it returns it, otherwise, it continues to apply the function on
previous results until the predicate evaluates to True.

```
-- | First base 2 power greater than a given limit
firstPowerGreaterThan : Int -> Int
firstPowerGreaterThan limit = until @Int (> limit) (*2) 1
```  

## `curry : forall a:*T b:*T c:*T . ((a, b) -> c) -> a -> b -> c`
{: .no_toc}
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

## `uncurry : forall a:*T b:*T c:*T . (a -> b -> c) -> ((a, b) -> c)`
{: .no_toc}
Converts a function that receives its arguments one at a time into a
function on pairs.

```
-- | Sums the elements of a pair of integers
sumPair : (Int, Int) -> Int
sumPair = uncurry @Int @Int @Int (+)
```

## `swap : forall a:*T b:*T . (a, b) -> (b, a)`
{: .no_toc}
Swaps the components of a pair. The expression `swap (1, True)` evaluates to
`(True, 1)`.

## `fix : forall a:*T . ((a -> a) -> (a -> a)) -> (a -> a)`
{: .no_toc}
Fixed-point Z combinator

## `fst : forall a:1T b:*T . (a, b) -> a`
{: .no_toc}
Extracts the first element from a pair, discarding the second.

## `snd : forall a:*T b:1T . (a, b) -> b`
{: .no_toc}
Extracts the second element from a pair, discarding the first.


# **Concurrency and channels**
## `Diverge`
{: .no_toc}
```
type Diverge = ()
```

A mark for functions that do not terminate

## `sink : forall a:*T . a -> ()`
{: .no_toc}
Discards an unrestricted value

## `repeat : forall a:*T . Int -> (() -> a) -> ()`
{: .no_toc}
Executes a thunk n times, sequentially

```
main : ()
main = 
  -- print "Hello!" 5 times sequentially
  repeat @() 5 (\_:() -> putStrLn "Hello!")
```

## `parallel : forall a:*T . Int -> (() -> a) -> ()`
{: .no_toc}
Forks n identical threads. Works the same as a `repeat` call but in parallel
instead of sequentially.

```
main : ()
main = 
  -- print "Hello!" 5 times in parallel
  parallel @() 5 (\_:() -> putStrLn "Hello!")
```

## `receiveAndWait : forall a:1T . ?a ; Wait -> a`
{: .no_toc}
Receives a value from a linear channel and applies a function to it.
Discards the result and returns the continuation channel.

```
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

```
main : ()
main =
  -- create channel endpoints
  let (c, s) = new @(?String ; Wait) () in
  -- fork a thread that prints the received value (and closes the channel)
  fork (\_:() 1-> c |> receiveAndWait @String |> putStrLn);
  -- send a string through the channel (and close it)
  s |> send "Hello!" |> close
```

## `receiveAndClose : forall a:1T . ?a ; Close -> a`
{: .no_toc}
As in receiveAndWait only that the type is Close and the function closes the
channel rather the waiting for the channel to be closed.

## `sendAndWait : forall a:1T . a -> !a ; Wait 1-> ()`
{: .no_toc}
Sends a value on a given channel and then waits for the channel to be
closed. Returns ().

## `sendAndClose : forall a:1T . a -> !a ; Close 1-> ()`
{: .no_toc}
Sends a value on a given channel and then closes the channel.
Returns ().

## `receive_ : forall a:1T . *?a -> a`
{: .no_toc}
Receives a value from a star channel. Unrestricted version of `receive`.

## `send_ : forall a:1T . a -> *!a 1-> ()`
{: .no_toc}
Sends a value on a star channel. Unrestricted version of `send`.

## `accept : forall a:1A . *!a -> dualof a`
{: .no_toc}
Session initiation. Accepts a request for a linear session on a shared
channel. The requester uses a conventional `receive` to obtain the channel
end.

## `forkWith : forall a:1A b . (dualof a 1-> b) -> a`
{: .no_toc}
Creates a new child process and a channel through which it can
communicate with its parent process. Returns the channel endpoint.

```
main : ()
main =
  -- fork a thread that receives a string and prints
  let c = forkWith @(!String ; Wait) @() (\s:(?String ; End) 1-> s |> receiveAndWait @String |> putStrLn) in
  -- send the string to be printed
  c |> send "Hello!" |> wait
```

## `runServer : forall a:1A b:*T . (b -> dualof a 1-> b) -> b -> *!a -> Diverge`
{: .no_toc}
Runs an infinite shared server thread given a function to serve a client (a
handle), the initial state, and the server's shared channel endpoint. It can
be seen as an infinite sequential application of the handle function over a
newly accepted session, while continuously updating the state.
  
Note: this only works with session types that use session initiation.

```
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


# **Output and input streams**
## `OutStream`
{: .no_toc}
```
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

## `OutStreamProvider`
{: .no_toc}
```
type OutStreamProvider : *S = *?OutStream
```

Unrestricted session type for the `OutStream` type.

## `InStream`
{: .no_toc}
```
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

## `InStreamProvider`
{: .no_toc}
```
type InStreamProvider : *S = *?InStream
```

Unrestricted session type for the `OutStream` type.

## `hCloseOut : OutStream -> ()`
{: .no_toc}
Closes an `OutStream` channel endpoint. Behaves as a `close`.

## `hPutChar : Char -> OutStream -> OutStream`
{: .no_toc}
Sends a character through an `OutStream` channel endpoint. Behaves as 
`|> select PutChar |> send`.

## `hPutStr : String -> OutStream -> OutStream`
{: .no_toc}
Sends a String through an `OutStream` channel endpoint. Behaves as 
`|> select PutString |> send`.

## `hPutStrLn : String -> OutStream -> OutStream`
{: .no_toc}
Sends a string through an `OutStream` channel endpoint, to be output with
the newline character. Behaves as `|> select PutStringLn |> send`.

## `hPrint : forall a:*T . a -> OutStream -> OutStream`
{: .no_toc}
Sends the string representation of a value through an `OutStream` channel
endpoint, to be outputed with the newline character. Behaves as `hPutStrLn
(show @t v)`, where `v` is the value to be sent and `t` its type.

## `hPutChar_ : Char -> OutStreamProvider -> ()`
{: .no_toc}
Unrestricted version of `hPutChar`. Behaves the same, except it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPutChar` and then closes the enpoint with `hCloseOut`.

## `hPutStr_ : String -> OutStreamProvider -> ()`
{: .no_toc}
Unrestricted version of `hPutStr`. Behaves similarly, except that it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPutStr` and then closes the enpoint with `hCloseOut`.

## `hPutStrLn_ : String -> OutStreamProvider -> ()`
{: .no_toc}
Unrestricted version of `hPutStrLn`. Behaves similarly, except that it
first receives an `OutStream` channel endpoint (via session initiation),
executes an `hPutStrLn` and then closes the enpoint with `hCloseOut`.

## `hPrint_ : forall a:*T . a -> OutStreamProvider -> ()`
{: .no_toc}
Unrestricted version of `hPrint`. Behaves similarly, except that it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPrint` and then closes the enpoint with `hCloseOut`.

## `hCloseIn : InStream -> ()`
{: .no_toc}
Closes an `InStream` channel endpoint. Behaves as a `close`.

## `hGetChar : InStream -> (Char, InStream)`
{: .no_toc}
Reads a character from an `InStream` channel endpoint. Behaves as 
`|> select GetChar |> receive`.

## `hGetLine : InStream -> (String, InStream)`
{: .no_toc}
Reads a line (as a string) from an `InStream` channel endpoint. Behaves as 
`|> select GetLine |> receive`.

## `hIsEOF : InStream -> (Bool, InStream)`
{: .no_toc}
Checks if an `InStream` reached the EOF token that marks where no more input can be read. 
Does the same as `|> select IsEOF |> receive`.

## `hGetContent : InStream -> (String, InStream)`
{: .no_toc}
Reads the entire content from an `InStream` (i.e. until EOF is reached). Returns the content
as a single string and the continuation channel.

## `hGetChar_ : InStreamProvider -> Char`
{: .no_toc}
Unrestricted version of `hGetChar`. Behaves the same, except it first receives an `InStream` 
channel endpoint (via session initiation), executes an `hGetChar` and then closes the 
enpoint with `hCloseIn`.

## `hGetLine_ : InStreamProvider -> String`
{: .no_toc}
Unrestricted version of `hGetLine`. Behaves the same, except it first receives an `InStream` 
channel endpoint (via session initiation), executes an `hGetLine` and then closes the 
enpoint with `hCloseIn`.

## `hGetContent_ : InStreamProvider -> String`
{: .no_toc}
Unrestricted version of `hGetContent`. Behaves the same, except it first receives an `InStream`
channel endpoint (via session initiation), executes an `hGetContent` and then closes the
endpoint with `hCloseIn`.


# **Standard IO**
## `stdout : OutStreamProvider`
{: .no_toc}
Standard output stream. Prints to the console.

## `putChar : Char -> ()`
{: .no_toc}
Prints a character to `stdout`. Behaves the same as `hPutChar_ c stdout`, where `c`
is the character to be printed.

## `putStr : String -> ()`
{: .no_toc}
Prints a string to `stdout`. Behaves the same as `hPutStr_ s stdout`, where `s` is
the string to be printed.

## `putStrLn : String -> ()`
{: .no_toc}
Prints a string to `stdout`, followed by the newline character `\n`. Behaves
as `hPutStrLn_ s stdout`, where `s` is the string to be printed.

## `print : forall a:*T . a -> ()`
{: .no_toc}
Prints the string representation of a given value to `stdout`, followed by
the newline character `\n`. Behaves the same as `hPrint_ @t v stdout`, where `v` is
the value to be printed and `t` its type.

## `stderr : OutStreamProvider`
{: .no_toc}
Standard error stream. Prints to the console.

## `stdin : InStreamProvider`
{: .no_toc}
Standard input stream. Reads from the console.

## `getChar : Char`
{: .no_toc}
Reads a single character from `stdin`.

## `getLine : String`
{: .no_toc}
Reads a single line from `stdin`. 


# **File types**
## `FilePath`
{: .no_toc}
```
type FilePath = String
```

File paths.

## `FileHandle`
{: .no_toc}
```
data FileHandle = FileHandle ()
```


## `IOMode`
{: .no_toc}
```
data IOMode = ReadMode | WriteMode | AppendMode
```
