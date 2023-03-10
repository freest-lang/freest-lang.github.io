---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Getting started
layout: default
nav_order: 5
---

# Getting started (WIP)

<!-- small introduction -->
<!-- similar languages to freest -->
<!-- - Haskell -->
<!-- why is freest different -->
<!-- - linearity -->
<!-- - session types -->
<!-- - why is it better in its domain -->
<!-- - builtin features are simpler to use -->
<!-- - context-free session types -->

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>


<!-- # Getting everything ready -->
<!-- where to download -->
<!-- pre-requisites to install -->
<!-- how to install -->
<!-- `freest` basic usage -->
<!-- `freesti` basic usage -->



# Functional FreeST
<!-- freest is a functional language -->
<!-- everything is a function -->

## Types

FreeST has as primitive types:
- `()` (Unit), the simplest type possible, it contains no information
- `Bool`, can be `True` or `False`
- `Int`, for integers
- `Char`, for single characters
- `String`, for strings of text

Furthermore, we can also join these types into **tuples**. A tuple can have two elements 
    `(Int, String)` or as many you want `(Bool, Int, Int, Char, String)`.

## Functions, functions everywhere
In FreeST, much like in every other functional language, everything is a function (or a composition 
    of functions). To sum numbers is to apply function `(+)` to two numbers. To sum 1 and 2 is to 
    write `(+) 1 2`. However, because function `(+)` is considered an **operator**, we can also 
    write `1 + 2`. 

<!-- function signatures -->
All functions must have a **signature** (a type), that describes both its input parameters and 
    return value. A function's signature has the syntax 
    `<Parameter#1> -> ... -> <Parameter#n> -> <Return>`. For example, the type of `(+)` is 
    `Int -> Int -> Int`, a function that takes two integers and returns an integer.
    
<!-- how to define a function -->
To define functions, simply state the function's name and signature and then its body. Let's create
    our own `plus` function based on the `(+)` operator:
```
plus : Int -> Int -> Int    -- signature
plus x y = x + y            -- body
```

<!-- function body -->
<!-- lack of return statement -->
The function's body consists of the name of the function, the variables described in the signature
    followed by the logic itself. Note that there is **no return** statement, this is because the 
    entire expression is the return itself.

<!-- TODO: wild argument `_` -->

<!-- same signature functions -->
For functions that share signatures, we can define them together separating their names with a 
    comma. For a function `minus` based on the `(-)` operator, we have the exact same signature
    as `plus`, so we can write:
```
plus, minus : Int -> Int -> Int
plus x y = x + y
minus x y = x - y
```

Functions in FreeST can have their signature and body separated, however we incentivize to **not** 
    write code like this:
```
plus : Int -> Int -> Int

minus : Int -> Int -> Int
minus x y = x - y

plus x y = x + y
```

<!-- for multiple returns, use tuples -->
At first glance, functions can't have more than one return type. However, functions might need to 
    return two or more values. How do we do this? We take advantage of **tuples** to encapsulate
    multiple return values inside a single one. To exemplify, Function `makeTwins` takes an integer 
    and returns it and its twin (a copy!) within a tuple.
```
makeTwins : Int -> (Int, Int)
makeTwins x = (x, x) 
```

<!-- `let` expressions -->
Not all functions can (or should) be described using a single expression. To prevent this from 
    becoming a limitation, we use `let` expressions which lets (pun intended) us store values in
    variables for later use. 
```
betterDivision : Int -> Int -> (Int, Int)
betterDivision n div =
    let quotient = n / div in
    let rest = mod n div in
    (quotient, rest)
```

Function `betterDivision` simply divides a number by another and returns both the quotient and the
    rest. We could write a single expression `(n / div, mod n div)`, but this way it is made clear
    what is what. It might not be the best case to show this concept but it gives you an idea.

<!-- pair pattern matching with `let` -->
Furthermore, it's through `let` expressions that we can 'open' pairs to access their elements 
    (instead of relying in `fst` and `snd`).
```
main : ()
main = 
    let (quotient, rest) = betterDivision 3 2 in
    ()
```

<!-- if statements -->
For conditional branching, `if` statements are provided. Note that both the `then` and `else` 
    branches must be present, so you can't write just the `then` branch.
```
-- Returns the absolute value of an integer
abs' : Int -> Int
abs' x = 
    if x > 0
    then x
    else -x
```

