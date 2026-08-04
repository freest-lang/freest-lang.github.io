---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Functional FreeST
layout: default
nav_order: 2
parent: Tutorial
---

# Functional FreeST
{: .no_toc }

<!-- freest is a functional language -->
<!-- everything is a function -->


<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .no_toc .text-delta }
- TOC
{:toc}
</details>


## Primitive types and tuples

FreeST has the following primitive types:
- `()`{: .language-freest }, the unit type, with a single value `()`{: .language-freest }
- `Bool`{: .language-freest }, can be `True`{: .language-freest } or `False`{: .language-freest }
- `Int`{: .language-freest }, for integer numbers
- `Float`{: .language-freest }, for floating-point numbers
- `Char`{: .language-freest }, for single characters
- `String`{: .language-freest }, for sequences of characters

From primitive types, other types can be built. **Tuple** is the first type
    constructor we study. A tuple can have two elements `(Int, String)`{: .language-freest } or as
    many as you want `(Bool, Int, (Int, Char), String)`{: .language-freest }.


## Functions, functions everywhere

In FreeST, much like in every other functional language, everything is a function (or a composition 
    of functions). To sum numbers is to apply function `(+)`{: .language-freest } to two numbers. To sum 1 and 2 is to 
    write `(+) 1 2`{: .language-freest }. However, because function `(+)`{: .language-freest } is considered an **operator**, we can also 
    write `1 + 2`{: .language-freest }. 

<!-- function signatures -->
All functions must have a **signature** (a type), that describes both its parameters and 
    return value. A function's signature has the syntax 
    `<Parameter#1> -> ... -> <Parameter#n> -> <Return>`. For example, the type of `(+)`{: .language-freest } is 
    `Int -> Int -> Int`{: .language-freest }, a function that takes two integers and returns an integer.
    
<!-- how to define a function -->
To define functions, simply state the function's name and signature and then its body. Let's create
    our own `plus`{: .language-freest } function based on the `(+)`{: .language-freest } operator:
```freest
plus : Int -> Int -> Int    -- signature
plus x y = x + y            -- body
```

<!-- function body -->
The function's body consists of the name of the function, the variables described in the signature,
    followed by the logic itself.

<!-- TODO: wild argument `_`{: .language-freest } -->

<!-- same signature functions -->
For functions that share signatures, we can define them together separating their names with a 
    comma. For a function `minus`{: .language-freest } based on the `(-)`{: .language-freest } operator, we have the exact same signature
    as `plus`{: .language-freest }, so we can write:
```freest
plus, minus : Int -> Int -> Int
plus x y = x + y
minus x y = x - y
```

Functions in FreeST can have their signature and body separated; however, we encourage you **not** to
    write code like this:
```freest
plus : Int -> Int -> Int

minus : Int -> Int -> Int
minus x y = x - y

plus x y = x + y
```

<!-- for multiple returns, use tuples -->
At first glance, functions can't have more than one return type. However, functions might need to 
    return two or more values. How do we do this? We take advantage of **tuples** to encapsulate
    multiple return values inside a single one. To exemplify, function `makeTwins`{: .language-freest } takes an integer 
    and returns it and its twin (a copy!) within a tuple.
```freest
makeTwins : Int -> (Int, Int)
makeTwins x = (x, x)
```

<!-- `let`{: .language-freest } expressions -->
Not all functions can (or should) be described using a single expression. To prevent this from 
    becoming a limitation, we use the `let`{: .language-freest } expression, which lets (pun intended) us store values in
    variables for later use. 
```freest
improvedDivision : Int -> Int -> (Int, Int)
improvedDivision n div =
  let quotient = n / div
      remainder = mod n div
  in (quotient, remainder)
```

Function `improvedDivision`{: .language-freest } simply divides a number by another and returns both the quotient and the
    remainder. We could write a single expression `(n / div, mod n div)`{: .language-freest }, but naming each part with
    a `let`{: .language-freest } makes it clear what is what.

Furthermore, it's through `let`{: .language-freest } expressions that we can 'open' pairs to access their elements 
    (instead of relying on `fst`{: .language-freest } and `snd`{: .language-freest }).
```freest
let (quotient, remainder) = improvedDivision 3 2 in quotient * remainder
```

