---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: File
layout: default
nav_order: 3
parent: Libraries
---

# File
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

## **openWriteFile**
**Type**: `FilePath -> OutStream`

Opens an `OutStream` channel endpoint to a file specified by a path, in write mode.


## **openAppendFile**
**Type**: `FilePath -> OutStream`

Opens an `OutStream` channel endpoint to a file specified by a path, in append mode.


## **openReadFile**
**Type**: `FilePath -> InStream`

Opens an `InStream` channel endpoint to a file specified by a path, in read mode.


## **writeFile**
**Type**: `FilePath -> String -> ()`

Writes a string to a file specified by a path. 
Does the same as `openWriteFile fp |> hPutStr s |> hCloseOut`.


## **appendFile**
**Type**: `FilePath -> String -> ()`

Write a string to a file specified by a path. 
Does the same as `openAppendFile fp |> hPutStr s |> hCloseOut`.


## **readFile**
**Type**: `FilePath -> String`

Read the contents of a file specified by a path. Note that the string separates lines 
explicitely with the newline character `\n`.


