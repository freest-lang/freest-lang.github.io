---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Modules
layout: default
nav_order: 7
parent: Getting started
---

# Modules
{: .no_toc }

<!-- TODO -->
<!-- some intro text here -->
<!-- good to compartmentalize code -->

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Syntax
<!-- syntax -->
To define your module, simply write `module <module name> where` at the start of your source code.

<!-- module name == file name -->
Remember that the module name has to the match the file's name, so if your file is `Foo.fst`, your
  module definition must be `module Foo where`.

<!-- restrictions for now -->
As of version 3.0.0, it is not possible to selectively export functions.

## Importing modules
To import modules, simply use `import <module name>`. For example, if you have a module `Foo`,
  you write `import Foo` to import all its functions.