<!-- ($) operator -->
<!-- ; 'operator' -->
<!-- functions can be used as parameters -->
<!-- partial application of functions -->
<!-- main is the program's default entry point (but you can pass another one in the command line) -->

## Recursion, recursion, recursion, ...
We want to write a function `sumFirstN` that calculates the sum of the first `n` natural numbers.
    Functions such as `sumFirstN` which require some form of *iteration* are translated to using
    *loops*. FreeST does not have any type of loop syntax, so how can we write function 
    `sumFirstN`? The answer is **recursion**.

Trivially, the recursive definition of `sumFirstN` is: `sumFirstN 0 == 0` and 
    `sumFirstN n == n + sumFirstN (n-1)`. In FreeST it translates to:
```
sumFirstN : Int -> Int
sumFirstN n =
    if n <= 0
    then 0
    else n + sumFirstN (n-1)
```

If you need to propagate parameters forward while in recursion, you can do it by changing the 
    function's signature to have them. An example is a variation of the `sumFirstN` function 
    that accumulates the sum forward and returns it in the end (when `n` is 0):
```
sumFirstN' : Int -> Int -> Int
sumFirstN' n curr =
    if curr == n
    then curr 
    else curr + sumFirstN' n (curr+1)
```

However, every time we can, we prefer to write `sumFirstN` instead of `sumFirstN'` because of 
    simplicity and readability.

## User-defined types

You're a novice programmer into this fictitious new project and you cross upon this function:
```
f : (Int -> Int) -> Int -> (Int, Int)
f fun x = (x, fun x)
```

What is this? What are its parameters? What is the purpose of function `f`? Maybe it helps
    to know that a proper name for this function is `calcFunPoint`, but it perhaps is not 
    enough. The biggest problem continues to be the **confusing signature**.

Preventing confusing signatures can be done if we create higher-level types that stand in for those
    we use, but that bare a clearer meaning. A better signature for `calcFunY` looks like: 
```
calcFunY : Function -> Int -> Point
calcFunY fun x = (x, fun x)
```

Using these *abbreviations* (`Function` and `Point`) is done by creating two new types:
```
type Function = Int -> Int
type Point = (Int, Int)
```

User-defined types can be used in any place a normal type can, so you can write a type
    that uses another of your types:
```
type Circle = (Point, Radius)
```

Source code becomes more readable and provides more context to functions when we create and use 
    these types.

## User-defined data types
User-defined types do a lot to improve readability and code organization, but it sometimes is not 
    enough. Remember type `Circle`:
```
type Radius = Int
type Circle = (Point, Radius)
```

We want to add other shapes such as `Rectangle` and `Triangle`. With just types we write:
```
type Rectangle = (Point, Point)
type Triangle = (Point, Point, Point)
```

For now there are no issues. Next we want to write a function `calcArea` that takes a shape and 
    calculates its area accordingly. What is the signature of such a function? It either receives 
    a `Circle`, a `Rectangle` or a `Triangle`, so it in fact has to be split among three different 
    functions. Good programming practices teach us that it is best to use a super type from which
    all shapes derive from. We create a new *data type* `Shape` where all different shapes are 
    represented by different constructors each with their set of parameters.
```
data Shape = Circle Point Radius
           | Rectangle Point Point
           | Triangle Point Point Point
```

A `calcArea` function then takes advantage of the `Shape` data type and a `case` expression to 
    calculate each case separately.
```
calcArea : Shape -> Int
calcArea shape =
    case shape of {
        Circle p r -> ...
        Rectangle p1 p2 -> ...
        Triangle p1 p2 p3 -> ...
    }
```

Data structures can also be recursive (in the same way as types). A binary tree of integers is 
    defined as:
```
data IntBinaryTree = Leaf | Node Int IntBinaryTree IntBinaryTree
```

<!-- TODO -->
<!-- how to document code using `-- |` and `-- #` -->

