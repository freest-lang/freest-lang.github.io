---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Downloads
layout: default
nav_order: 2
---

# Downloads
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

## FreeST
For installation details please refer to the README file in the corresponding zip folder.

| Version | Release date | Changelog                                                             | Download link                                                                            |
| ------- | ------------ | --------------------------------------------------------------------- | :--------------------------------------------------------------------------------------: |
| 3.0.0   | Apr 12, 2023 | [Changelog]({{ site.url }}{{ site.baseurl }}/downloads/#version-300)  | [Download](http://rss.di.fc.ul.pt/wp-content/uploads/2023/04/FreeST-3.0.0.zip){: .btn }  |
| 2.2.0   | Nov 16, 2021 | [Changelog]({{ site.url }}{{ site.baseurl }}/downloads/#version-220)  | [Download](http://rss.di.fc.ul.pt/wp-content/uploads/2021/11/FreeST-2.2.0.zip){: .btn }  |
| 2.1.0   | Mar 30, 2021 | [Changelog]({{ site.url }}{{ site.baseurl }}/downloads/#version-210)  | [Download](http://rss.di.fc.ul.pt/wp-content/uploads/2021/03/FreeST-2.1.0.zip){: .btn }  |
| 2.0.0   | Feb 15, 2021 | [Changelog]({{ site.url }}{{ site.baseurl }}/downloads/#version-200)  | [Download](http://rss.di.fc.ul.pt/wp-content/uploads/2021/02/FreeST-2.0.0.zip){: .btn }  |
| 1.0.3a  | Jan 12, 2021 | [Changelog]({{ site.url }}{{ site.baseurl }}/downloads/#version-103a) | [Download](http://rss.di.fc.ul.pt/wp-content/uploads/2021/01/FreeST-1.0.3a.zip){: .btn } |
| 1.0.3   | Jan 10, 2021 | [Changelog]({{ site.url }}{{ site.baseurl }}/downloads/#version-103)  | [Download](http://rss.di.fc.ul.pt/wp-content/uploads/2021/01/FreeST-1.0.3.zip){: .btn }  |
| 1.0.2   | Nov 26, 2020 | [Changelog]({{ site.url }}{{ site.baseurl }}/downloads/#version-102)  | [Download](http://rss.di.fc.ul.pt/wp-content/uploads/2020/11/FreeST-1.0.2.zip){: .btn }  |
| 1.0.1   | Jul 22, 2020 | [Changelog]({{ site.url }}{{ site.baseurl }}/downloads/#version-101)  | [Download](http://rss.di.fc.ul.pt/wp-content/uploads/2020/07/FreeST-1.0.1.zip){: .btn }  |

### Changelog

#### Version 3.0.0
- REPL (freesti)
- New syntax for kinds: 1S and *S for linear and unrestricted session types, 1T and *T for linear and unrestricted functional types
- Higher-order session types (removed kinds ML and MU)
- New syntax for functions: 1-> and *-> (or simply ->) for linear and unrestricted functions
- Pattern matching on function arguments (datatype constructors and internal choices)
- 'End' type and 'close' function for closing channels
- Simple module system
- Shared channels
- Library functions to work with shared channels
- Library functions to work with concurrency
- Primitives for file handling
- Primitives for handling Standard Input/Output (stdout, stdin and stderr)
- 'hPut' functions to interact with a shared printing system
- Builtin support for lists of integers: [], [1,2,3] and (1::2::[])
- Library functions over lists ('import List')
- New syntax for type application: id @Int instead of id [Int]
- New type for 'fork' function: forall a:1T. (() 1-> a) -> ()
- 'new' is now a function of type forall a:1S. () -> (a, dualof a)
- Channels created through the 'new' function must be ended (reach an 'End')
- Multiple function signatures in a row: x, y, z : Int
- Bug fixes

#### Version 2.2.0
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

#### Version 2.1.0
- Fork is now polymorphic
- Adding options **-v**,**--version** and **-h**,**--help**
- Tuning `show` for recursive and polymorphic types
- Small bug fixes

#### Version 2.0.0
- Impredicative polymorphism (System F)
- New kinds that classify types that can be sent in channels (**MU** and **ML**)
- Adding more prelude functions (`(^)`, `max`, `min`, `succ`, `pred`, `abs`, `quot`, `gcd`, `lcm`, 
  `subtract`, `even`, `odd`, `error`, `id`, `flip`, `until`, `curry`, `uncurry`, `swap`).
- Section-like constants for all operators (`(+)`, `(*)`, ...)
- Proper sections for all operators (except for '-', one should use subtract in this case)
- Support for more multi-byte unicode symbols
- Printing boolean/arithmetic/relational operators in the infix way instead of prefix as it previously was.
- Small bug fixes

#### Version 1.0.3a
- Fixes some issues related to Strings on v1.0.3 (Show for value and unparser)

#### Version 1.0.3
- Adding String literals
- Adding `printString` and `printStringLn`
- Adding the `&` operator.
- Showing Types and expressions with less parentheses
- Small bug fixes

#### Version 1.0.2
- Changing the order of the parameters of send and select functions
- Adding the `$` operator
- Small bug fixes

#### Version 1.0.1
- Fixing error messages for environments. Now, it only shows the different elements between the two environments
- Fixing parser and lexer error messages
- Adding Ln print versions for basic types, namely, `printIntLn`, `printBoolLn`, `printCharLn`, and `printUnitLn`
- Adding a simple mode for emacs and atom
- Small bug fixes



## Tools
- [**Syntax Highlighting for Visual Studio Code**](https://github.com/freest-lang/freest-lsp) (available on Visual Studio Marketplace)
- [**Language support for Visual Studio Code**](https://github.com/freest-lang/freest-language) (available on Visual Studio Marketplace)
