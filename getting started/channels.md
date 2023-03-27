---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Channels and session types
layout: default
nav_order: 4
parent: Getting started
---

# Channels and session types
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

# Channels, Protocols and Session types
<!-- channels as a way of connecting threads (and sharing data) -->
Channels are how FreeST threads communicate with each other. A channel is made of 
  **two endpoints**.

<!-- structured communication in channels through protocols -->
We create **protocols** for these channels as to structure communication, using **session types**. 

Imagine you want to create a situation of a client and a server of a `MathService`. The 
  `MathService` protocol gives the client two options: either negate a number, or check if a number
  is zero. Textually, we'll describe it as:
```
MathService =  Negate: send an Int, receive its negation
            OR IsZero: send an Int, receive True if its zero, False otherwise
```

Before writing a proper protocol with session types, let's look at what tools we have to do so:
```
!T          - send type T
?T          - receive type T
+{l:T, ..}  - select a choice with a continuation T 
&{l:T, ..}  - provide choices with continuation T
End         - close channel (terminate communication)
Skip        - neutral element of session types
T;U         - session type combinator
```

Now we can translate our textual representation of `MathService`. It is common practice in FreeST
  to write our protocols from the point of view of the client because it is simpler. However, if 
  your particular case is different, feel free to do the opposite.

First, our options (`Negate` and `IsZero`) map directly to selecting choices, so we have
  `+{Negate:T, IsZero:U}`. We only need to describe types `T` and `U`. For `T`, we send an Int
  and then receive an Int, which come as `!Int` and `?Int` respectively, that are then combined
  into `!Int;?Int`. Now type `U` seems much more simple, we send an Int and then receive a Bool,
  so we write `!Int;?Bool`. The full session type in FreeST is:
```
type MathService : 1S = +{ Negate: !Int;?Int
                         , IsZero: !Int;?Bool
                         }; End
```

At the end of each option's interaction the outcome is the same, we end the protocol, hence the
  `End`. If we write it without the `End` type, it default to `Skip`, however, as a rule of FreeST
  **you cannot instantiate a channel of a type which does not come to an `End`**. Thus, `Skip` is
  useful when the intention is to combine the session type with others.

To obtain the server's point of view of the `MathService` protocol, is to apply the **dualof** type
  operator to it. Thus, instead of writing it by hand, we just write `dualof MathService`, and 
  FreeST will do the work for us.


## Interacting with channels
<!-- primitives on channels -->
We've talked about session types for structured communication through channels, but how does it
  translate into code? Each session type has a corresponding channel operation (with exceptions
  to `Skip` and the session type combinator):
```
!T          - send
?T          - receive
+{l:T, ..}  - select
&{l:T, ..}  - match
End         - close
``` 

And to instantiate new channels we use `new`.

<!-- Before we go on with our  -->


<!-- linear channels -->




<!-- TODO: -->
<!-- polymorphic recursion -->
<!-- avoiding deadlocks (initiative) -->
<!-- limitations with linear channels -->
<!-- shared channels -->

<!-- TODO: -->
<!-- ## Useful constructs with shared channels -->
<!-- synchronization process -->
<!-- shared data structures -->