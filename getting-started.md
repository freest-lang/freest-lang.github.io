---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Getting started
layout: default
nav_order: 5
---

<!-- # FreeST Tutorial -->

<!-- small introduction -->
<!-- similar languages to freest -->
<!-- - Haskell -->
<!-- why is freest different -->
<!-- - linearity -->
<!-- - session types -->
<!-- - why is it better in its domain -->
<!-- - builtin features are simpler to use -->
<!-- - context-free session types -->

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
    of functions). To sum numbers is to apply function `(+)` to two numbers. Function `(+)` is also 
    called an operator, we can write `1 + 2` or `(+) 1 2`. 
    
All functions must have a **signature** (a type), that says what are its parameters and return 
    values. A function's signature has the shape `Parameter 1 -> ... -> Parameter n -> Return`. For 
    example, the type of `(+)` is `Int -> Int -> Int`, a function that takes two integers and 
    returns another.
    
<!-- how to define a function -->
To define functions, simply state the function's name and signature and then its body. Let's create
    our own `plus` function based on the `(+)` operator:
```freest
plus : Int -> Int -> Int
plus x y = x + y
```

The function's body consists of the name of the function, the variables described in the signature
    followed by the logic itself. Note that there is no **return** statement, this is because the 
    entire expression is the return itself.

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
A function's signature will always have its return type in the end, but what if we wanted more than
    a single return value? For this purpose we can use tuples as a way of returning as many values
    as we want. Function `makeTwins` takes an integer and returns it and its twin (a copy!) within
    a tuple.
```freest
makeTwins : Int -> (Int, Int)
makeTwins x = (x, x) 
```

<!-- functions can be used as parameters -->
<!-- partial application of functions -->

## Recursion, recursion, recursion, ...
In FreeST there is no notion of loops, they are instead replaced with recursion.
    Recursive thinking is essential in functional programming.

Let us create a method `sumFirstN` that calculates the sum of the first `n` integers
    in the Java language using a `while` loop:
```java
public int sumFirstN(int n) {
    int i = 1;
    int sum = 0;

    while (i <= n) {
        sum += i;
        i++;
    }

    return sum;
}
```

Which is simplified if we use a `for` loop instead:
```java
public int sumFirstN(int n) {
    int sum = 0;

    for (int i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
}
```

In Java we can write the `sumFirstN` method in recursively as:
```java
public int sumFirstN(int n) {
    if (n <= 0) {
        return 0;
    } else {
        return n + sumFirstN(n-1);
    }
}
```

And in FreeST it comes similarly as:
```freest
sumFirstN : Int -> Int
sumFirstN n =
    if n <= 0
    then 0
    else n + sumFirstN (n-1)
```

If you need to pass parameters or a context while in recursion, you can also do it by 
    changing the function's signature. The same `sumFirstN` function can be written in this
    manner as:
```
sumFirstN' : Int -> Int -> Int
sumFirstN' n curr =
    if curr == n
    then curr 
    else curr + sumFirstN' n (curr+1)
```

Function `sumFirstN` is much better than `sumFirstN'`, however, there are some cases such as those 
    that require some kind of state to be passed forward in recursion. 

<!-- TODO: wild argument `_` -->

## User-defined types

You're a novice programmer into this new project and you cross upon this function:
```freest
f : (Int -> Int) -> Int -> (Int, Int)
f fun x = (x, fun x)
```

What is this? What are its parameters? What is the purpose of function `f`? Maybe it helps
    to know that a proper name for this function is `calcFunPoint`, but it perhaps seems not 
    enough. The biggest problem continues to be the confusing signature.

Preventing such cases can be done if we create a higher-level type that stands in for those
    we use but that bare a better meaning. 
```freest
calcFunY : Function -> Int -> Point
calcFunY fun x = (x, fun x)
```

Using such abbreviations (`Function` and `Point`) can be done by creating two new types:
```freest
type Function = Int -> Int
type Point = (Int, Int)
```

User-defined types can be used in any place a normal type can, so you can write a type
    that uses another of your types:
```freest
type Radius = Int
type Circle = (Point, Radius)
```