<!-- if statements -->
For conditional branching, `if`{: .language-freest } expressions are provided. Note that both the `then`{: .language-freest } and `else`{: .language-freest } branches must be present, so you can't write just the `then`{: .language-freest } branch. Here's a function that returns the absolute value of an integer.

```freest
abs' : Int -> Int
abs' x = 
  if x >= 0
  then x
  else -x
```

<!-- ($) operator -->
<!-- ; 'operator' -->
<!-- functions can be used as parameters -->
<!-- partial application of functions -->
<!-- main is the program's default entry point (but you can pass another one in the command line) -->

## Running scripts in FreeST

A FreeST script is a list of declarations, as for example, `improvedDivision`{: .language-freest } and `abs'`{: .language-freest }. To run code one has to place a (non-evaluated) expression inside a declaration. For example:
```freest
main = print $
  let divisor = 2
      (quotient, remainder) = improvedDivision 3 divisor
  in quotient * divisor + remainder
```
But `main`{: .language-freest } is just another name. And since we are not using it, we may as well use a wildcard:
```freest
_ = print $
  let divisor = 2
      (quotient, remainder) = improvedDivision 3 divisor
  in quotient * divisor + remainder
```

The list of declarations in a script is evaluated in order, so that
```freest
_ = print 1
_ = print 2
```
would print `1`{: .language-freest } followed by `2`{: .language-freest } on the console.

<!-- Channels are *buffered*. The output operations (`send`{: .language-freest }, `sendType`{: .language-freest }, `select`{: .language-freest } and `close`{: .language-freest }) are nonblocking. The input operations (`receive`{: .language-freest }, `receiveType`{: .language-freest }, `case`{: .language-freest } and `Wait`{: .language-freest }) may block is the buffer isf empty. -->


## User-defined types

You're a novice programmer working on this fictitious new project and you come across this function:
```freest
f : (Int -> Int) -> Int -> (Int, Int)
f g x = (x, g x)
```

What is this? What are its parameters? What is the purpose of function `f`{: .language-freest }? Giving it a descriptive name such as `calcFunY`{: .language-freest } helps, but it is not enough: a major problem continues to be the confusing signature.

Confusing signatures can be avoided by defining names for types. We start by creating a couple of type *abbreviations*:
```freest
type Function = Int -> Int
type Point = (Int, Int)
```

Equipped with these new names, a better signature for `calcFunY`{: .language-freest } looks like: 
```freest
calcFunY : Function -> Int -> Point
calcFunY fun x = (x, fun x)
```

User-defined types can be used in any place a normal type can, so you can write a type
    that uses another of your types:
```freest
type Radius = Float
type Point = (Float, Float)
type Circle = (Point, Radius)
```

Source code becomes more readable and provides more context to functions when we create and use these names.

User-defined types do a lot to improve readability and code organization, but sometimes it is not enough. Remember type `Circle`{: .language-freest } above. We want to add other shapes such as `Rectangle`{: .language-freest } and `Triangle`{: .language-freest }. With just types we write:
```freest
type Rectangle = (Point, Point)
type Triangle = (Point, Point, Point)
```

For now there are no issues. Next we want to write a function `area`{: .language-freest } that takes a shape and calculates its area accordingly. What is the signature of such a function? It either receives a `Circle`{: .language-freest }, a `Rectangle`{: .language-freest } or a `Triangle`{: .language-freest }, so it in fact has to be split into three different functions. But there is a better way. We create a new **datatype** `Shape`{: .language-freest } where all different shapes are represented by different constructors, each with its own set of parameters.
```freest
data Shape = Circle Point Radius
           | Rectangle Point Point
           | Triangle Point Point Point
```

The `area`{: .language-freest } function then takes advantage of the `Shape`{: .language-freest } datatype to calculate each case separately.
```freest
area : Shape -> Float
area (Circle _ r) =
  pi *. r *. r
area (Rectangle (x1, y1) (x2, y2)) =
  absF (x2 -. x1) *. absF (y2 -. y1)
area (Triangle (x1, y1) (x2, y2) (x3, y3)) =
  absF (x1 *. (y2 -. y3) +. x2 *. (y3 -. y1) +. x3 *. (y1 -. y2)) /. 2.0
```
Notice the floating-point operations `*.`{: .language-freest }, `+.`{: .language-freest } and `absF`{: .language-freest }.

