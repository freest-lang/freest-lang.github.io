---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: List
layout: default
nav_order: 2
parent: Libraries
---

# List
{: .no_toc}

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<!-- <details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details> -->

## `head : [Int] -> Int`



## `last : [Int] -> Int`



## `tail : [Int] -> [Int]`



## `init : [Int] -> [Int]`



## `singleton : Int -> [Int]`



## `null : [Int] -> Bool`



## `length : [Int] -> Int`



## `map : (Int -> Int) -> [Int] -> [Int]`



## `reverse : [Int] -> [Int]`



## `intersperse : Int -> [Int] -> [Int]`



## `foldl : forall a:*T . (a -> Int -> a) -> a -> [Int] -> a`



## `foldr : forall a:*T . (Int -> a -> a) -> a -> [Int] -> a`



## `any : (Int -> Bool) -> [Int] -> Bool`



## `all : (Int -> Bool) -> [Int] -> Bool`



## `concatMap : (Int -> [Int]) -> [Int] -> [Int]`



## `sum : [Int] -> Int`



## `product : [Int] -> Int`



## `maximum : [Int] -> Int`



## `minimum : [Int] -> Int`



## `scanl : (Int -> Int -> Int) -> Int -> [Int] -> [Int]`



## `scanl1 : (Int -> Int -> Int) -> [Int] -> [Int]`



## `scanr : (Int -> Int -> Int) -> Int -> [Int] -> [Int]`



## `scanr1 : (Int -> Int -> Int) -> [Int] -> [Int]`



## `mapAccumL : forall a:*T . (a -> Int -> (a, Int)) -> a -> [Int] -> (a, [Int])`



## `mapAccumR : forall a:*T . (a -> Int -> (a, Int)) -> a -> [Int] -> (a, [Int])`



## `take : Int -> [Int] -> [Int]`



## `drop : Int -> [Int] -> [Int]`



## `splitAt : Int -> [Int] -> ([Int], [Int])`



## `takeWhile : (Int -> Bool) -> [Int] -> [Int]`



## `dropWhile : (Int -> Bool) -> [Int] -> [Int]`



## `span : (Int -> Bool) -> [Int] -> ([Int], [Int])`



## `break : (Int -> Bool) -> [Int] -> ([Int], [Int])`



## `elem : Int -> [Int] -> Bool`



## `notElem : Int -> [Int] -> Bool`



## `filter : (Int -> Bool) -> [Int] -> [Int]`



## `partition : (Int -> Bool) -> [Int] -> ([Int], [Int])`



## `nth : [Int] -> Int -> Int`



## `zipWith : (Int -> Int -> Int) -> [Int] -> [Int] -> [Int]`



## `zipWith3 : (Int -> Int -> Int -> Int) -> [Int] -> [Int] -> [Int] -> [Int]`



## `elemAt : [Int] -> Int -> Int`



## `equal : [Int] -> [Int] -> Bool`



