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

- TOC
{:toc}

# **Base**
## **id**
**Type**: `id : ∀a . a -> a`

The identity function. Will return the exact same value.
```
id 5       -- 5
id "Hello" -- "Hello"
```

## **flip**
**Type**: `flip : ∀a b c . (a -> b -> c) -> b -> a -> c`

Flips the first and second arguments of a function.
```
-- | Check if the integer is positive and the boolean is true
test : Int -> Bool -> Bool
test i b = i > 0 && b

-- | 
flippedTest : Bool -> Int -> Bool
flippedTest = flip @Int @Bool @Bool
```

## **until**
**Type**: `until : ∀a . (a -> Bool) -> (a -> a) -> a -> a`

Applies the function passed as the second argument to the third one and uses the predicate in the
    first argument to evaluate the result, if it comes as True it returns it, otherwise, it 
    continues to apply the function on previous results until the predicate evaluates to True.

```
-- | First base 2 power greater than a given limit
firstPowerGreaterThan : Int -> Int
firstPowerGreaterThan limit = until (> limit) (*2) 1
```  

## **curry**
**Type**: `curry : ∀a b c . ((a, b) -> c) -> a -> b -> c`

Transforms a function that has a pair as argument into a function that takes two arguments, that 
    correspond directly to the first and second elements of the pair.

```
-- | Sums the elements of a pair of integers
sumPair : (Int, Int) -> Int
sumPair (x, y) = x + y

-- | Regular sum
sum : Int -> Int -> Int
sum = curry @Int @Int @Int sumPair
```

## **uncurry**
**Type**: `uncurry : ∀a b c . (a -> b -> c) -> ((a, b) -> c)`

Transforms a function that has two arguments into a function that takes a single pair of arguments
    that correspond directly to the first and second arguments of the function it is applied to.

```
-- | Sums the elements of a pair of integers
sumPair : (Int, Int) -> Int
sumPair = uncurry @Int @Int @Int (+)
```

## **swap**
**Type**: `swap : ∀a b . (a, b) -> (b, a)`

Swaps the elements of a pair. The expression `swap (1, True)` evaluates to `(True, 1)`.

## **fix**
**Type**: `fix : ∀a . ((a -> a) -> (a -> a)) -> (a -> a)`


# **Concurrency and channels**
## **Diverge**
**Type**: `type Diverge = ()`

The type of diverging functions, or in other words, functions that don't terminate. It's use is merely
    representative.

## **sink**
**Type**: `sink : ∀a . a -> ()`

Voids any unrestricted values and returns the unit value.

## **repeat**
**Type**: `repeat : ∀a:*T . Int -> (() -> a) -> ()`

Repeats a thunk function (a function that has unit as argument) a given number of times, 
    sequentially.

```
main : ()
main = 
    -- print "Hello!" 5 times sequentially
    repeat @() n (\_:() -> putStrLn "Hello!")
```

## **parallel**
**Type**: `parallel : ∀a:*T . Int -> (() -> a) -> ()`

Forks a given number of threads to execute the thunk function (a function that has unit as 
    argument). Works the same as a `repeat` call but in parallel instead of sequentially.

```
main : ()
main = 
    -- print "Hello!" 5 times in parallel
    parallel @() n (\_:() -> putStrLn "Hello!")
```

## **consume**
**Type**: `consume : forall a b:1S . (a -> ()) -> ?a;b 1-> b`

Receives a value from a channel and consumes it using the given a consumer function for that value.

```
main : ()
main =
    -- create channel endpoints
    let (c, s) = new ?String; End in
    -- fork a thread that prints the received value (and closes the channel)
    fork (\_:() -> consume @String @End putStrLn c |> close);
    -- send a string through the channel (and close it)
    send "Hello!" s |> close
```

## **receiveAndClose**
**Type**: `receiveAndClose : ∀a:1T . ?a;End -> a `

Receives a value from a channel and then closes it. The returned value is the one received.

