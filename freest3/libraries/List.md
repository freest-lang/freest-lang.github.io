---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: List
layout: default
nav_order: 2
parent: Libraries
grand_parent: FreeST3
---

# List
{: .no_toc}

<div class="lib-note" markdown="1">
The **List** library collects operations over integer lists (`[Int]`). Bring it
into scope with `import List`.

The functions are grouped by purpose below; each table lists a function and its
type.
</div>

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Basic operations

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `head` | `[Int] -> Int`{: .language-freest } |
| `last` | `[Int] -> Int`{: .language-freest } |
| `tail` | `[Int] -> [Int]`{: .language-freest } |
| `init` | `[Int] -> [Int]`{: .language-freest } |
| `singleton` | `Int -> [Int]`{: .language-freest } |
| `null` | `[Int] -> Bool`{: .language-freest } |
| `length` | `[Int] -> Int`{: .language-freest } |
| `reverse` | `[Int] -> [Int]`{: .language-freest } |

## Transforming lists

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `map` | `(Int -> Int) -> [Int] -> [Int]`{: .language-freest } |
| `intersperse` | `Int -> [Int] -> [Int]`{: .language-freest } |
| `concatMap` | `(Int -> [Int]) -> [Int] -> [Int]`{: .language-freest } |
| `filter` | `(Int -> Bool) -> [Int] -> [Int]`{: .language-freest } |
| `partition` | `(Int -> Bool) -> [Int] -> ([Int], [Int])`{: .language-freest } |

## Folding and scanning

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `foldl` | `forall a:*T . (a -> Int -> a) -> a -> [Int] -> a`{: .language-freest } |
| `foldr` | `forall a:*T . (Int -> a -> a) -> a -> [Int] -> a`{: .language-freest } |
| `scanl` | `(Int -> Int -> Int) -> Int -> [Int] -> [Int]`{: .language-freest } |
| `scanl1` | `(Int -> Int -> Int) -> [Int] -> [Int]`{: .language-freest } |
| `scanr` | `(Int -> Int -> Int) -> Int -> [Int] -> [Int]`{: .language-freest } |
| `scanr1` | `(Int -> Int -> Int) -> [Int] -> [Int]`{: .language-freest } |
| `mapAccumL` | `forall a:*T . (a -> Int -> (a, Int)) -> a -> [Int] -> (a, [Int])`{: .language-freest } |
| `mapAccumR` | `forall a:*T . (a -> Int -> (a, Int)) -> a -> [Int] -> (a, [Int])`{: .language-freest } |

## Searching and predicates

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `any` | `(Int -> Bool) -> [Int] -> Bool`{: .language-freest } |
| `all` | `(Int -> Bool) -> [Int] -> Bool`{: .language-freest } |
| `elem` | `Int -> [Int] -> Bool`{: .language-freest } |
| `notElem` | `Int -> [Int] -> Bool`{: .language-freest } |

## Aggregating

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `sum` | `[Int] -> Int`{: .language-freest } |
| `product` | `[Int] -> Int`{: .language-freest } |
| `maximum` | `[Int] -> Int`{: .language-freest } |
| `minimum` | `[Int] -> Int`{: .language-freest } |

## Extracting sublists

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `take` | `Int -> [Int] -> [Int]`{: .language-freest } |
| `drop` | `Int -> [Int] -> [Int]`{: .language-freest } |
| `splitAt` | `Int -> [Int] -> ([Int], [Int])`{: .language-freest } |
| `takeWhile` | `(Int -> Bool) -> [Int] -> [Int]`{: .language-freest } |
| `dropWhile` | `(Int -> Bool) -> [Int] -> [Int]`{: .language-freest } |
| `span` | `(Int -> Bool) -> [Int] -> ([Int], [Int])`{: .language-freest } |
| `break` | `(Int -> Bool) -> [Int] -> ([Int], [Int])`{: .language-freest } |

## Indexing and comparison

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `nth` | `[Int] -> Int -> Int`{: .language-freest } |
| `elemAt` | `[Int] -> Int -> Int`{: .language-freest } |
| `equal` | `[Int] -> [Int] -> Bool`{: .language-freest } |

## Zipping

{: .lib-table}
| Function | Type |
|:---------|:-----|
| `zipWith` | `(Int -> Int -> Int) -> [Int] -> [Int] -> [Int]`{: .language-freest } |
| `zipWith3` | `(Int -> Int -> Int -> Int) -> [Int] -> [Int] -> [Int] -> [Int]`{: .language-freest } |
