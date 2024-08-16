# Font Subset Creator Util

## How it Works

### Unicode Ranges

Uses precise Unicode ranges for latin, accents, and punctuation according to CSS specifications:

- latin: U+0020-007F covers all Latin letters and basic symbols.
- accents: U+00C0-00FF includes accents and diacritical marks.
- punctuation: Specifies exact ranges for punctuation and special characters.

### Creating Subsets

`fontkit` uses the `includeUnicodeRange` method to create subsets based on the given Unicode ranges.

### Generating simple CSS

The CSS file includes precise Unicode ranges corresponding to the created subsets for each file. After you need to change family name and params to better usage, but base structure created for help.

## Running the Script

Run the script:

```sh
node index.js --input=path/to/fonts --output=path/to/output
```

This script will create font subsets with accurate ranges and generate CSS for linking them, ensuring maximum precision and compatibility.

if you put fonts in `input` folder, and ready to get files from `output` folder, then you do not need params.

```sh
node index.js
```

## How you can check files

I found online tool, than can check the output file

- [https://fontsee.com/](fontsee)

I think this is enough, for now.