```
main : ()
main =
    -- create channel endpoints
    let (c, s) = new ?String; End in
    -- fork a thread that prints the received value (and closes the channel)
    fork (\_:() -> putStrLn $ receiveAndClose @String c);
    -- send a string through the channel (and close it)
    send "Hello!" s |> close
```

## **receive_**
**Type**: `receive_ : ∀a:1T . *?a -> a`

Unrestricted version of `receive`.

## **send_**
**Type**: `send_ : ∀a:1T . a -> *!a 1-> ()`

Unrestricted version of `send`.

## **forkWith**
**Type**: `forkWith : ∀a:1S b:*T . (dualof a 1-> b) -> a`

Creates two channel endpoints, forks a given function with the dual channel endpoint and returns
    the other.

```
main : ()
main =
    -- fork a thread that receives a string and prints
    let c = forkWith @!String;End @() (receiveAndClose @String |> putStrLn) in
    -- send the string to be printed
    send "Hello!"
```

## **accept**
**Type**: `accept : ∀a:1S . *!a -> dualof a`

Session initiation. Accept a request for a linear session on a shared channel. In simpler terms, it 
    creates two channel enpoints, sends one through the shared channel endpoint and keeps the other
    one. `accept` is often used by the server-side.

## **runServer**
**Type**: `runServer : ∀a:1S b . (b -> dualof a 1-> b) -> b -> *!a -> Diverge`

Run an infinite shared server thread given a function to serve a client (a handle), the initial 
    state, and the server's shared channel endpoint. It can be seen as an infinite sequential 
    application of the handle function over a newly accepted session, while contiuously updating
    the state. 
    
Note this only works with session types that use session initiation.

```
type SharedCounter : *S = *?Counter
type Counter : 1S = +{ Inc: End
                     , Dec: End
                     , Get: ?Int; End
                     }

-- | Handler for a counter
counterService : Int -> dualof Counter 1-> Int
counterService i (Inc ch) = close ch; i+1 
counterService i (Dec ch) = close ch; i-1
counterService i (Get ch) = send i ch |> close; i

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

The `OutStream` type describes output streams (such as `stdout`, `stderr` and write files).
    `PutStr` outputs a character, `PutStr` outputs a string, and `PutStrLn` outputs a string 
    followed by the newline character (`\n`). Operations in this channel end with the `Close`
    option.

## **OutStreamProvider**
**Type**: `type OutStreamProvider : *S = *?OutStream`

Unrestricted session type for the `OutStream` type.

## **hCloseOut** 
**Type**: `hCloseOut : OutStream -> ()`

Closes an `OutStream` channel endpoint. Does the same as a `close`.

## **hPutChar** 
**Type**: `hPutChar : Char -> OutStream -> OutStream`

Send a character through an `OutStream` channel endpoint. Does the same as 
    `|> select PutChar |> send`.

## **hPutStr** 
**Type**: `hPutStr : String -> OutStream -> OutStream`

Send a String through an `OutStream` channel endpoint. Does the same as 
    `|> select PutString |> send`.

## **hPutStrLn** 
**Type**: `hPutStrLn : String -> OutStream -> OutStream`

Send a string through an `OutStream` channel endpoint, to be outputed with the newline character. 
    Does the same as `|> select PutStringLn |> send`.

## **hPrint** 
**Type**: `hPrint : forall a . a -> OutStream -> OutStream`

Sends the string representation of a value through an `OutStream` channel endpoint, to be outputed
    with the newline character. Does the same as `hPutStrLn (show @t v)`, where `v` is the value to
    be sent and `t` its type.

## **hPutChar_** 
**Type**: `hPutChar_ : Char -> OutStreamProvider -> ()`

Unrestricted version of `hPutChar`. Behaves the same, except it first receives an `OutStream` 
    channel endpoint (via session initiation), executes an `hPutChar` and then closes the 
    enpoint with `hCloseOut`.

## **hPutStr_** 
**Type**: `hPutStr_ : String -> OutStreamProvider -> ()`

Unrestricted version of `hPutStr`. Behaves the same, except it first receives an `OutStream` 
    channel endpoint (via session initiation), executes an `hPutStr` and then closes the 
    enpoint with `hCloseOut`.

## **hPutStrLn_** 
**Type**: `hPutStrLn_ : String -> OutStreamProvider -> ()`

Unrestricted version of `hPutStrLn`. Behaves the same, except it first receives an `OutStream` 
    channel endpoint (via session initiation), executes an `hPutStrLn` and then closes the 
    enpoint with `hCloseOut`.

## **hPrint_** 
**Type**: `hPrint_ : forall a . a -> OutStreamProvider -> ()`

Unrestricted version of `hPrint`. Behaves the same, except it first receives an `OutStream` 
    channel endpoint (via session initiation), executes an `hPrint` and then closes the 
    enpoint with `hCloseOut`.


## **InStream** 
**Type**: 
```
type InStream : 1S = +{ GetChar: ?Char; InStream
                      , GetLine: ?String; InStream
                      , IsEOF  : ?Bool; InStream
                      , Close  : End
                      }
