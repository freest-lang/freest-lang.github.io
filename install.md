---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: Install
layout: default
nav_order: 2
---

# Install FreeST
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


## Download and install FreeST

Pre-requisites:
- [Git](https://git-scm.com/downloads)
- Haskell and Stack. Check how to install them at [Haskell's official website](https://www.haskell.org/download/) (GHCup recomended).

Clone the repository and install:
```bash
git clone --branch dev --depth 1 https://github.com/freest-lang/freest.git
cd freest
stack install
```

To type check and run a script use `freest`:
```bash
freest hello.fst
```

To run the interactive interpreter use `freest -i`:
```bash
freest -i
```

Be sure that the Stack's install folder is part of your system's path, or else you will not be able to run `freest`.

## Download and install the Visual Studio Code extension

Pre-requisites:
* [Git](https://git-scm.com/downloads)
* [Visual Studio Code](https://code.visualstudio.com/) 1.93 or later
* FreeST, installed as above
* [Node.js](https://nodejs.org/en/download) 22 or later (for building, while it is not available in the extension marketplace)

Clone the repository and build:
```bash
git clone --branch main --depth 1 https://github.com/freest-lang/vscode-freest.git
cd vscode-freest
npm install
npx vsce package
```
Then install the `.vsix` file: in the Extensions view, open the `…` menu and choose *Install from VSIX…*, or run the following command (requires `code` in your `PATH`):
```bash
code --install-extension freest-0.0.0.vsix
```

If `freest` is not on your `PATH`, set **`freest.path`** in the extension settings to the full path of the `freest` executable.