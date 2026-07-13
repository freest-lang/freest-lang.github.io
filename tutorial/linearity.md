---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Linearity
layout: default
nav_order: 3
parent: Tutorial
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


## Functions with multiple parameters

Consider a function `f` with one parameter that does not refer to linear values in its body. Further suppose that the parameter is of type `L`, a linear type. Then, in each call site, a different linear argument must be provided. But the function itself can be used as often as needed: it may be of type `L -*-> T`, with `T` the type of the result. If the programmer knows that the function is meant to be used once only, then they may assign `f`  type `L -1-> T` instead.

Now consider the case of a function `g` that accepts more arguments, say three, the two extra arguments being of types `U1` and `U2` (unrestricted). What are the possible signatures for `g`? Is `L -*-> U1 -> U2 -> T` a possible type for `g`? What about `L -> U1 -> U2 -1-> T`? Let us make the case concrete. Consider the function:
```freest
linBinApply f x y = f x y
```
The reasoning for the first parameter is the one we have followed for function `f`, above. So `linBinApply` is of type `L -> U1 ...` (or `L -1-> U1 ...`), with `L` the type `Int -1-> Int -1-> Int`. If `h` is a value of type `L`, then `linBinApply h` captures in its body a linear value and hence cannot be duplicated or discarded. This means that function `linBinApply h` must be linear. Then, one possible type for the function is:
```freest
linBinApply : (Int -1-> Int -1-> Int) -*-> Int -1-> Int -1-> Int
```

Suppose that we insist that `linBinApply h` is of an unrestricted type:
 ```freest
 linBinApply : (Int -1-> Int -1-> Int) -*-> Int -*-> Int -1-> Int
```
Then the compiler complaints as follows.
```bash
MultipleArgs.fst:4:13–4:14: error:
Linear variable `f` of type `Int -1-> Int -1-> Int`, bound at
  Valid/Tutorial/MultipleArgs/MultipleArgs.fst:4:13–4:14
  | 
4 | linBinApply f x y = f x y
  |             ^
 is consumed in body of an unrestricted function
  Valid/Tutorial/MultipleArgs/MultipleArgs.fst:4:15–4:26
  | 
4 | linBinApply f x y = f x y
  |               ^^^^^^^^^^^
(This would allow duplicating or discarding the value. Consider using a linear function instead.)
```
The highlighted region `x y = f x y` is the partial application `linBinApply h`, that is, the function `\x y -> f x y`. Its type, `Int -*-> Int -1-> Int`, is unrestricted (the second `-*->`), yet its body captures the linear value `h`. Making this function unrestricted would allow duplicating or discarding `h`, hence the error.

However, note that the linearity of functions, and their partial applications, derives not from types, but rather is dictated by how linear resources are captured and used inside the function.

Consider function ``foo1``, which is quite similar to the example above:
```freest
foo1 : (Int -1-> Int) -> Int -1-> Int
foo1 f x = (f 1) + x
```
As we've seen, the partial application of ``foo1`` must be considered linear, since it captures a linear variable.
We can however make some changes to the function's definition, so that the type of the partial application is unrestricted instead:
```freest
foo2 : (Int -1-> Int) -> Int -> Int
foo2 f = let y = f 1 in (\x -> y + x)
```
By allowing the partial application to evaluate and consume the linear resource, it no longer captures the linear resource, and thus, the partial application can then be discarded or duplicated.
```freest
_ = 
    let x = foo2 idL in (x, x)
    where
        idL : Int -1-> Int
        idL x = x
```


## Linear functions, as opposed to functions with linear parameters

Defining functions as either unrestricted or linear is then mostly a matter of conforming to safety constraints.
Unrestricted functions can be discarded or used more than once because they do not capture linear resources, such as the function `id`.

```freest
id : Int -*-> Int
id x = x
```

On the other hand, if a function does capture a linear resource, it must be defined as linear.
By not being permitted to be discarded or duplicated, one is ensured that the linear resource it captures is also not discarded or duplicated.

