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
and a worked example. Sections and their order mirror the Prelude's own
source file.
</div>

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Standard types, classes and related functions

### `undefined`
{: .no_toc}
```freest
undefined : forall (a : *T) -> a
```
An inhabitant of every unrestricted type. Used as the placeholder
implementation for every other builtin in this file — useful when writing
your own builtins, but this one ought to be a builtin itself.

### `error`
{: .no_toc}
```freest
error : forall (a : 1T) -> String -> a
```
Aborts the program, printing the given message.

### Basic datatypes

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

### Tuples

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
Converts a function that receives its arguments one at a time into a function
on pairs.

### Comparison

Only `Int` and `Float` are comparable, for now.

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `(<)` | `Int -> Int -> Bool`{: .language-freest } |
| `(<=)` | `Int -> Int -> Bool`{: .language-freest } |
| `(==)` | `Int -> Int -> Bool`{: .language-freest } |
| `(>=)` | `Int -> Int -> Bool`{: .language-freest } |
| `(>)` | `Int -> Int -> Bool`{: .language-freest } |
| `(/=)` | `Int -> Int -> Bool`{: .language-freest } |
| `(>.)` | `Float -> Float -> Bool`{: .language-freest } |
| `(<.)` | `Float -> Float -> Bool`{: .language-freest } |
| `(>=.)` | `Float -> Float -> Bool`{: .language-freest } |
| `(<=.)` | `Float -> Float -> Bool`{: .language-freest } |

### Numeric functions

**Int**

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

**Float**

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
| `truncate` | `Float -> Int`{: .language-freest } |
| `round` | `Float -> Int`{: .language-freest } |
| `ceiling` | `Float -> Int`{: .language-freest } |
| `floor` | `Float -> Int`{: .language-freest } |
| `pi` | `Float`{: .language-freest } |
| `fromInteger` | `Int -> Float`{: .language-freest } |

### Miscellaneous functions

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

## Lists

### `null`
{: .no_toc}
```freest
null : forall a -> [a] -> Bool
```
`True` on the empty list, `False` otherwise.

### `(++)`
{: .no_toc}
```freest
(++) : forall (a : *T) -> [a] -> [a] -> [a]
```
Appends two (unrestricted) lists.

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

### `sum`
{: .no_toc}
```freest
sum : [Int] -> Int
```
The sum of a list of integers.

### `reverse`
{: .no_toc}
```freest
reverse : forall (a : *T) -> [a] -> [a]
```
Reverses a list. Uses an accumulator internally so it runs in linear time.

### `map`
{: .no_toc}
```freest
map : forall (a : *T) (b : *T) -> (a -> b) -> [a] -> [b]
```
Applies a function to every element of a list, producing a new list.

### `foldl`
{: .no_toc}
```freest
foldl : forall #m #n (a : m T) (b : *T) -> (a -> b -n-> a) -> a -> [b] -m-> a
```
Left fold: combines the elements of a list with an accumulator function,
starting from an initial value and processing the list left to right.

### `foldr`
{: .no_toc}
```freest
foldr : forall #m #n (a : *T) (b : m T) -> (a -> b -n-> b) -> b -> [a] -m-> b
```
Right fold: combines the elements of a list with an accumulator function,
processing the list right to left.

### `takeWhile`
{: .no_toc}
```freest
takeWhile : forall (a : *T) -> (a -> Bool) -> [a] -> [a]
```
The longest prefix of a list all of whose elements satisfy the predicate.

### `dropWhile`
{: .no_toc}
```freest
dropWhile : forall (a : *T) -> (a -> Bool) -> [a] -> [a]
```
Drops the longest prefix of a list all of whose elements satisfy the predicate,
and returns the rest.

### `span`
{: .no_toc}
```freest
span : forall (a : *T) -> (a -> Bool) -> [a] -> ([a], [a])
```
Splits a list into the longest prefix satisfying the predicate and the
remaining suffix. Equivalent to `(takeWhile p xs, dropWhile p xs)`.

### Linear lists
{: .no_toc}

Alongside the unrestricted list type `[a]` (built with `[]` and `::`), the
Prelude also has a *linear* list type, written `[a]'` and built with `[]'` and
`::'`. A linear list can hold linear elements, and — like every linear value —
must be consumed exactly once. The combinators below mirror their unrestricted
counterparts.

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `(++')` | `forall (a : 1T) -> [a]' -> [a]' -1-> [a]'`{: .language-freest } |
| `map'` | `forall (a : 1T) (b : 1T) -> (a -> b) -> [a]' -> [b]'`{: .language-freest } |
| `foldl'` | `forall #m #n (a : m T) (b : 1T) -> (a -> b -n-> a) -> a -> [b]' -m-> a`{: .language-freest } |
| `foldr'` | `forall #m #n (a : 1T) (b : m T) -> (a -> b -n-> b) -> b -> [a]' -m-> b`{: .language-freest } |

