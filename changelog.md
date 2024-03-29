---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Changelog
layout: default
nav_order: 3
nav_exclude: true
---

# Changelog

## Version 3.0.0
- REPL (`freesti`)
- New syntax for kinds: `1S` and `*S` for linear and unrestricted session types, `1T` and `*T` 
  for linear and unrestricted functional types
- Higher-order session types (removed kinds `ML` and `MU`)
- New syntax for functions: `1->` and `*->` (or simply `->`) for linear and unrestricted functions
- Pattern matching on function arguments (datatype constructors and internal choices)
- `End` type and `close` function for closing channels
- Simple module system
- Shared channels
- Library functions to work with shared channels
- Library functions to work with concurrency
- Primitives for file handling
- Primitives for handling Standard Input/Output (`stdout`, `stdin` and `stderr`)
- '`hPut`' functions to interact with a shared printing system
- Builtin support for lists of integers: `[]`, `[1,2,3]` and `(1::2::[])`
- Library functions over lists (`import List`)
- New syntax for type application: `id @Int` instead of `id [Int]`
- New type for `fork` function: `forall a:1T. (() 1-> a) -> ()`
- `new` is now a function of type `forall a:1S. () -> (a, dualof a)`
- Channels created through the `new` function must be ended (reach an `End`)
- Multiple function signatures in a row: `x, y, z : Int`
- Bug fixes


## Version 2.2.0
- Fork can be used with and without type parameters
- Send and receive can be used partially applied
- Adding collect function (`case collect c of` is the same of `match c with`)
- New mode with proper syntax-highlighting for emacs
- Better error messages
- Warning were added
- Now we allow the dual of non-recursive variables through co-variables
- Type abstractions are now values
- Added a restriction imposing expressions under type abstractions to be values
- Fixed the associativity of type applications
- Fixed the Duality for recursion variables
- New primitive fix : `forall a . ((a -> a) -> (a -> a)) -> (a -> a)`
- New option **-m** or **--main=** that allows to choose the main function to be run
- New option **-q** or **--quiet** that suppresses all warnings
- Small bug fixes

## Version 2.1.0
- Fork is now polymorphic
- Adding options **-v**,**--version** and **-h**,**--help**
- Tuning `show` for recursive and polymorphic types
- Small bug fixes

## Version 2.0.0
- Impredicative polymorphism (System F)
- New kinds that classify types that can be sent in channels (**MU** and **ML**)
- Adding more prelude functions (`(^)`, `max`, `min`, `succ`, `pred`, `abs`, `quot`, `gcd`, `lcm`, 
  `subtract`, `even`, `odd`, `error`, `id`, `flip`, `until`, `curry`, `uncurry`, `swap`).
- Section-like constants for all operators (`(+)`, `(*)`, ...)
- Proper sections for all operators (except for '-', one should use subtract in this case)
- Support for more multi-byte unicode symbols
- Printing boolean/arithmetic/relational operators in the infix way instead of prefix as it previously was.
- Small bug fixes

## Version 1.0.3a
- Fixes some issues related to Strings on v1.0.3 (Show for value and unparser)

## Version 1.0.3
- Adding String literals
- Adding `printString` and `printStringLn`
- Adding the `&` operator.
- Showing Types and expressions with less parentheses
- Small bug fixes

## Version 1.0.2
- Changing the order of the parameters of send and select functions
- Adding the `$` operator
- Small bug fixes

## Version 1.0.1
- Fixing error messages for environments. Now, it only shows the different elements between the two environments
- Fixing parser and lexer error messages
- Adding Ln print versions for basic types, namely, `printIntLn`, `printBoolLn`, `printCharLn`, and `printUnitLn`
- Adding a simple mode for emacs and atom
- Small bug fixes

