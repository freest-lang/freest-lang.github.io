---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Functional FreeST
layout: default
nav_order: 2
parent: Getting started
---

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

<!-- ## Polymorphic functions -->
<!-- Sometimes there is the need to  -->