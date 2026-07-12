---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Threads and channels, channels and threads
layout: default
nav_order: 5
parent: Tutorial
---

# Threads and channels, channels and threads
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

## Creating threads

The previous section have used the `forkWith` combinator to accomplish two distinct things:
* Create a new channel and
* Fork a new thread.

A channel is created. A thread is forked. One of channel's two endpoints is passed to the new thread. The other endpoint is returned by the combinator, returned to the parrent. This should always be plan A. By using `forkWith` alone we are guaranteed to build tree-shaped configurations of threads, where threads are the nodes in the tree and channels connect nodes. And a tree-shaped configuration is guaranteed not to deadlock.