# ${pkg.banner}

[![npm version](https://img.shields.io/npm/v/${pkg.name}.svg)](https://www.npmjs.com/package/${pkg.name})
![npm downloads](https://img.shields.io/npm/dm/${pkg.name}.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

<!-- TOC -->

## About

${pkg.description}

[Literate Programming](https://en.wikipedia.org/wiki/Literate_programming) (LP)
is a form of programming focused on creating documents of interleaved prose,
code, and supporting diagrams/illustrations, pioneered by [Donald
Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) for his TeX system. If you're
new to this approach, please first read the Wikipedia article for a basic
introduction. For all LP projects, a so-called "tangling" step is required to
produce workable, standard source code files from these documents. This package
provides just that:

Extract, expand, transclude, combine and assemble code blocks from Markdown or
[Org-mode](https://orgmode.org) files into actual/traditional source files. A
single LP source file can contain code for multiple languages. Each code block
can define its target file and include [noweb-style
references](https://orgmode.org/manual/Noweb-Reference-Syntax.html) to other
code blocks, either from the same or even from other files.

The package provides both a basic API and a CLI wrapper to perform the
"tangling" tasks (an expression borrowed from
[Org-mode](https://orgmode.org/manual/Extracting-Source-Code.html)).

(FWIW all early [thi.ng](https://thi.ng) libraries created between 2011-2016
were written in this format, e.g.
[thi.ng/fabric](https://github.com/thi-ng/fabric),
[thi.ng/geom](https://github.com/thi-ng/geom),
[thi.ng/luxor](https://github.com/thi-ng/luxor),
[thi.ng/morphogen](https://github.com/thi-ng/morphogen))

### Document front matter

LP source files can contain a front matter section, currently supporting the
following properties (all optional, also see example document further below):

#### `tangle`

Absolute or relative path to base output directory for tangled code blocks. This
is only used if a code block's `tangle` path is a relative path.

#### `pubish`

Absolute or relative path to write a "published" version of the LP source file,
in which all code blocks have been transformed & code block references
resolved/expanded/transcluded. If this property is omitted, no such output will
be generated.

### Code block metadata

In addition to the optional document front matter configuration, each code block
can specify the following metadata `key:value` pairs:

#### `id`

Unique (within the current doc) code block identifier. Only required if the
contents of this code block are to be referenced/transcluded elsewhere.

#### `noweb`

If set to `noweb:no`, any code block references in this block will **not** be
expanded. See section below for more details about these reference.

#### `publish`

If set to `publish:no`, the code block will be omitted in the published version
of the current document.

#### `tangle`

Absolute or relative path of the target file where the expanded contents of this
code block should be written to. If a relative path, it'll be relative to the
path stated in the front matter. If omitted, the code block will **not** be
extracted to its own file. If multiple code blocks in the _same_ source file are
specifying the same target file, their contents will be concatenated (in order
of appearance).

## Basic usage

The following Markdown example acts as a source file (presumably for Literate
Programming purposes) from which various interlinked code blocks will be
extracted (into any number of new files). Additionally, this file itself is also
being transformed for "publishing", meaning all code block references &
transclusions are getting resolved/replaced in the published version of this
file.

main.md:

    ---
    publish: out/main.md
    tangle: out
    ---
    # Tangle test

    This next code block will be tangled/extracted to the specified file and since
    its body entirely consists of a reference to another code block, it will be
    replaced with the contents of the code block with ID `imports` in the file
    `lib.md` (see further below)

    ```ts tangle:src/index.ts
    <<lib.md#imports>>
    ```

    Next we transclude the contents of the code block with ID `foo` and perform some
    other computation. This block (and the next one too) will be tangled to the same
    target file (concatenated):

    ```ts tangle:src/index.ts
    <<foo>>

    const bar = 42;

    console.log(foo + bar);
    ```

    Finally, here's a demonstration of how transcluded code blocks can also receive
    parameters (supplied via an options object as argument):

    ```ts tangle:src/index.ts
    <<lib.md#parametric { "hello": "world" }>>
    ```

    ## Misc

    The following block will be only transcluded in the first one, however has its
    `publish` flag disabled so that it will **not** be included in the published
    version of this file.

    ```ts id:foo publish:no
    const foo = 23;
    ```

lib.md (e.g. maybe a library of useful snippets for a larger project):

    # Library of snippets

    ```ts id:imports
    // @ts-ignore
    import type { Fn } from "@thi.ng/api";
    ```

    ```ts id:parametric
    export const hello = "Hi, {{hello}}!";
    ```

Calling the `tangle` CLI util, we can process these example files and produce
the following two outputs:

```bash
npx @thi.ng/tangle --help

#  █ █   █           │
# ██ █               │
#  █ █ █ █   █ █ █ █ │ @thi.ng/tangle 0.1.0
#  █ █ █ █ █ █ █ █ █ │ Literate programming code block tangling
#                  █ │
#                █ █ │
#
# usage: tangle [OPTS] SOURCE-FILES(S) ...
#        tangle --help
#
# Flags:
#
# -d, --debug         enable debug output
# --dry-run           enable dry run (don't overwrite files)
# --no-comments       don't generate comments
```

```bash
npx @thi.ng/tangle main.md
# [INFO] tangle: writing file: <...>/out/src/index.ts
# [INFO] tangle: writing file: <...>/out/main.md
```

#### Generated Outputs

The generated/tangled source file: `out/src/index.ts`

```ts
// Tangled @ 2022-09-21T16:57:43+02:00 - DO NOT EDIT!
// Source: <...>/main.lit.md

// @ts-ignore
import type { Fn } from "@thi.ng/api";

const foo = 23;

const bar = 42;

console.log(foo + bar);

export const hello = "Hi, world!";
```

The published version of the input markdown file: `out/main.md`

    ---
    publish: out/main.md
    tangle: out
    ---
    # Tangle test

    This next code block will be tangled/extracted to the specified file and since
    its body entirely consists of a reference to another code block, it will be
    replaced with the contents of the code block with ID `imports` in the file
    `lib.md` (see further below)

    ```ts
    // @ts-ignore
    import type { Fn } from "@thi.ng/api";
    ```

    Next we transclude the contents of the code block with ID `foo` and perform some
    other computation. This block (and the next one too) will be tangled to the same
    target file (concatenated):

    ```ts
    const foo = 23;

    const bar = 42;

    console.log(foo + bar);
    ```

    Finally, here's a demonstration of how transcluded code blocks can also receive
    parameters (supplied via an options object as argument):

    ```ts
    export const hello = "Hi, world!";
    ```

    ## Misc

    The following block will be only transcluded in the first one, however has its
    `publish` flag disabled so that it will **not** be included in the published
    version of this file.

## Editor integrations

### VSCode

Using the [Run On Save
extension](https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave),
tangling can be automatically performed on each save of an Literate Programming
source file. E.g. this configuration (add to your VSCode workspace
`settings.json`) runs the tangle command on each save of a `*.lit.md` file.

```json
"emeraldwalk.runonsave": {
	"commands": [
		{
			"match": "\\.lit\\.md$",
			"cmd": "${workspaceFolder}/node_modules/.bin/tangle ${file}"
		}
	]
}
```

Note: This also assumes you have this package (@thi.ng/tangle) added to your
dependencies...

### Other editors

Accepting PRs with instructruction for other editors & IDEs.

${status}

${supportPackages}

${relatedPackages}

${blogPosts}

## Installation

${pkg.install}

${pkg.size}

## Dependencies

${pkg.deps}

${examples}

## API

${docLink}

In addition to the CLI wrapper, the package provides the
[`tangleFile()`](https://docs.thi.ng/umbrella/tangle/modules.html#tangleFile)
and
[`tangleString()`](https://docs.thi.ng/umbrella/tangle/modules.html#tangleString)
functions. See
[/test/index.ts](https://github.com/thi-ng/umbrella/blob/develop/packages/tangle/test/index.ts)
for usage examples.

## Authors

${authors}

${pkg.cite}

## License

&copy; ${copyright} // ${license}