---
title: Tutorial
layout: default
nav_order: 3
has_children: true
has_toc: false
permalink: /tutorial/
---

# The FreeST programming language

FreeST is a functional programming language for safe concurrency, powered by
context-free session types. Here are the ideas that shape it:

* **Functional** — computation is driven by function application.
* **Eager** — call-by-value: expressions are evaluated before being passed to functions.
* **State-changing** — some primitive operations change the state of the world (create new channels, fork new threads).
* **Concurrent** — a program is a collection of threads running on the same machine.
* **Message passing** — threads communicate by exchanging messages on channels; shared memory is not supported, but you can simulate it with message passing.
* **Buffered channels** — channels carry buffers that hold messages in transit.
* **Linear** — channel endpoints (and other linear resources) must be used exactly once, which is what keeps communication safe.
* **Context-free session types** — channel protocols are themselves types, and can be composed sequentially.
* **Statically typed** — well-typed programs are guaranteed to follow their communication protocols, with no mismatched or missing messages.
* **Impredicative (System F)** — a type system powerful enough that type inference is undecidable; the checker infers local types where it can, but you may occasionally have to help it.
* **Higher-order polymorphism** — type abstraction and application, so channels can convey values of an arbitrary type.