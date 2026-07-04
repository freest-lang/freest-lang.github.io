---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Linearity
layout: default
nav_order: 3
parent: Get started
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
Most programming languages can use and reuse values at will. FreeST treats values differently according to their **multiplicity**. The multiplicity of a value (and hence of its type) governs the number of times the value must be used in any run of the program. Currently FreeST distinguishes two multiplicities: **linear** and **unrestricted**, written `1` and `*`. The former describes a value that must be exactly once, latter a value that may be used any number of times, zero included.

Unrestricted values are the values one finds in most programming languages. Linear Haskell features linear values, albeit of a slightly different nature. Rust features values that may used zero or once.

Let us start with the conventional unrestricted values. All constants are unrestricted, hence the following program compiles and prints `10`. Notice that value `n` id used twice
```
copy : ()
copy = 
    let n = 5 in print (n + n)
```

Unrestricted values may not be used at all. The program below still prints `n` but never uses the value in variable `n`.
```
discard : ()
discard = 
    let n = 5 in print 10
```

Functions may also be unrestricted. They can be copied:
```
double : Int -> Int
double x = x + x

copy : ()
copy = 
    print (double 5 + double 5)
```
or discarded
```
double : Int -> Int
double x = x + x

discard : ()
discard = 
    print 20
```
In either case, expect to read `20` on the console.

The type constructor for an unrestricted function is usually written as `->`. But that is an abbreviation for `-*->`, where the explicit `*` points to an unrestricted value. Function `double` could have been written ad follows.
```
double : Int -*-> Int
double x = x + x
```

Linear values are of a different nature: they must be used exactly once in any run of the program. This means they cannot be copied or discarded. Using an linear value invalidated any further use of the same value. Functions are probably the first linear values construct programmers are faced with. If we use `-*->` for an unrestricted function, we use `-1->` for a linear function. The program below attempts to use function `double` twice.
```
linDouble : Int -1-> Int
linDouble x = x + x

copy : ()
copy = 
    print (linDouble 5 + linDouble 5)
```
The compiler complains at the attempt to use the function for the second time:
```
CopyLinearFun.fst:6:23–8:29: error:
Variable out of scope: `double`
  | 
6 |     print (double 5 + double 5)
  |                       ^^^^^^
```

Similarly, not using a function declared as linear is a capital offense:
```
linDouble : Int -1-> Int
linDouble x = x + x

copy : ()
copy = 
    print 20
```
greeted by the compiler with an error stating that the value is not used:
```
DiscardLinearFun.fst:1:1–3:7: error:
Linear variable `double` is not consumed
  | 
1 | linDouble : Int -1-> Int
  | ^^^^^^
```

<!-- TODO: unrestricted can replace linear -->

## Treading carefully with linear functions

Linear functions seem simple, however there is more to it than meets the eye. The type `Int -1-> Int` describes a linear function that takes an integer and returns an integer, but what about type `Int -1-> Int -*-> Int`? This type also describes a linear function, but with a twist: the function is linear on its first argument only. If one partially applies the function, then they are left with an unrestricted function. This is easy to see if one recalls that `Int -1-> Int -*-> Int` stands for `Int -1-> (Int -*-> Int)`.
```
f : Int -1-> Int -*-> Int
f x y = x + y

partialApplication : ()
partialApplication = 
    let f' = f 1 in print (f' 3 + g 1 + f' 2)
```

In the above example, after partially applying `f` we are left with an unrestricted function `g` (of type `Int -*-> Int`) which we then use multiple times.

Let us now analyse a, similar in form but of quite different behaviour, type `Int -*-> Int -1-> Int`. This is more tricky than what we've seen until now. Let's analyze it step by step, look at it as `Int -*-> (Int -1-> Int)`. Now it's clearer that it represents an **unrestricted** function that takes an integer and returns another **linear** function that takes an integer and returns an integer.
```
g : Int -*-> Int -1-> Int
g x y = x + y

partialUnApplication : ()
partialUnApplication = 
    let g1 = g 1
        g2 = g 2 in
    print (g1 3 + g2 4)
```
This time, function `f` is used multiple times to create linear functions `g1` and `g2`, each of which is then used exactly once. Expect to read integer `10` on the console.

Functions `f` and `g` are fundamental to understand how functions deal with linearity and how us programmers should both write and use them. From here on out, there are many possible cases that combine both cases of `f` and `g`, but by breaking it down type by type as we did above, we can quickly understand any combination of linear and unrestricted functions.

<!-- TODO -->
<!-- maybe talk about a generator function `() -> (T 1-> U)` that might be useful in some cases -->
