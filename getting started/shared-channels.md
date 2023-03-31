---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Sharing is caring
layout: default
nav_order: 6
parent: Getting started
---

# Sharing is caring
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


<!-- limitations with linear channels -->
You've come far in FreeST, you used channels in many ways but you ask yourself "Can I connect more
  than two processes with linear channels?", and the answer yes a reluctant "Yes, but...". Linear 
  channels are expressive but only connect two participants. 
  
One way to implement one-to-many, many-to-one or many-to-many communication is to use lists of 
  channels and iterate through them as needed. However it seems simpler than what it is. FreeST's 
  channels are blocking, and thus, iterating a list of linear channels will become a slow 
  sequential operation. Remember that linear channels are short-sighted and you can't "wait" for 
  some channel to have a ready participant on the other side, you go in blind to wether or not the
  other side is ready to talk. 

<!-- shared channels -->
To fulfil the use-cases left open by linear channels, FreeST also has unrestricted (shared) 
  channels. Shared channels are simpler in their types but they can be copied and used (or not)
  by as many processes as needed. The most important aspect of shared channels for you to remember
  is **"shared channels have the same type forever"** so we can express a shared `Int` stream as
  `*?Int`, where many processes can `receive` an `Int` for as long as there are processes on the 
  other side available to `send` one.

There are four shared session types at your disposal (one for each linear session type): 
  `*?T`, `*!T`, `*+{l, ..}`, and `*&{l, ..}`. Why do the choices have no continuation? You might 
  ask. Because shared session types always have the same type forever, and the choice by itself
  is a type, therefore, there is no need for a continuation in a type where you can only `select`
  or `match`.

## Session initiation
If shared channels are more practical than linear ones, why bother with linear channels? You can't
  serialize a tree directly in a shared channel for example. Shared channels lack the capacity of
  expressing interesting protocols. 

The trick with shared channels is to use them not as a single communication point, but as a 
  rendez-vous point to establish more complex communication in a linear channel by exchanging 
  endpoints. We call this **session initiation**.

Let's think of a very useful case in programming, a shared data structure, in this case a single
  memory cell.
```
type Cell : 1S = +{ Read: ?Int
                  , Write: !Int
                  }; End
```

The `Cell` session type describes our possible interaction with an `Int` memory cell.
```
type SharedCell : *S = *?Cell
```

The `SharedCell` type describes a channel on which a client can `receive` another channel with the
  `Cell` type. An example of a client that writes to the cell is:
```
cellClient : SharedCell -> ()
cellClient c =
    c 
    |> receive      -- acquires the linear channel 
    |> select Write
    |> send 5
    |> close
```

However, it is the server that bears the important part of session initiation: to create the new 
  channel and send it. The following is a one-shot server that only serves one client and then 
  stops:
```
cellServer : dualof SharedCell -> ()
cellServer c =
    let (client, server) = new @Cell () in -- create linear endpoints
    send client c;                         -- send one to the client
    match server with {                    -- serve the other
        Read s ->
            s
            |> send 0,
        Write s ->
            let (i, c) = receive s in
            c
    } |> close
```

To aid session initiation, FreeST has the `accept` Prelude function which creates the channel 
  endpoints, sends one to the client and returns the other. Our code could then be simplified
  by writing:
```
cellServer : dualof SharedCell -> ()
cellServer c =
    match accept @Cell c with {
        ...
    } ...
```

<!-- TODO: -->
<!-- ## Useful constructs with shared channels -->
<!-- synchronization process -->
<!-- shared data structures -->