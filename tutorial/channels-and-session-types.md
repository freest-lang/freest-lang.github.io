---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Channels and session types
layout: default
nav_order: 4
parent: Tutorial
---

# Channels and session types
{: .no_toc }

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

Channels are how FreeST threads communicate with each other. Each channel is made of **two endpoints** (usually abbreviated as channel ends). Threads use the endpoints to write to or read from channels.

## Session types and duality

Channels behave according to predefined **protocols**. A protocol is just a type, a type of a special nature, a **session type**. Protocols are built from eight **basic elements of interaction**:

| Session type | Meaning |
| --- | --- |
| `!T`{: .language-freest } | send value of type `T`{: .language-freest } |
| `?T`{: .language-freest } | receive value of type `T`{: .language-freest } |
| `!type T`{: .language-freest } | send a type `T`{: .language-freest } |
| `?type T`{: .language-freest } | receive a type `T`{: .language-freest } |
| `+{l: T, ...}`{: .language-freest } | select a choice |
| `&{l: T, ...}`{: .language-freest } | offer a collection of choices |
| `Close`{: .language-freest } | close the channel |
| `Wait`{: .language-freest } | wait for the channel to be closed |

The two endpoints of a channel are usually held by two different threads. These threads do not observe the endpoint equally. In fact they must follow different protocols. Imagine that both threads see the endpoint at type `!Int`{: .language-freest }. Then, to conform to the protocol, both threads must write on the channel. In order for communication to proceed smoothly one of the threads must write an integer value and the other must read the value, that is, one thread must see the channel as `?Int`{: .language-freest } and the other as `!Int`{: .language-freest }. These two types are said to be **dual** to each other. In fact, the eight basic elements of interaction come in dual pairs as follows:

| `S`{: .language-freest } | `Dual S`{: .language-freest } |
| --- | --- |
| `!T`{: .language-freest } | `?T`{: .language-freest } |
| `!type a. T`{: .language-freest } | `?type a. Dual T`{: .language-freest } |
| `+{l: T, ...}`{: .language-freest } | `&{l: Dual T, ...}`{: .language-freest } |
| `Close`{: .language-freest } | `Wait`{: .language-freest } |

The dual of a positive type is a negative type, and conversely:

| `S`{: .language-freest } | `Dual S`{: .language-freest } |
| --- | --- |
| `?T`{: .language-freest } | `!T`{: .language-freest } |
| `?type a. T`{: .language-freest } | `!type a. Dual T`{: .language-freest } |
| `&{l: T, ...}`{: .language-freest } | `+{l: Dual T, ...}`{: .language-freest } |
| `Wait`{: .language-freest } | `Close`{: .language-freest } |

