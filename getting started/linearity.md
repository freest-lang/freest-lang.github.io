---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Handling linearity
layout: default
nav_order: 3
parent: Getting started
---

# Linearity
{: .no_toc }

<!-- TODO -->
<!-- some intro text here -->

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .no_toc .text-delta }
- TOC
{:toc}
</details>



## Handling linearity
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
    f i ; -- both g and i are used once
    f i ; -- both f and i are used twice
    let j = 2 in
    -- j is never used
    ()
```

Functions are the first construct programmers face that can also be linear. A 
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
Linear functions seem simple, however there is more to it than meets the eye. The type
    `Int 1-> Int` describes a linear function that takes an integer and returns an integer,
    but what about type `Int 1-> Int -> Int`? This type also describes a linear function, but with
    a twist: only the first part is linear (instead of the whole as before). If you partially apply
    a function of this type with a single integer, it will become an unrestricted function.
```
f : Int 1-> Int -> Int
f x y = x + y

main : Int
main = 
    let f' = f 1 in
    f' 3 + f' 1 + f' 2
```

In the above case, after partially applying `f` we get an unrestricted function `f'` which we then 
    use multiple times. A truly linear version of function `f` would need to have type 
    `Int 1-> Int 1-> Int`.

Let us now analyse a similar in form, but quite different in behaviour, type `Int -> Int 1-> Int`. This is more tricky than 
    what we've seen until now. Let's analyze it step by step, look at it as `Int -> (Int 1-> Int)`.
    Now it's clearer that it represents an **unrestricted** function that takes an integer and 
    returns another **linear** function that takes an integer and returns an integer.
```
g : Int -> Int 1-> Int
g x y = x + y

main : Int
main =
    let g1 = g 1 in
    let g2 = g 2 in
    g1 3 + g2 4
```

This time, function `g` is used multiple times to create linear functions `g1` and `g2`, each of which is then used exactly once.

Functions `f` and `g` are fundamental to understand how functions deal with linearity and how 
    us programmers should both write and use them. From here on out, there are many possible cases
    that combine both cases of `f` and `g`, but by breaking it down type by type as we did for `g`,
    we can quickly understand any combination of linear and unrestricted functions.

<!-- TODO -->
<!-- maybe talk about a generator function `() -> (T 1-> U)` that might be useful in some cases -->