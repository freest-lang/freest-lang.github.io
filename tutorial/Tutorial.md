---
title: Tutorial
layout: default
nav_order: 3
has_children: true
has_toc: true
permalink: /tutorial/
---

# Tutorial

FreeST is a programming language. Here's some of its characteristics:

* *Functional*, meaning that computation is driven by function application;
* *Concurrent*, meaning that a program is a collection of threads running on the same machine;
* *Message passing*, meaning that threads communicate by exchanging messages on communication channels (shared memory is not supported, but you may want to simulate it with message passing);
* Featuring *Buffered channels*, meaning that channels are endowed with buffers to store messages in transit;
* *Eager*, or call-by-value, meaning that expressions are evaluated before being passed to functions;
* *State changing*, or impure, meaning that some primitive operations change the state of the world (create new channels, fork new threads);
* Built on *context-free session types*, meaning that one can sequentially compose two given session types;
* *Impredicative*, based on system F, meaning that it is endowed with a quite powerful type system, but it also means that type inference is undecidable. The type checker does its best at inferring local types, but you may have to help it;
* 