Type operator `Dual`{: .language-freest } converts a session type into its dual, and can be used in FreeST code. It is an involution, so that `Dual (Dual S) = S`{: .language-freest }, for all types `S`{: .language-freest }. For example `Dual (Dual !Bool) = Dual (?Bool) = !Bool`{: .language-freest }.

 The elements of interaction may be composed by means of sequential composition and recursion. We start with sequential composition and leave recursion for later (see [*unbounded protocols*](#unbounded-protocols)).
 
 The sequential composition of (session) types is denoted by the semicolon binary operator. If `T`{: .language-freest } and `U`{: .language-freest } are session types, then type `T ; U`{: .language-freest } denotes the type that first performs `T`{: .language-freest } and then `U`{: .language-freest }.
Sequential composition has a unit, the session type `Skip`{: .language-freest }: performing `Skip`{: .language-freest } does nothing, so `Skip ; T`{: .language-freest } is the same as `T`{: .language-freest }.

| Session type | Meaning |
| --- | --- |
| `T ; U`{: .language-freest } | perform `T`{: .language-freest } then `U`{: .language-freest } |
| `Skip`{: .language-freest } | do nothing |

Duality distributes over sequential composition, and `Skip`{: .language-freest } is self-dual:

| `S`{: .language-freest } | `Dual S`{: .language-freest } |
| --- | --- |
| `T ; U`{: .language-freest } | `Dual T ; Dual U`{: .language-freest } |
| `Skip`{: .language-freest } | `Skip`{: .language-freest } |

## Exchanging values and closing channels

Let us start with a very basic protocol: send an integer and then close the channel. This is written as `!Int ; Close`{: .language-freest }. Let us now write a consumer for this type, that is, a function that receives a channel of type `!Int ; Close`{: .language-freest } and exhausts the channel (that is, sends a value and closes the channel). Primitive functions `send`{: .language-freest } and `close`{: .language-freest } send a value to a given channel and close a given channel, respectively. The former returns a pair composed of a value and a channel endpoint (on which to continue the interaction), the latter returns `()`{: .language-freest }, the unit type.

```freest
writeFive : !Int ; Close -> ()
writeFive c =
  let c' = send 5 c in close c'
```

What is important to notice here is that `send`{: .language-freest } returns a channel endpoint of a different type: `c`{: .language-freest } is of type `!Int ; Close`{: .language-freest } and `c'`{: .language-freest } is of type `Close`{: .language-freest }. In more "functional" style, one can omit the `let`{: .language-freest } and write:
```freest
writeFive' : !Int ; Close -> ()
writeFive' c =
  close (send 5 c)
```
Pointfree programming offers another variant, where `(.)`{: .language-freest } is the function composition operator:
```freest
writeFive'' : !Int ; Close -> ()
writeFive'' = close . send 5
```
Do not forget that we first do `send`{: .language-freest } and only then `close`{: .language-freest }. If one is looking for a forward reading then we may use the *reverse function application* operator `|>`{: .language-freest } to get:
```freest
writeFive''' : !Int ; Close -> ()
writeFive''; c =
  c |> send 5 |> close
```
This is our preferred style. The `|>`{: .language-freest } operator is included in the Prelude and defined as `(|>) x f = f x`{: .language-freest }; it is *reverse* function application: ordinary application is `\f -> \x -> f x`{: .language-freest }, whereas here we have `\x -> \f -> f x`{: .language-freest }. We defer the study of its type to section "Multiplicity polymorphism".

 In fact, this idiom (send and close) is so common that the Prelude has a name for it: `sendAndClose`{: .language-freest }. Using the new combinator, `writeFive`{: .language-freest } can be further simplified:
 ```freest
writeFive''' : !Int ; Close -> ()
writeFive''' = sendAndClose 5
```
 
 At this point it is worth studying what the type system of FreeST gives us. Channel endpoints such as the above are **linear**. They cannot be copied or discarded. This is central to the goal of ensuring that communication follows smoothly. Suppose we try to reuse channel `c`{: .language-freest } after having used it in the `send`{: .language-freest } function:
```freest
writeFive : !Int ; Close -> ()
writeFive c =
  let c' = send 5 c in close c
```
The FreeST type checker flags the slip as follows:
```bash
SendClose.fst:5:30–9:31: error:
Variable out of scope: `c`
  | 
5 |   let c' = send 5 c in close c
  |                              ^
```
Suppose now that we forget closing the channel:
```freest
writeFive : !Int ; Close -> ()
writeFive c =
  let c' = send 5 c in ()
```
The type checker complains that the scope of variable `c'`{: .language-freest } ended and the variable was not consumed.
```bash
SendClose.fst:5:7–5:9: error:
Linear variable `c'` of type `Close` is not consumed
  | 
5 |   let c' = send 5 c in ()
  |       ^^
  hint: consume it with `close`
```

Now suppose we try to write two values on the channel, one after the other:
```freest
writeFive' : !Int ; Close -> ()
writeFive' c =
  let c' = send 5 c
      c'' = send 7 c'
  in close c''
```
The type checker complains that the code does not follow the protocol, in particular that, in order to write an integer value in a channel, its type must be of type `!Int`{: .language-freest }, not `Close`{: .language-freest }.
```bash
SendClose.fst:5:20–10:22: error:
Couldn't match expected type `!Int; ạ` with actual type `Close`
  | 
5 |       c'' = send 7 c'
  |                    ^^
```

Let us now look at the other end of the channel and write a consumer for type `?Int; Wait`{: .language-freest }. This time we use primitive functions `receive`{: .language-freest } and `wait`{: .language-freest }. The former returns a pair composed of the value dequeued from the channel endpoint and the continuation endpoint, the latter returns `()`{: .language-freest }.
```freest
readInt : ?Int ; Wait -> ()
readInt c =
  let (_, c') = receive c in wait c'
```

If we would rather return the value just read, we may use the semicolon operation *on expressions* (not on types) as follows:
```freest
readInt' : ?Int ; Wait -> Int
readInt' c =
  let (x, c') = receive c in wait c' ; x
```
Once again, this pattern is so common that the Prelude provides for a combinator `receiveAndWait : ?a; Wait -> a`{: .language-freest }. Then we can use `receiveAndWait`{: .language-freest } in place of `readInt'`{: .language-freest } as follows:
```freest
readInt'' : ?Int ; Wait -> Int
readInt'' = receiveAndWait
```

**Note.** The easiest way to check the type of a primitive operator is to ask FreeST's interactive console `freest -i`:
 ```bash
$ freest -i
The FreeST Compiler, version 5.0, https://freest-lang.github.io/, :h for help
Ok, no modules loaded.
freest> :t receiveAndWait
receiveAndWait : forall (a : 1T) -*-> ?a; Wait -*-> a
```

Let us try a slightly more complex protocol: that of a remote adder. The remote adder reads two integer values and writes an integer, before waiting for the channel to be closed. The type of the communication channel is `?Int ; ?Int ; !Int ; Wait`{: .language-freest }. A consumer for the channel is as follows:
```freest
adder : ?Int ; ?Int ; !Int ; Wait -> ()
adder c =
  let (x, c) = receive c
      (y, c) = receive c
  in sendAndWait (x + y) c
```
Notice that we don't use different names for the different incarnations of channel `c`{: .language-freest }. The channel is rebound twice, always with its original name, `c`{: .language-freest }. This is quite common in FreeST source code.

The other end of the channel is of type `!Int ; !Int ; ?Int ; Close`{: .language-freest }. A function that consumes such a channel can be concisely written with the reverse function application operator `|>`{: .language-freest } and the Prelude function `receiveAndClose`{: .language-freest }.
```freest
onePlusOne : !Int ; !Int ; ?Int ; Close -> Int
onePlusOne c =
  c |> send 1 |> send 1 |> receiveAndClose
```


## Pattern matching on session input operations

Pattern matching provides for concise and readable code. Apart from the conventional pattern matching on datatypes and literals, FreeST supports
pattern matching on all input (also known as negative) operations. We have discussed two so far: receiving a message and waiting for a channel to be closed.

We have seen a function `readInt : ?Int ; Wait -> ()`{: .language-freest } that reads an integer value and then waits for the channel to be closed. This can be written as follows.
```freest
readInt : ?Int ; Wait -> ()
readInt (?x ; Wait) = print x
```
Pattern `(?x ; p)`{: .language-freest } receives a value from a channel (the channel argument to the function), binds the value to `x`{: .language-freest } and continues as prescribed by pattern `p`{: .language-freest }. So this pattern matches type `?T ; U`{: .language-freest } if `p`{: .language-freest } is a pattern of type `U`{: .language-freest }. In this case the continuation `p`{: .language-freest } stands for `Wait`{: .language-freest }, and `Wait`{: .language-freest } is the pattern for type `Wait`{: .language-freest } (the pattern and the type shared the same name).

Patterns may have as many semicolons as needed. For example to print the sum of three integer values read from a channel (and waiting for the channel to be closed), one can write
```freest
sumThree : ?Int ; ?Int ; ?Int ; Wait -> ()
sumThree (?x ; ?y ; ?z ; Wait) = print $ x + y + z
```

Pattern matching on sessions is available only for input operations; one cannot pattern match on send or close. There are two further session patterns that we discuss below.


## Creating new channels and new threads

At this point we have a consumer for endpoint `?Int ; ?Int ; !Int ; Wait`{: .language-freest } and another for the dual endpoint `!Int ; !Int ; ?Int ; Close`{: .language-freest }. How do we put the two together in a program? We need to create a new channel and to fork a new thread. The plan is for "main" to fork a thread with the code for the `adder`{: .language-freest } and continue with `onePlusOne`{: .language-freest }.

The more concise, and also the safest, way is to use the Prelude combinator `forkWith`{: .language-freest }. The combinator receives a function `f`{: .language-freest } (from a channel `T`{: .language-freest } to type `()`{: .language-freest }) and creates a channel of type `T`{: .language-freest }. Then uses one of the thus obtained channel ends, say `y`{: .language-freest }, to fork a thread running `f y`{: .language-freest } and returns the other end of the channel, say `x`{: .language-freest }.

For example, the expression below is expected to print `2`{: .language-freest } on the console.
```freest
forkWith adder |> onePlusOne |> print
```

If the above syntax seems confusing, you may always use plain old function application, but you'd better read the code right-to-left.
```freest
print (onePlusOne (forkWith adder))
```
or
```freest
print $ onePlusOne $ forkWith adder
```


<!-- ## A word on the semicolon expression operator

Expression `receive c in wait c'`{: .language-freest } is of type `()`{: .language-freest }, an *unrestricted* type. And that is the reason why it can de discarded in expression `receive c in wait c' ; x`{: .language-freest }.

The type of the semicolon operator is `forall (a : *T) (b : 1T) -> a -> b -> b`{: .language-freest }. [To be Completed] -->


## Selecting and offering choices

We have seen how to exchange values on channels and how to close channels. We now look at how we select and offer choices on channels. Imagine a channel offering three choices after which it waits for the channel to be closed, in all cases. The channel can be written `&{Green: Wait, Yellow: Wait, Red: Wait}`{: .language-freest }, a traffic light as seen from the point of view of the reader.

A function that consumes one such channel endpoint and returns an appropriate string, needs to take a different action depending on the choice found at the front of the queue. The easiest way to deconstruct an `&`{: .language-freest } type is to use pattern matching.
```freest
showColour : &{Green: Wait, Yellow: Wait, Red: Wait} -> String
showColour (&Green  Wait) = "Green"
showColour (&Yellow Wait) = "Yellow"
showColour (&Red    Wait) = "Red"
```

If pattern matching is not an option, one can always try a `case`{: .language-freest } expression:
```freest
showColour' : &{Green: Wait, Yellow: Wait, Red: Wait} -> String
showColour' s = case s of
  &Green s  -> wait s ; "Green"
  &Yellow s -> wait s ; "Yellow"
  &Red s    -> wait s ; "Red"
```
Notice that `s`{: .language-freest } is once again rebound in each case, under the same name.

The dual of the traffic light type, that is the type of the other channel endpoint, is `+{Green: Close, Yellow: Close, Red: Close}`{: .language-freest }. To consume one such channel endpoint, we take advantage of expression `select Green`{: .language-freest } (in this case):
```freest
selectGreen : +{Green: Close, Yellow: Close, Red: Close} -> ()
selectGreen c = c |> select Green |> close
```
Since `select Green`{: .language-freest } is an expression (`select`{: .language-freest } alone is not), one may as well write the above function using point-free programming, taking advantage of the function composition operator `.`{: .language-freest }:
```freest
selectGreen' : +{Green: Close, Yellow: Close, Red: Close} -> ()
selectGreen' = close . select Green
```

Putting the two functions together in a FreeST script we may write:
```freest
_ = forkWith selectGreen |> showColour |> putStrLn
```
and expect to read `Green`{: .language-freest } on the console.


## Exchanging types

The last pair of dual session operators provides for exchanging types on channels. This is closely related to conventional (universal and existential) polymorphism, but applied to session types. Exchanging types allows writing protocols in which subsequent actions depend on the type exchanged.

Imagine a rendering service that transforms to strings values of different types. Clearly the service cannot know in advance all types in the world, and hence we leave it to the client to supply the function that converts its type to a string. So, in the end, the role of the server is to conduct the (possibly heavy) process of converting a value into a string, given a client-supplied rendering function.

To accept a type on a channel, bind it to type variable `a`{: .language-freest }, and then continue as `T`{: .language-freest }, one writes `?type a. T`{: .language-freest }. With this in mind, the type of the channel the rendering service reads is:
```freest
?type a. ?(a -1-> String) ; ?a ; !String ; Wait 
```
Here we have chosen a linear function, `a -1-> String`{: .language-freest }, as a way of signaling the client that the service will not reuse the function, but we could equally have used an unrestricted function `a -> String`{: .language-freest }.

The best way to receive a type is to use pattern-matching. The pattern `?type a. p`{: .language-freest } receives a type, binds it to `a`{: .language-freest } and continues as pattern `p`{: .language-freest }. The pattern may then use type variable `a`{: .language-freest } if needed. Back to our example, the first three operations on the channel are all of input nature, and that calls for a four-level-deep pattern: receive a type `a`{: .language-freest }, receive a value `f`{: .language-freest }, receive a value `x`{: .language-freest }, and continue with channel `c`{: .language-freest }. Then we apply `x`{: .language-freest } to `f`{: .language-freest } and call the Prelude function `sendAndWait`{: .language-freest } to send `f x`{: .language-freest } and wait for the channel to be closed.

```freest
render : ?type a. ?(a -1-> String) ; ?a ; !String ; Wait -> ()
render (?type a. ?f ; ?x ; c) =
  sendAndWait (f x) c
```

To interact with `render`{: .language-freest } we need to choose a type `T`{: .language-freest }, provide for a function to convert `T`{: .language-freest } into a string, send a value of type `T`{: .language-freest }, wait for a string, and close the channel. To send a type `T`{: .language-freest } we use expression `sendType @T`{: .language-freest } which returns the continuation channel endpoint. Here's a client that chooses `Char`{: .language-freest } for `T`{: .language-freest }. We use the reverse function application operator `|>`{: .language-freest } to chain all three outputs, and then use the Prelude's function `receiveAndClose`{: .language-freest } to complete the protocol.
```freest
charRenderer : !type a. !(a -1-> String) ; !a ; ?String ; Close -> String
charRenderer c =
  c |> sendType @Char |> send showChar |> send 'F' |> receiveAndClose
  where
    showChar : Char -1-> String
    showChar c = "My favourite char is " ++ show c
```

Here's a different client that interacts with the renderer by using a pair `(String, Float)`{: .language-freest }.
```freest
pairRenderer : !type a. !(a -1-> String) ; !a ; ?String ; Close -> String
pairRenderer c =
  c |> sendType @(String, Float) |> send showPair |> send ("FreeST", 5.0) |> receiveAndClose
  where
    showPair : (String, Float) -1-> String
    showPair (x, y) = x ++ " " ++ show y
```

To put a server and a client together, we proceed as usual.
```freest
_ = forkWith render |> pairRenderer |> print
```
Expect to read `FreeST 5.0` on the console.


## A summary of the basic elements of interaction

The table below summarises what we have seen on session type operations.

| `S`{: .language-freest } | `Dual S`{: .language-freest } | Operation |
| --- | --- | --- |
| `!T`{: .language-freest } | `?T`{: .language-freest } | Value exchange |
| `!type a. T`{: .language-freest } | `?type a. Dual T`{: .language-freest } | Type exchange |
| `+{l: T, ...}`{: .language-freest } | `&{l: Dual T, ...}`{: .language-freest } | Choice |
| `Close`{: .language-freest } | `Wait`{: .language-freest } | Channel closing |
| Output | Input |  |
| Positive | Negative |  |
| Chaining available | Pattern matching available |  |
| Nonblocking operation | Blocking operation |  |

By 'chaining' we mean the composition of output operations with the inverse function application `|>`{: .language-freest }.

Each positive type has a corresponding chaining operator:

| Positive type | Operator | Chaining operator |
| --- | --- | --- |
| `!U`{: .language-freest } | `send : forall #m -> forall (a : mT) -> a -> (forall (b : 1S) -> !a; b -m-> b)`{: .language-freest } | `c |> send v |> ...`{: .language-freest } |
| `!type a. U`{: .language-freest } | `sendType @V : !type a. W -> W[V/a]`{: .language-freest } | `c |> sendType @T |> ...`{: .language-freest } |
| `+{l: U, ...}`{: .language-freest } | `select l : +{l: U, ...} -> U`{: .language-freest }| `c |> select l |> ...`{: .language-freest } |
| `Close`{: .language-freest } | `close : Close -> ()`{: .language-freest } | `c |> close`{: .language-freest } |

In the case of send type, notation `W[V/a]`{: .language-freest } denotes the result of replacing (free) occurrences of type variable `a`{: .language-freest } by type `U`{: .language-freest }. For example, `(a, Bool)[a/Char]`{: .language-freest } = `(Char, Bool)`{: .language-freest }.

Dually, each negative type has a corresponding pattern:

| Negative type | Operator | Pattern |
| --- | --- | --- |
| `?U`{: .language-freest } | `receive : forall (a : 1T) (b : 1S) -> ?a; b -> (a, b)`{: .language-freest } | `?x ; p`{: .language-freest } |
| `?type a. U`{: .language-freest } | `receiveType : (?type (a : k). U) -> (exists (a : k), U)`{: .language-freest } | `?type a. p`{: .language-freest } |
| `&{l: U, ...}`{: .language-freest } | `case exp of &l p -> ...`{: .language-freest } | `&l p`{: .language-freest } |
| `Wait`{: .language-freest } | `wait : Wait -> ()`{: .language-freest } | `Wait`{: .language-freest } |

In the case of receive type, we see that the result of a call to `receiveType`{: .language-freest } is an existential type (existential types are further developed in [*session existentials and universals*](existentials.md#session-existentials-and-universals)).

<!-- ***Note:*** Some of the operators in the above two tables can only be used in *check* mode. They include `select`{: .language-freest }, `sendType`{: .language-freest } and `receiveType`{: .language-freest }. For example, `select Done`{: .language-freest } in *infer* mode fails, but if we provide the intended type (via ascprition), then compiler infers the expected type.
```bash
$ freest -i
The FreeST Compiler, version 5.0, https://freest-lang.github.io/, :h for help
Ok, no modules loaded.
freest> :t select Done
<interactive0>:1:1–1:12: error:
Could not infer a type for this `select` expression
  | 
1 | select Done
  | ^^^^^^^^^^^
freest> :t select Done : +{Done: Close} -> Close
(select Done : +{Done: Close} -> Close) : +{Done: Close} -> Close
``` -->


## Unbounded protocols

All protocols we have seen so far comprise a fixed number of interactions. For example, to consume type `?type a. ?(a -1-> String) ; ?a ; !String ; Wait`{: .language-freest }, five interactions are needed.

There are however cases when one cannot anticipate the exact number of interactions. Imagine a server that reads from a channel integer values until a negative value is received. Clearly the type constructors we have seen so far cannot describe this protocol. Here's how the server may act: receive a value; if negative signal the client that no more numbers are expected; if positive ask for a new number. In the former case the server waits for the channel to be closed; in the latter the server "goes back to the beginning" of the protocol. To implement the "going back" part we name the protocol and use this name as a type.

Then, the `Repeat`{: .language-freest } protocol becomes: receive an int, select between options `Done`{: .language-freest } or `More`{: .language-freest }. If the former is selected, `Wait`{: .language-freest }, otherwise `Repeat`{: .language-freest }:
```freest
type Repeat = ?Int ; +{Done: Wait, More: Repeat}
```

For a consumer of type `Repeat`{: .language-freest } we set up an adder that sums all numbers until a negative number is encountered. Notice the first guard `x < 0`{: .language-freest }, leading to `select Done`{: .language-freest } and then `wait`{: .language-freest }. The result is `0`{: .language-freest } in this case. The second guard, being the negation of the first, is not strictly needed.
```freest
adder : Repeat -> Int
adder (?x ; c) | x < 0  =      c |> select Done |> wait ; 0
adder (?x ; c) | x >= 0 = x + (c |> select More |> adder)
```

For the client, we set up a function that consumes the dual of `Repeat`{: .language-freest }. The difficult, error-prone way, is to define a different type, for example `Feed`{: .language-freest } or `CoRepeat`{: .language-freest }. The easy way is to use the `Dual`{: .language-freest } type operator, that takes a session type and returns another session type, with all operations dualised.

Then a client that sums the first `n`{: .language-freest } natural numbers can be written as follows.
```freest
sumTo : Int -> Dual Repeat -> ()
sumTo n c = case send n c of
  &More c -> sumTo (n - 1) c
  &Done c -> close c
```

Finally, we put the two processes together as we have done before. Expect to read `55`{: .language-freest } on the console.
```freest
_ = forkWith (sumTo 10) |> adder |> print
```

***Note:*** 
Most functional programming languages provide for *type abbreviations*, often introduced with keyword `type`{: .language-freest }. FreeST is no exception. For example
```freest
type IntPair = (Int, Int)
```
introduces a name for type `(Int, Int)`{: .language-freest }. Code may use `IntPair`{: .language-freest } and `(Int, Int)`{: .language-freest } interchangeably.

But the `type`{: .language-freest } keyword in FreeST may introduce genuine new types, as `Repeat`{: .language-freest } above. This is a recursive type and the only means of introducing recursive types is via a `type`{: .language-freest } construction. 
