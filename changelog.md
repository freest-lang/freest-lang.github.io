---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Changelog
layout: default
nav_order: 3
---

# Changelog

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