### `mapUL` / `mapLU`
{: .no_toc}
```freest
mapUL : forall (a : *T) (b : 1T) -> (a -> b) -> [a] -> [b]'
mapLU : forall (a : 1T) (b : *T) -> (a -> b) -> [a]' -> [b]
```
Convert between the unrestricted and linear list types while mapping a
function over the elements: `mapUL` turns an unrestricted list into a linear
one, `mapLU` turns a linear list into an unrestricted one.

### Strings

### `isSpace`
{: .no_toc}
```freest
isSpace : Char -> Bool
```
`True` for a space or any of the whitespace control characters (tab, newline,
carriage return, ...).

### `words`
{: .no_toc}
```freest
words : String -> [String]
```
Splits a string into a list of whitespace-separated words.

### `unwords`
{: .no_toc}
```freest
unwords : [String] -> String
```
Joins a list of words back into a single string, separated by single spaces.
The inverse of `words` (modulo how repeated whitespace is collapsed).

## Errors

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `undefined` | `forall (a : *T) -> a`{: .language-freest } |
| `error` | `forall (a : 1T) -> String -> a`{: .language-freest } |

## Concurrency

### `fork`
{: .no_toc}
```freest
fork : forall #m (a : *T) -> (() -m-> a) -> ()
```
Spawns a thunk as a new thread. The thunk's return value, of unrestricted base
kind, is discarded.

### `send`
{: .no_toc}
```freest
send : forall #m (a : m T) -> a -> forall (b : 1S) -> !a;b -m-> b
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
sendAndWait : forall #m (a : m T) -> a -> !a ; Wait -m-> ()
```
Sends a value on a given channel and then waits for the channel to be closed.
Returns `()`.

### `sendAndClose`
{: .no_toc}
```freest
sendAndClose : forall #m (a : m T) -> a -> !a ; Close -m-> ()
```
Sends a value on a given channel and then closes the channel. Returns `()`.

### `receiveAndWait`
{: .no_toc}
```freest
receiveAndWait : forall (a : 1T) -> ?a ; Wait -> a
```
Receives a value from a channel that continues to `Wait`, waits for the
continuation and returns the value.

```freest
_ =
  -- create channel endpoints
  let (c, s) = channel @(?String ; Wait) in
  -- fork a thread that prints the received value
  fork (\_ -1-> c |> receiveAndWait @String |> putStrLn);
  -- send a string through the channel (and wait for its endpoint to close)
  s |> send "Hello!" |> close
```

### `receiveAndClose`
{: .no_toc}
```freest
receiveAndClose : forall (a : 1T) -> ?a ; Close -> a
```
As in `receiveAndWait`, only that the continuation is `Close` and the function
closes the channel rather than waiting for it to close.

### `send_`
{: .no_toc}
```freest
send_ : forall #m (a : m T) -> a -> *!a -m-> *!a
```
Sends a value on an unrestricted (shared) channel. Unrestricted version of
`send`. Returns the (unrestricted) channel, so further operations can be
chained.

### `receive_`
{: .no_toc}
```freest
receive_ : forall (a : 1T) -> *?a -> a
```
Receives a value from an unrestricted channel. Unrestricted version of
`receive`. The channel need not be returned: it can be reused as often as
needed.

### `accept`
{: .no_toc}
```freest
accept : forall (a : 1C) -> *!a -> Dual a
```
Session initiation. Accepts a request for a linear session on a shared
channel. The requester uses a `receive_` operation to obtain the channel end.

### `forkWith`
{: .no_toc}
```freest
forkWith : forall #m (a : 1C) (b : *T) -> (Dual a -m-> b) -> a
```
Creates a new child process and a channel through which it can communicate
with its parent process. Returns the channel endpoint. The forked function's
return value, of unrestricted base kind, is discarded.

```freest
_ =
  -- fork a thread that receives a string and prints it
  let c = forkWith @(!String ; Wait) (\s -1-> s |> receiveAndClose @String |> putStrLn) in
  -- send the string to be printed
  c |> send "Hello!" |> wait
```