Source code becomes more readable and provides more context to function when we create such types.

## User-defined data types
User-defined types do a lot to improve readability and code organization, but it sometimes is not 
    enough. Remember type `Circle`:
```freest
type Radius = Int
type Circle = (Point, Radius)
```

We want to add other shapes such as a `Rectangle` and a `Triangle`. With just types we write:
```freest
type Rectangle = (Point, Point)
type Triangle = (Point, Point, Point)
```

For now there are no issues. Let us write a function `calcArea` that takes a shape and calculates 
    its area accordingly. What is the signature of such a function? It either receives a `Circle`,
    or a `Rectangle` or a `Triangle`, so it in fact has to be split among three different 
    functions. Good programming practices teach us that it is best to use a super type from which
    all shapes derive from. We create a new *data type* `Shape` where all different shapes 
    represent different constructors each with their set of parameters.
```freest
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

Data structures can also be recursive (in the same way as types). To define a binary tree of 
    integers:
```freest
data IntBinaryTree = Leaf | Node Int IntBinaryTree IntBinaryTree
```


# Handling linearity
FreeST has a `linear system` which differentiates linear from unrestricted values and types.
    This means that we differentiate based on how many times a value or type is used. Linear
    means exactly one, while unrestricted means 0 or more.

All constants are by default unrestricted values, so the following code is valid:
```freest
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

We do not violate linearity because we only use unrestricted values. What if we use a function
    `toLinear` to transform integers into their linear counterparts instead?
```freest
toLinear : () -> Int 1-> Int
toLinear _ x = x

main : ()
main = 
    let i = toLinear () 5 in
    f i; -- i is used once
    f i; -- ERROR: i is not in the context
    let j = toLinear () 2 in
    -- ERROR: j is never used
    ()
```

Where before with unrestricted values we had no issues, we now face two errors, one because we 
    tried to use a linear value more than once, and the other because we left a linear value unused.

A characteristic of this system is that any unrestricted value may be used in the place of a linear 
    one while linear ones cannot replace unrestricted.

Working with such a system is as simple as keeping track of what is linear and what is not, and
    even when we make mistakes the compiler will make sure to notify us. The fixed version of the
    previous snippet of code is:
```freest
toLinear : () -> Int 1-> Int
toLinear _ x = x

main : ()
main = 
    let i = toLinear () 5 in
    f i; -- i is used exactly once
    let j = toLinear () 2 in
    j + 1; -- j is used exactly once
    ()
```

<!-- ## Polymorphic functions -->
<!-- Sometimes there is the need to  -->


## Treading carefully with linear functions
Previously we used a special function `toLinear` to create linear integers. This is a special type
    of function as denoted by the `1->` syntax instead of the usual `->`. A function with signature
    `T 1-> U` is a linear one, and must be used exactly once.

But if this is the case, then why does `toLinear` have type `() -> Int 1-> Int`? Let's imagine that
    it instead had the type `Int 1-> Int`. The function `toLinear` as a whole could only be used 
    once in the entire execution. To better understand the use for `()`, think of `toLinear` as an
    unrestricted function (that can be used 0 or many times) that generates a *new* linear function 
    (that has to be used exactly once) that returns the same integer given.

Imagine we had a function `exec : (() 1-> ()) -> ()`, a function that takes a linear function and
    applies it, returning the unit value. Are we limited to passing only linear functions? Think 
    about it, a linear function is one that must be used exactly once, and unrestricted can be used
    0 or more times, so in fact, an unrestricted function can replace a linear one (1 is in the 
    range of 0 or more). However, the opposite isn't true because a linear function can't either
    be used 0 times or more than exactly once.

## It's not a spoon, it's a `fork`
As a language dedicated to communication and concurrency, FreeST provides the `fork` function to 
    execute functions in parallel (it's very similar to previously presented `exec` function).
```freest
fork : forall a:*T . (() 1-> a) -> ()
```

A program always has one thread, the **main** thread. Program execution always ends when the main 
    thread end, no matter how many running threads are there.





<!-- TODO: -->
<!-- # Channels, Protocols and Session types -->
<!-- channels -->
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