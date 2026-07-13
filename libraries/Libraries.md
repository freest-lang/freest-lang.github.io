---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Libraries
layout: default
nav_order: 5
has_children: true
has_toc: false # avoid table of contents in the end of the page
---

# Libraries

This section documents FreeST's standard libraries. Chief among them is the
**Prelude**, which is included implicitly into every program, so the functions
and combinators it provides — such as `print`, the reverse-application operator
`|>`, and channel helpers like `forkWith`, `sendAndClose`, and `receiveAndWait`
— are available without any `INCLUDE` pragma of your own.