### `runServer`
{: .no_toc}
```freest
runServer : forall (a : *T) (b : 1C) -> (a -> Dual b -> a) -> a -> *!b -> Void @*T
```
Runs an infinite shared server, given a function to handle one client session,
an initial state, and the server's shared channel endpoint. It behaves as an
infinite sequential application of the handler function over newly accepted
sessions, threading the state through each call. Since it never returns, its
result type is `Void @*T`.

Note: this only works with session types that use session initiation.

```freest
type SharedCounter = *?Counter
type Counter = +{ Inc: Close
                , Dec: Close
                , Get: ?Int ; Close
                }

-- | Handler for a counter
counterService : Int -> Dual Counter -> Int
counterService i (&Inc c) = wait c ; i + 1
counterService i (&Dec c) = wait c ; i - 1
counterService i (&Get c) = c |> send i |> wait ; i

-- | Counter server
runCounterServer : Dual SharedCounter -> Void @*T
runCounterServer = runServer @Int @Counter counterService 0
```

### `times`
{: .no_toc}
```freest
times : forall (a : *T) -> Int -> (() -> a) -> ()
```
Executes a thunk `n` times, sequentially.

```freest
_ =
  -- print "Hello!" 5 times sequentially
  times @() 5 (\_ -> putStrLn "Hello!")
```

### `parallel`
{: .no_toc}
```freest
parallel : forall (a : *T) -> Int -> (() -> a) -> ()
```
Forks `n` identical threads. Works the same as a `times` call, but in parallel
instead of sequentially.

```freest
_ =
  -- print "Hello!" 5 times in parallel
  parallel 5 (\_ -> putStrLn "Hello!")
```

### Fork-join

### `ForkJoin`
{: .no_toc}
```freest
type ForkJoin = *+{Over}
```
A simple channel-based fork-join coordination protocol: each child thread
signals completion by selecting the `Over` branch, and the parent thread waits
for a fixed number of such completions.

### `join`
{: .no_toc}
```freest
join : ForkJoin -> ()
```
Signals completion of a child thread to the parent waiting on the join
channel.

### `await`
{: .no_toc}
```freest
await : Int -> Dual ForkJoin -> ()
```
Waits until `n` child threads have signalled completion through the join
channel.

```freest
_ =
  let (w, r) = channel @ForkJoin in
  fork (\_ -> putChar 'A'; join w) ;
  fork (\_ -> putChar 'B'; join w) ;
  fork (\_ -> putChar 'C'; join w) ;
  await 3 r
```

## I/O

### I/O streams

**Input stream**

### `InStream`
{: .no_toc}
```freest
type InStream : 1C
type InStream = +{ GetChar : ?Char   ; InStream
                 , GetLine : ?String ; InStream
                 , IsEOF   : ?Bool   ; InStream
                 , Stop    : Wait
                 }
```

The `InStream` type describes input streams (such as `stdin` and read files).
`GetChar` reads a single character, `GetLine` reads a line, and `IsEOF` checks
for the EOF (End-Of-File) token, i.e., if an input stream has reached the end.
Operations on this channel terminate with the `Stop` option.

### `hGenericGet`
{: .no_toc}
```freest
hGenericGet : forall (a : *T) -> (InStream -> ?a; InStream) -> InStream -> (a, InStream)
```
Reads a value selected from an `InStream` by a selector (e.g. `select
GetChar`), returning the value and the continuation channel endpoint. This is
how `hGetChar`, `hGetLine` and `hIsEOF` are themselves defined, e.g. `hGetChar
= hGenericGet (select GetChar)`.

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
Checks if an `InStream` reached the EOF token that marks where no more input
can be read. Behaves as `|> select IsEOF |> receive`.

### `hGetContent`
{: .no_toc}
```freest
hGetContent : InStream -> (String, InStream)
```
Reads an `InStream` channel endpoint all the way to EOF, separating lines with
the newline character `\n`, and returns the accumulated content together with
the (now exhausted) continuation channel.

### `hCloseIn`
{: .no_toc}
```freest
hCloseIn : InStream -> ()
```
Closes an `InStream` channel endpoint. Behaves as `|> select Stop |> wait`.

### `hGenericGet_`
{: .no_toc}
```freest
hGenericGet_ : forall (a : *T) -> (InStream -> (a, InStream)) -> *?InStream -> a
```
The unrestricted version of an `InStream` getter: receives the `InStream`
channel endpoint (via session initiation), runs the getter, closes the
endpoint with `hCloseIn`, and returns the value. This is how `hGetChar_` and
`hGetLine_` are themselves defined, e.g. `hGetChar_ = hGenericGet_ hGetChar`.