```freest
linFunc : Int -1-> Int
linFunc x = let _ = extract linVar in x
```

If we take `lvar` to be a linear resource and `extract` a function that somehow consumes this linear resource, then `linFunc` must be defined as linear, since otherwise, `lvar` could be discarded or duplicated.
We refer to this flavour of linearity, which is present in FreeST, as Walker's style (cf. Advanced Topics in Types and Programming Languages, chapter 1, David Walker).

However, we find it important for the reader to appreciate the difference between defining functions as either unrestricted or linear, à là Walker as we've just discussed, from defining functions that take unrestricted or linear parameters, as inspired by linear logic and present instead in systems such as Linear Haskell.

In systems inspired by linear logic, the constraint is not on the function value itself but on how its bound variable may be used within the body.
This is expressed in the literature by a different kind of arrow, which we call the linear arrow, which states the argument is used exactly once in the body of the function.
The linear arrow is commonly written in the literature using the *lollipop* symbol i.e., `T1 ⊸ T2`, but also with explicit annotations i.e., `T1 %1 -> T2`, where `%1` indicates the linearity of the arrow, in the case of Linear Haskell.

```haskell
dup :: Int %1 -> (Int, Int)
dup x = (x, x)
```

Obviously, the `dup` function is rejected, because the use of the bound variable `x` breaks the constraint imposed by the linear arrow i.e., it is used twice, instead of exactly once.
Note that the multiplicity i.e., being unrestricted or linear, of the argument is of no consequence here: we may define a function that takes an unrestricted argument and uses it only once.
In order to "fix" this function, and thus make it well-typed, the linear arrow `%1 ->` should be swapped with a "normal" arrow `->`.

The difference between the two styles becomes more apparent once we realise these aim to control orthogonal aspects: Walker's style imposes restrictions on the use of the function itself, whereas linear logic inspired systems impose restrictions on the use of bound variables inside the body of the function.

```haskell
id1 :: Int %1 -> Int
id1 x = x
```

```freest
id2 : Int -1-> Int
id2 x = x

someFunc : someType
someFunc = ... id2 (used exactly once) ...
```

Both `id1` and `id2` are well-typed: `id1` ensures the argument is used only once inside the body, whereas `id2` is ensured to be used exactly once in the program, even though in this case, `id2 : Int -*-> Int` would also be sound.


## Linear and unrestricted values

Most programming languages can use and reuse values at will. FreeST treats values differently according to their **multiplicity**. The multiplicity of a value (and hence of its type) governs the number of times the value must be used in any run of the program. Currently FreeST distinguishes two multiplicities: **linear** and **unrestricted**, written `1` and `*`. The former describes a value that must be exactly once, latter a value that may be used any number of times, zero included.

Unrestricted values are the values one finds in most programming languages. Linear Haskell features linear values, albeit of a slightly different nature. Rust features values that may used zero or once.

Let us start with the conventional unrestricted values. All constants are unrestricted, hence the following program compiles and prints `10`. Notice that value `n` id used twice
```freest
copy : ()
copy = 
    let n = 5 in print (n + n)
```

Unrestricted values may not be used at all. The program below still prints `10` but never uses the value in variable `n`.
```freest
discard : ()
discard = 
    let n = 5 in print 10
```

Functions may also be unrestricted. They can be copied:
```freest
double : Int -> Int
double x = x + x

copy : ()
copy = 
    print (double 5 + double 5)
```
or discarded
```freest
double : Int -> Int
double x = x + x

discard : ()
discard = 
    print 20
```
In either case, expect to read `20` on the console.

The type constructor for an unrestricted function is usually written as `->`. But that is an abbreviation for `-*->`, where the explicit `*` points to an unrestricted value. Function `double` could have been written ad follows.
```freest
double : Int -*-> Int
double x = x + x
```

