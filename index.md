---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Home
layout: minimal
nav_order: 1
---

<div align="center">
  <picture>
    <img alt="FreeST: a functional programming language for safe concurrency powered by context-free session types"
         src="resources/images/freest-logo-h-light.svg"
         width="50%">
  </picture>  
  <br/><br/>
  A functional programming language for safe concurrency<br/>
  powered by context-free session types
</div>
<br/>
[Downloads]({{ site.url }}{{ site.baseurl }}\downloads){: .btn .mr-0 } [Getting started]({{ site.url }}{{ site.baseurl }}\getting started\install){: .btn .mr-0 } [Libraries]({{ site.url }}{{ site.baseurl }}\libraries\prelude){: .btn .mr-0 } [Publications]({{ site.url }}{{ site.baseurl }}\publications){: .btn .mr-0 } [Team]({{ site.url }}{{ site.baseurl }}\team){: .btn .mr-0 } [Try it online!](http://rss.di.fc.ul.pt/tryit/FreeST){: .btn .mr-0 }
{: .text-center }

FreeST is a typed concurrent programming language where processes communicate
via message-passing. Messages are exchanged on bidirectional channels.
Communication on channels is governed by a powerful type system based on
polymorphic context-free session types. Built on a core linear functional
programming language, FreeST features primitives for forking new threads, for
creating channels and for communicating on these. The compiler builds on a
novel algorithm for deciding the equivalence of context-free types.

FreeST is funded by FCT, project [SafeSessions](https://www.lasige.pt/project/safesessions/), Safe Concurrent Programming with Session Types, [DOI](https://sciproj.ptcris.pt/en/164457PRJ), from March 2021 to August 2024.