### `hGetChar_`
{: .no_toc}
```freest
hGetChar_ : *?InStream -> Char
```
Unrestricted version of `hGetChar`. Behaves the same, except it first receives
an `InStream` channel endpoint (via session initiation), executes an
`hGetChar` and then closes the endpoint with `hCloseIn`.

### `hGetLine_`
{: .no_toc}
```freest
hGetLine_ : *?InStream -> String
```
Unrestricted version of `hGetLine`. Behaves the same, except it first receives
an `InStream` channel endpoint (via session initiation), executes an
`hGetLine` and then closes the endpoint with `hCloseIn`.

**Output stream**

### `OutStream`
{: .no_toc}
```freest
type OutStream : 1C
type OutStream = +{ PutStr   : !String ; OutStream
                  , PutStrLn : !String ; OutStream
                  , Stop     : Wait
                  }
```

The `OutStream` type describes output streams (such as `stdout`, `stderr` and
write mode files). `PutStr` outputs a string, and `PutStrLn` outputs a string
followed by the newline character (`\n`). Operations on this channel must end
with the `Stop` option.

### `hGenericPut`
{: .no_toc}
```freest
hGenericPut : forall (a : *T) -> (OutStream -> !a; OutStream) -> a -> OutStream -> OutStream
```
Writes a value on an `OutStream` through a selector (e.g. `select PutStr`),
returning the continuation channel endpoint. This is how `hPutStr` and
`hPutStrLn` are themselves defined, e.g. `hPutStr = hGenericPut (select
PutStr)`.

### `hPutStr`
{: .no_toc}
```freest
hPutStr : String -> OutStream -> OutStream
```
Writes a string on an `OutStream` channel endpoint. Behaves as
`|> select PutStr |> send`.

### `hPutStrLn`
{: .no_toc}
```freest
hPutStrLn : String -> OutStream -> OutStream
```
Writes a string on an `OutStream` channel endpoint, followed by the newline
character. Behaves as `|> select PutStrLn |> send`.

### `hPutChar`
{: .no_toc}
```freest
hPutChar : Char -> OutStream -> OutStream
```
Writes a character on an `OutStream` channel endpoint. There is no dedicated
protocol branch for single characters: this is implemented as `hPutStr [c]`,
sending the character as a one-character string.

### `hPrint`
{: .no_toc}
```freest
hPrint : forall (a : *T) -> a -> OutStream -> OutStream
```
Writes the string representation of a value on an `OutStream` channel
endpoint, followed by the newline character. Behaves as `hPutStrLn . show`.

### `hCloseOut`
{: .no_toc}
```freest
hCloseOut : OutStream -> ()
```
Closes an `OutStream` channel endpoint. Behaves as `|> select Stop |> wait`.

### `hGenericPut_`
{: .no_toc}
```freest
hGenericPut_ : forall (a : *T) -> (a -> OutStream -> OutStream) -> a -> *?OutStream -> ()
```
The unrestricted version of an `OutStream` putter: receives the `OutStream`
channel endpoint (via session initiation), runs the putter, and closes the
endpoint with `hCloseOut`. This is how `hPutChar_`, `hPutStr_`, `hPutStrLn_`
and `hPrint_` are themselves defined, e.g. `hPutChar_ = hGenericPut_
hPutChar`.

### `hPutChar_`
{: .no_toc}
```freest
hPutChar_ : Char -> *?OutStream -> ()
```
Unrestricted version of `hPutChar`. Behaves the same, except it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPutChar` and then closes the endpoint with `hCloseOut`.

### `hPutStr_`
{: .no_toc}
```freest
hPutStr_ : String -> *?OutStream -> ()
```
Unrestricted version of `hPutStr`. Behaves similarly, except that it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPutStr` and then closes the endpoint with `hCloseOut`.