Linear values are of a different nature: they must be used exactly once in any run of the program. This means they cannot be copied or discarded. Using an linear value invalidated any further use of the same value. Functions are probably the first linear values construct programmers are faced with. If we use `-*->` for an unrestricted function, we use `-1->` for a linear function. The program below attempts to use function `double` twice.
```freest
linDouble : Int -1-> Int
linDouble x = x + x

copy : ()
copy = 
    print (linDouble 5 + linDouble 5)
```
The compiler complains at the attempt to use the function for the second time:
```bash
CopyLinearFun.fst:6:23–8:29: error:
Variable out of scope: `double`
  | 
6 |     print (double 5 + double 5)
  |                       ^^^^^^
```

Similarly, not using a function declared as linear is a capital offense:
```freest
linDouble : Int -1-> Int
linDouble x = x + x

copy : ()
copy = 
    print 20
```
greeted by the compiler with an error stating that the value is not used:
```bash
DiscardLinearFun.fst:1:1–3:7: error:
Linear variable `double` is not consumed
  | 
1 | linDouble : Int -1-> Int
  | ^^^^^^
```

<!-- TODO: unrestricted can replace linear -->

## Treading carefully with linear functions

Linear functions seem simple, however there is more to it than meets the eye. The type `Int -1-> Int` describes a linear function that takes an integer and returns an integer, but what about type `Int -1-> Int -*-> Int`? This type also describes a linear function, but with a twist: the function is linear on its first argument only. If one partially applies the function, then they are left with an unrestricted function. This is easy to see if one recalls that `Int -1-> Int -*-> Int` stands for `Int -1-> (Int -*-> Int)`.
```freest
f : Int -1-> Int -*-> Int
f x y = x + y

partialApplication : ()
partialApplication = 
    let f' = f 1 in print (f' 3 + g 1 + f' 2)
```

In the above example, after partially applying `f` we are left with an unrestricted function `g` (of type `Int -*-> Int`) which we then use multiple times.

Let us now analyse a, similar in form but of quite different behaviour, type `Int -*-> Int -1-> Int`. This is more tricky than what we've seen until now. Let's analyze it step by step, look at it as `Int -*-> (Int -1-> Int)`. Now it's clearer that it represents an **unrestricted** function that takes an integer and returns another **linear** function that takes an integer and returns an integer.
```freest
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

## Linear constants

If all primitive types are unrestricted how do we talk of linear constants? There are different ways of addressing the problem.

1. Wrap an unrestricted type inside a linear type.

Works:
```freest
type LinInt : 1T
type LinInt = Int

extract : LinInt -> Int
extract x = x

copy : LinInt -> (LinInt, LinInt)
copy x = let y = extract x in (y, y)
```

Works not:
```freest
copy : LinInt -> (LinInt, LinInt)
copy x = (x, x)
```
Complaint:
```bash
LinIntType.fst:7:14–7:15: error:
Variable out of scope: `x`
  | 
7 | copy x = (x, x)
  |              ^
```

2. Wrap an unrestricted type inside a linear datatype.

Works:
```freest
type LinInt : 1T
data LinInt = MkLinInt Int

copy : LinInt -> (LinInt, LinInt)
copy (MkLinInt x) = (MkLinInt x, MkLinInt x)
```
Works not:
```freest
copy : LinInt -> (LinInt, LinInt)
copy x = (x, x)
```
Complaint:
```bash
LinIntData.fst:7:14–7:15: error:
Variable out of scope: `x`
  | 
7 | copy x = (x, x)
  |              ^
```

3. Define a linear datatype 
```freest
type LinBool : 1T
data LinBool = LTrue | LFalse
```
This is sort of useless. The constructors can only be used once.
```freest
doubleTrue : (LinBool, LinBool)
doubleTrue = (LTrue, LTrue)
```
Complaint:
```bash
LinBoolData.fst:7:22–7:27: error:
Constructor out of scope: `LTrue`
  | 
7 | doubleTrue = (LTrue, LTrue)
  |                      ^^^^^
```

<!-- TODO -->
<!-- maybe talk about a generator function `() -> (T 1-> U)` that might be useful in some cases -->
