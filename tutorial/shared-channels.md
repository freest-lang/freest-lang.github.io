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

## Cake or disappointment?

All the examples we have seen so far feature inter-tread communication via channels, whose endpoints are held by exactly one thread. This scheme makes sures that there are unexpected messages on buffers: senders write what is supposed to be written, and receivers read exactly values of the expected type. Compounded with the use of the `forkWith` primitive to create new threads and new channels, programs are expected not to deadlock.

But someone must take the last cake in the cake in the store. Here's the scenario taken from Kokke, Morris, Wadler: Towards Races in Linear Logic. Log. Methods Comput. Sci. 16(4) (2020).

Ami and Boé are working from home one morning when they each get a
craving for a slice of cake. Being denizens of the web, they quickly find the
nearest store which does home deliveries. Unfortunately for them, they both
order their cake at the *same* store, which has only one slice left. After that,
all it can deliver is disappointment.



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
