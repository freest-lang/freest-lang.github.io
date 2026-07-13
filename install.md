---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Install
layout: default
nav_order: 2
---

# Install FreeST
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

## Pre-requisites

Before installing FreeST you need two things: Haskell and Stack. Check how to install them at [Haskell's official website](https://www.haskell.org/download/) (GHCup recomended).


## Download and install FreeST

Download FreeST by cloning the repository:
```bash
$ git clone --branch fopss26 --depth 1 https://github.com/freest-lang/freest.git
$ cd freest
$ stack install
```

To type check and run a script use `freest`:
```bash
$ freest hello.fst
```

To run the interactive interpreter use `freest -i`:
```bash
$ freest -i
```

Be sure that the Stack's install folder is part of your system's path, or else you will not be able to run `freest`.