---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: List
layout: default
nav_order: 2
parent: Documentation
---

# Table of contents
{: .no_toc}

- TOC
{:toc}

## **List**
**Type**: `data List = Nil | Cons Int List`

## **Maybe**
**Type**: `data Maybe = Nothing | Just Int`

## **map**
**Type**: `map : (Int -> Int) -> List -> List`

## **append**
**Type**: `append : List -> List -> List`

## **filter**
**Type**: `filter : (Int -> Bool) -> List -> List`

## **head**
**Type**: `head : List -> Int`

## **last**
**Type**: `last : List -> Int`

## **tail**
**Type**: `tail : List -> List`

## **init**
**Type**: `init : List -> List`

## **null**
**Type**: `null : List -> Bool`

## **length**
**Type**: `length : List -> Int`

## **elemAt**
**Type**: `elemAt : List -> Int -> Int`

## **reverse**
**Type**: `reverse : List -> List`

## **all**
**Type**: `all : (Int -> Bool) -> List -> Bool`

## **any**
**Type**: `any : (Int -> Bool) -> List ->  Bool`

## **concatMap**
**Type**: `concatMap : (Int -> List) -> List -> List`

## **scanl**
**Type**: `scanl : (Int -> Int -> Int) -> Int -> List -> List`

## **scan**
**Type**: `scan : (Int -> Int -> Int) -> Int -> List -> List`

## **scanl1**
**Type**: `scanl1 : (Int -> Int -> Int) -> List -> List`

## **scanr**
**Type**: `scanr : (Int -> Int -> Int) -> Int -> List -> List`

## **scanr1**
**Type**: `scanr1 : (Int -> Int -> Int) -> List -> List`

## **take**
**Type**: `take : Int -> List -> List`

## **drop**
**Type**: `drop : Int -> List -> List`

## **splitAt**
**Type**: `splitAt : Int -> List -> (List, List)`

## **takeWhile**
**Type**: `takeWhile : (Int -> Bool) -> List -> List`

## **dropWhile**
**Type**: `dropWhile : (Int -> Bool) -> List -> List`

## **span**
**Type**: `span : (Int -> Bool) -> List -> (List, List)`

## **break**
**Type**: `break : (Int -> Bool) -> List -> (List, List)`

## **elem**
**Type**: `elem : Int -> List -> Bool`

## **notElem**
**Type**: `notElem : Int -> List -> Bool`

## **zipWith**
**Type**: `zipWith : (Int -> Int -> Int) -> List -> List -> List`

## **zipWith3**
**Type**: `zipWith3 : (Int -> Int -> Int -> Int) -> List -> List -> List -> List`
