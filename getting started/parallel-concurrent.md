---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Concurrent programming
layout: default
nav_order: 5
parent: Getting started
---

# Concurrent programming
{: .no_toc }

<!-- TODO -->
<!-- some intro text here -->

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

<!-- TODO -->
<!-- intro to parallel programming in FreeST -->
<!-- parallel programming is an important subject in FreeST -->

## It's not a spoon, it's a `fork`
As a language dedicated to communication and concurrency, FreeST provides the `fork` function to 
execute code in parallel, i.e. in another thread.
```freest
fork : forall a:*T . (() 1-> a) -> ()
```
A program has at least one thread, the **main** thread. Program execution always ends when the main 
thread ends, no matter how many running threads are there.