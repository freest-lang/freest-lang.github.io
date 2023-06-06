---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: List
layout: default
nav_order: 2
parent: Documentation
---

# List
{: .no_toc}

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## **append**
**Type**: `[Int] -> [Int] -> [Int]`



## **head**
**Type**: `[Int] -> Int`



## **last**
**Type**: `[Int] -> Int`



## **tail**
**Type**: `[Int] -> [Int]`



## **init**
**Type**: `[Int] -> [Int]`



## **singleton**
**Type**: `Int -> [Int]`



## **null**
**Type**: `[Int] -> Bool`



## **length**
**Type**: `[Int] -> Int`



## **map**
**Type**: `(Int -> Int) -> [Int] -> [Int]`



## **reverse**
**Type**: `[Int] -> [Int]`



## **intersperse**
**Type**: `Int -> [Int] -> [Int]`



## **foldl**
**Type**: `forall a:*T . (a -> Int -> a) -> a -> [Int] -> a`



## **foldr**
**Type**: `forall a:*T . (Int -> a -> a) -> a -> [Int] -> a`



## **any**
**Type**: `(Int -> Bool) -> [Int] -> Bool`



## **all**
**Type**: `(Int -> Bool) -> [Int] -> Bool`



## **concatMap**
**Type**: `(Int -> [Int]) -> [Int] -> [Int]`



## **sum**
**Type**: `[Int] -> Int`



## **product**
**Type**: `[Int] -> Int`



## **maximum**
**Type**: `[Int] -> Int`



## **minimum**
**Type**: `[Int] -> Int`



## **scanl**
**Type**: `(Int -> Int -> Int) -> Int -> [Int] -> [Int]`



## **scanl1**
**Type**: `(Int -> Int -> Int) -> [Int] -> [Int]`



## **scanr**
**Type**: `(Int -> Int -> Int) -> Int -> [Int] -> [Int]`



## **scanr1**
**Type**: `(Int -> Int -> Int) -> [Int] -> [Int]`



## **mapAccumL**
**Type**: `forall a:*T . (a -> Int -> (a, Int)) -> a -> [Int] -> (a, [Int])`



## **mapAccumR**
**Type**: `forall a:*T . (a -> Int -> (a, Int)) -> a -> [Int] -> (a, [Int])`



## **take**
**Type**: `Int -> [Int] -> [Int]`



## **drop**
**Type**: `Int -> [Int] -> [Int]`



## **splitAt**
**Type**: `Int -> [Int] -> ([Int], [Int])`



## **takeWhile**
**Type**: `(Int -> Bool) -> [Int] -> [Int]`



## **dropWhile**
**Type**: `(Int -> Bool) -> [Int] -> [Int]`



## **span**
**Type**: `(Int -> Bool) -> [Int] -> ([Int], [Int])`



## **break**
**Type**: `(Int -> Bool) -> [Int] -> ([Int], [Int])`



## **elem**
**Type**: `Int -> [Int] -> Bool`



## **notElem**
**Type**: `Int -> [Int] -> Bool`



## **filter**
**Type**: `(Int -> Bool) -> [Int] -> [Int]`



## **partition**
**Type**: `(Int -> Bool) -> [Int] -> ([Int], [Int])`



## **nth**
**Type**: `[Int] -> Int -> Int`



## **zipWith**
**Type**: `(Int -> Int -> Int) -> [Int] -> [Int] -> [Int]`



## **zipWith3**
**Type**: `(Int -> Int -> Int -> Int) -> [Int] -> [Int] -> [Int] -> [Int]`



## **elemAt**
**Type**: `[Int] -> Int -> Int`



## **equal**
**Type**: `[Int] -> [Int] -> Bool`