# Handling linearity
Most programming languages treat all values the same way, but FreeST is very different from them.
    FreeST has a `linear system` which differentiates **linear** from **unrestricted** values and 
    types. An unrestricted value is one that may be used **0 or more times** during the program's 
    execution(it's what most programming languages have). A linear value or type is one that must 
    be used **exactly once** during the program's execution. If linear constraints are violated,
    the program will **not type check**, and therefore, will **not run**.

All constants are by default unrestricted values, so the following code is valid:
```
f : Int -> Int
f x = x + 1

main : ()
main = 
    let i = 5 in
    f i; -- i is used once
    f i; -- i is used twice
    let j = 2 in
    -- j is never used
    ()
```

Functions are the first construct new programmers face that can also be linear. A 
    **linear function** is simply a function that has to be used exactly once (following the
    linear constraint). Let us write a linear function `linIncrement` that increments an integer 
    by 1:
```
linIncrement : Int 1-> Int
linIncrement x = x + 1
```

If this function is part of your code, then you are obliged by linearity to use it. The following
    would not run:
```
linIncrement : Int 1-> Int
linIncrement x = x + 1

main : Int
main = 1
```

<!-- TODO: insert what error is thrown by freest in the above example -->

Fixing the above code is simple, just make sure you use `linIncrement` exactly once, for example:
``` 
linIncrement : Int 1-> Int
linIncrement x = x + 1

main : Int
main = linIncrement 1
```

<!-- TODO: unrestricted can replace linear -->

## Treading carefully with linear functions
Linear functions seem simple, however there is more to this than meets the eye. The type
    `Int 1-> Int` describes a linear function that takes an integer and returns an integer,
    but what about type `Int 1-> Int -> Int`? This type also describes a linear function, but with
    a twist: only the first part is linear (instead of the whole as before). If you partially apply
    a function of this type with a single integer, it will become an unrestricted function.
```
f : Int 1-> Int -> Int
f x y = x + y

main : ()
main = 
    let f' = f 1 in
    f' 3;
    f' 1;
    f' 2;
    ()
```

In the above case, after partially applying `f` we get an unrestricted function `f'` which we then 
    use multiple times. A truly linear version of function `f` would need to have type 
    `Int 1-> Int 1-> Int`.

Another case that can happen is something similar to `Int -> Int 1-> Int`. This is more tricky than 
    what we've seen until now. Let's analyze it step by step, look at it as `Int -> (Int 1-> Int)`.
    Now it's clearer that it represents an **unrestricted** function that takes an integer and 
    returns another **linear** function that takes an integer and returns an integer.
```
g : Int -> Int 1-> Int
g x y = x + y

main : ()
main =
    let g1 = g 1 in
    let g2 = g 2 in
    g1 3;
    g2 4;
    ()
```

This time, function `g` is used multiple times to create linear functions `g1` and `g2`, that then
    are used exactly once.

Functions `f` and `g` are the fundamental to understand how functions deal with linearity and how 
    us programmers should both write and use them. From here on out, there are many possible cases
    that combine both cases of `f` and `g`, but by breaking it down type by type as we did for `g`,
    we can quickly understand any combination of linear and unrestricted functions.

<!-- TODO -->
<!-- maybe talk about a generator function `() -> (T 1-> U)` that might be useful in some cases -->

<!-- ## Polymorphic functions -->
<!-- Sometimes there is the need to  -->

# Parallel programming

<!-- TODO -->
<!-- intro to parallel programming in FreeST -->
<!-- parallel programming is an important subject in FreeST -->

## It's not a spoon, it's a `fork`
As a language dedicated to communication and concurrency, FreeST provides the `fork` function to 
    execute functions in parallel, i.e. in another thread.
```freest
fork : forall a:*T . (() 1-> a) -> ()
```

A program always has one thread, the **main** thread. Program execution always ends when the main 
    thread end, no matter how many running threads are there.


<!-- TODO -->
<!-- # Channels, Protocols and Session types -->
<!-- channels -->
<!-- channels as a way of connecting threads (and sharing data) -->
<!-- structured communication in channels through protocols -->
<!-- linear channels -->
<!-- polymorphic recursion -->
<!-- avoiding deadlocks (initiative) -->
<!-- limitations with linear channels -->
<!-- shared channels -->

<!-- TODO: -->
<!-- ## Useful constructs with shared channels -->
<!-- synchronization process -->
<!-- shared data structures -->

<!-- TODO: -->
<!-- # Input and output -->
<!-- IO in FreeST is based on channels (shared + linear) -->
<!-- The combination of shared and linear channels served by a single channel allow for resource capture -->
<!-- ## Standard IO -->
<!-- ## File IO -->
<!-- how to acquire  -->

<!-- TODO: -->
<!-- # Pattern matching -->
<!-- syntax and utility -->

<!-- TODO: -->
<!-- # Modules -->
<!-- syntax -->
<!-- good to compartmentalize code -->
<!-- restrictions for now -->

<!-- TODO: -->
<!-- # Errors -->
<!-- a guide on why each error is thrown and how to fix/workaround it -->