Pattern-matching is our preferred style of programming. Alternatively, one can use a `case`{: .language-freest } expression to deconstruct a datatype:
```freest
area' : Shape -> Float
area' shape =
  case shape of
    Circle p r -> pi *. r *. r
    Rectangle (x1, y1) (x2, y2) -> absF (x2 -. x1) *. absF (y2 -. y1)
    Triangle (x1, y1) (x2, y2) (x3, y3) -> absF (x1 *. (y2 -. y3) +. x2 *. (y3 -. y1) +. x3 *. (y1 -. y2)) /. 2.0
```

Write
```freest
_ = print (area aTriangle -. area' aTriangle <. 0.0001)
```
and expect `True`{: .language-freest } on the console.


## Datatype and type declarations

Keyword `data`{: .language-freest } introduces a new type, different from all others; `type`{: .language-freest } may introduce a type abbreviation as well as a new type (if the name of the type appears on the right; we discuss this in the next section). `data`{: .language-freest } is nominal; `type`{: .language-freest } is structural. This means that types `T`{: .language-freest } and `U`{: .language-freest } can never be equivalent, regardless of what the ellipsis stands for:
```freest
data T = ...
data U = ...
```

On the other hand, `V`{: .language-freest } and `W`{: .language-freest } are equivalent types. They are both equivalent to `Int`{: .language-freest } and all three may be interchangeably used in code.
```freest
type V = Int
type W = Int
```

Datatype constructors cannot be reused. The declarations below are *not* valid.
```freest
data T = D
data U = D
```

## Recursion, recursion, recursion, ...

We want to write a function `sumUpTo`{: .language-freest } that calculates the sum of the first `n`{: .language-freest } natural numbers. Functions such as `sumUpTo`{: .language-freest } require some form of *iteration*. How can we write it? The answer is **recursion**.

Trivially, the recursive definition of `sumUpTo`{: .language-freest } is: `sumUpTo 0 == 0`{: .language-freest } and `sumUpTo n == n + sumUpTo (n-1)`{: .language-freest }. In FreeST it translates to:
```freest
sumUpTo : Int -> Int
sumUpTo n | n <= 0 = 0
          | otherwise = n + sumUpTo (n - 1)

```

Data structures can also be recursive. A binary tree of integers is defined as:
```freest
data IntBinaryTree = Leaf | Node IntBinaryTree Int IntBinaryTree
```

Recursive data structures are naturally consumed by recursive functions. Here is a function that consumes a tree while producing the sum of the values in the tree.
```freest
treeSum : IntBinaryTree -> Int
treeSum Leaf         = 0
treeSum (Node l x r) = treeSum l + x + treeSum r
```

To run, try this code. Expect to read `6`{: .language-freest } on the console
```freest
aTree : IntBinaryTree
aTree = Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf)
_ = print (treeSum aTree)
```

Types can also be recursive. We shall see them in good use together with session types. For now let us think of a function that takes an infinite number of parameters.
```freest
type IntSink = Int -> IntSink
```

This type can never be consumed in its entirety, in finite time. The best we can do is to consume it partially. Function `partialConsume`{: .language-freest } does exactly this: feeds five Ints and returns the resulting function, again of type `IntSink`{: .language-freest }.
```freest
partialConsume : IntSink -> IntSink
partialConsume f = f 1 2 3 4 5
```

<!-- If you need to propagate parameters forward while in recursion, you can do it by changing the function's signature to have them. An example is a variation of the `sumUpTo`{: .language-freest } function that accumulates the sum forward and returns it in the end (when `n`{: .language-freest } is 0):
```freest
sumUpTo' : Int -> Int -> Int
sumUpTo' n curr =
  if curr == n
  then curr 
  else curr + sumUpTo' n (curr + 1)
``` -->


## Mutual recursion

Mutually recursive functions must be introduced with the keyword `mutual`{: .language-freest }. The `even`{: .language-freest } and `odd`{: .language-freest } functions on *natural numbers* can be defined as follows.
```freest
mutual
  even : Int -> Bool
  even 0 = True
  even n = odd (n - 1)
  odd : Int -> Bool
  odd n = not (even n)
```


<!-- TODO -->
<!-- how to document code using `-- |` and `-- #` -->

<!-- ## Polymorphic functions -->
<!-- Sometimes there is the need to  -->
