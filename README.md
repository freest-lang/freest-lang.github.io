# FreeST Website

## How to update the website with new content

The website automatically compiles with Jekyll and re-deploys with GitHub Pages whenever there is a
    push to the `main` branch.

All content can be written using plain Markdown syntax. There are some edge cases where some `html`
    might be needed for some *extra glamour*, but for that, refer to the 
    [original theme documentation](https://just-the-docs.com/).

## How to write without releasing

For cases where it is desirable to continuously write for website without releasing, simply develop
    on a different branch. Once the changes are ready for publishing, merge with the `main` branch 
    and they will be published (as discussed previously).

## How to add/update FreeST libraries

The FreeST website has documentation for all its standard libraries (Prelude, List, File, ..). To 
    avoid the need to maintain these by hand, these pages are generated from the corresponding 
    `.fst` source files using the `DocGen.hs` script. Refer to FreeST's README for more information
    on how to use it.

Attention that every standard library page has to begin with a specific header:
```
---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: <library name>
layout: default
nav_order: <order on the left navigation bar>
parent: Libraries
---

# <library name>
{: .no_toc}

<!-- collapsible TOC (check https://just-the-docs.github.io/just-the-docs/docs/navigation-structure/#top) -->
<details markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>
```

Be sure to correctly add (or maintain) this header with the correct `<library name>` and 
    `<order on the left navigation bar>`.

## How add a new version

After a new FreeST release, there are two major changes required to the `Downloads` page 
    (`downloads.md` file):
    - changelog added to the `Changelog` section 
    - a new table line with: version, release date, link to changelog, and download link