```

The `InStream` type describes input streams (such as `stdin` and read files).
    `GetChar` reads a single character, `GetLine` reads a line, and `IsEOF` checks for the EOF
    (End-Of-File) token, i.e., if an input stream reached the end. Operations in this channel end 
    with the `Close` option.

## **InStreamProvider**
**Type**: `type InStreamProvider : *S = *?InStream`

Unrestricted session type for the `OutStream` type.

## **hCloseIn**
**Type**: `hCloseIn : InStream -> ()`

Closes an `InStream` channel endpoint. Does the same as a `close`.

## **hGetChar**
**Type**: `hGetChar : InStream -> (Char, InStream)`

Reads a character from an `InStream` channel endpoint. Does the same as 
    `|> select GetChar |> receive`.

## **hGetLine**
**Type**: `hGetLine : InStream -> (String, InStream)`

Reads a line (as a string) from an `InStream` channel endpoint. Does the same as 
    `|> select GetLine |> receive`.

## **hIsEOF**
**Type**: `hIsEOF : InStream -> (Bool, InStream)`

Checks if an `InStream` reached the EOF token that marks where no more input can be read. Does the
    same as `|> select IsEOF |> receive`.

## **hGetChar_**
**Type**: `hGetChar_ : InStreamProvider -> Char`

Unrestricted version of `hGetChar`. Behaves the same, except it first receives an `InStream` 
    channel endpoint (via session initiation), executes an `hGetChar` and then closes the 
    enpoint with `hCloseIn`.

## **hGetLine_**
**Type**: `hGetLine_ : InStreamProvider -> String`

Unrestricted version of `hGetLine`. Behaves the same, except it first receives an `InStream` 
    channel endpoint (via session initiation), executes an `hGetLine` and then closes the 
    enpoint with `hCloseIn`.


# **Standard IO**

## **stdout**
**Type**: `stdout : OutStreamProvider`

Standard output stream. Prints to the console.

## **putChar**
**Type**: `putChar : Char -> ()`

Print a character to `stdout`. Does the same as `hPutChar_ c stdout`, where `c` is the character
    to be printed.

## **putStr**
**Type**: `putStr : String -> ()`

Print a string to `stdout`. Does the same as `hPutStr_ s stdout`, where `s` is the string to be 
    printed.

## **putStrLn**
**Type**: `putStrLn : String -> ()`

Print a string to `stdout`, followed by the newline character `\n`. Does the same as 
    `hPutStrLn_ s stdout`, where `s` is the string to be printed.

## **print**
**Type**: `print : forall a . a -> ()`

Print the string representation of a given value to `stdout`, followed by the newline character 
    `\n`. Does the same as `hPrint_ @t v stdout`, where `v` is the value to be printed and `t`
    its type.

## **stderr**
**Type**: `stderr : OutStreamProvider`

Standard error stream. Prints to the console.

## **stdin**
**Type**: `stdin : InStreamProvider`

Standard input stream. Reads input from the console.

## **getChar**
**Type**: `getChar : Char`

Read a character from `stdin`.

## **getLine**
**Type**: `getLine : String`

Read a line from `stdin` as a string.