### `hPutStrLn_`
{: .no_toc}
```freest
hPutStrLn_ : String -> *?OutStream -> ()
```
Unrestricted version of `hPutStrLn`. Behaves similarly, except that it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPutStrLn` and then closes the endpoint with `hCloseOut`.

### `hPrint_`
{: .no_toc}
```freest
hPrint_ : forall (a : *T) -> a -> *?OutStream -> ()
```
Unrestricted version of `hPrint`. Behaves similarly, except that it first
receives an `OutStream` channel endpoint (via session initiation), executes
an `hPrint` and then closes the endpoint with `hCloseOut`.

### Standard I/O

**stdin**

{: .lib-table}
| Function | Type | Description |
|:---------|:-----|:------------|
| `stdin` | `*?InStream`{: .language-freest } | Standard input stream. Reads from the console. |
| `getChar` | `() -> Char`{: .language-freest } | Reads a single character from `stdin`. |
| `getLine` | `() -> String`{: .language-freest } | Reads a single line from `stdin`. |

**stdout and stderr**

{: .lib-table}
| Function | Type | Description |
|:---------|:-----|:------------|
| `stdout` | `*?OutStream`{: .language-freest } | Standard output stream. Prints to the console, via the `h*_` functions (e.g. `hPutStrLn_ s stdout`) or the `put*` wrappers below. |
| `stderr` | `*?OutStream`{: .language-freest } | Standard error stream. Prints to the console, via the `h*_` functions (e.g. `hPutStrLn_ s stderr`); unlike `stdout`, it has no dedicated `put*` wrappers. |
| `putChar` | `Char -> ()`{: .language-freest } | Prints a character to `stdout`. Behaves the same as `hPutChar_ c stdout`, where `c` is the character to be printed. |
| `putStr` | `String -> ()`{: .language-freest } | Prints a string to `stdout`. Behaves the same as `hPutStr_ s stdout`, where `s` is the string to be printed. |
| `putStrLn` | `String -> ()`{: .language-freest } | Prints a string to `stdout`, followed by the newline character `\n`. Behaves as `hPutStrLn_ s stdout`, where `s` is the string to be printed. |
| `print` | `forall (U : *T) -> U -> ()`{: .language-freest } | Prints the string representation of a given value to `stdout`, followed by the newline character `\n`. Behaves the same as `hPrint_ @U v stdout`, where `v` is the value to be printed and `U` its type. |

### Files

FreeST models files as streams: reading opens an `InStream`, writing or
appending opens an `OutStream`. Opening currently raises an error on failure
rather than returning a `Maybe`, since a total variant would need a *linear*
`Maybe` (`Maybe` is `*T -> *T`, but the streams are `1C`) — that is not yet
available.

### `FilePath`
{: .no_toc}
```freest
type FilePath : *T
type FilePath = String
```

### `openReadFile`
{: .no_toc}
```freest
openReadFile : FilePath -> InStream
```
Opens a file for reading. The file is closed when the stream is.

### `openWriteFile`
{: .no_toc}
```freest
openWriteFile : FilePath -> OutStream
```
Opens a file for writing, discarding its current content.

### `openAppendFile`
{: .no_toc}
```freest
openAppendFile : FilePath -> OutStream
```
Opens a file for writing, after its current content.

### `readFile`
{: .no_toc}
```freest
readFile : FilePath -> String
```
The entire content of a file, separating lines with `\n`. Behaves as
`openReadFile` followed by `hGetContent` and `hCloseIn`.

### `writeFile`
{: .no_toc}
```freest
writeFile : FilePath -> String -> ()
```
Writes a string to a file, discarding its current content.

### `appendFile`
{: .no_toc}
```freest
appendFile : FilePath -> String -> ()
```
Writes a string to a file, after its current content.

### Command line

{: .lib-table}
| Function | Type | Description |
|:---------|:-----|:------------|
| `getArgs` | `() -> [String]`{: .language-freest } | The arguments the program was run with, excluding the program name. |
| `getProgName` | `() -> String`{: .language-freest } | The name the program was run under. |

### Environment

### `lookupEnv`
{: .no_toc}
```freest
lookupEnv : String -> Maybe String
```
The value of an environment variable, if it is set.

### `getEnv`
{: .no_toc}
```freest
getEnv : String -> String
```
The value of an environment variable, which must be set. Behaves as
`lookupEnv`, but errors instead of returning `Nothing` when the variable is
unset.

### `getEnvironment`
{: .no_toc}
```freest
getEnvironment : () -> [(String, String)]
```
The whole environment, as name-value pairs.

### Exiting

### `exitWith`
{: .no_toc}
```freest
exitWith : forall (a : 1T) -> Int -> a
```
Terminates the program, reporting success for an exit code of `0` and failure
for any other. Called from a forked thread, terminates that thread alone. Its
result type is universally quantified since, like `Void`, it never actually
produces a value.

### `exitSuccess` / `exitFailure`
{: .no_toc}
```freest
exitSuccess : forall (a : 1T) -> () -> a
exitFailure : forall (a : 1T) -> () -> a
```
Shorthands for `exitWith 0` and `exitWith 1`, respectively.
