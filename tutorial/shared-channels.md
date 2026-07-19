---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Sharing is caring
layout: default
nav_order: 7
parent: Tutorial
---

# Shared channels
{: .no_toc }

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .no_toc .text-delta }
- TOC
{:toc}
</details>

## Fork-join

We have seen examples of programs with three threads and they all terminated as expected. But that need be the case. What do you expect to read on the console after running this code?
```freest
main =
    fork (\_ -> print 'A') ;
    fork (\_ -> print 'B') ;
    fork (\_ -> print 'B') ;
    ()
```
The precise answer is any sequence of three distinct letter, of sizes 0 to 3. Yes, no output is a possible answer. It happens when `main` terminates before any of the three print threads did not had a chance to `print`.

If reading the three letters on the console is intended, then `main` must wait for the three threads to terminate. Interthread communication is by message passing alone, and so we need a channel, a channel with three writers and one reader, that is a *shared* channel.
