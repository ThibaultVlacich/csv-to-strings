# CSV to Strings

This simple tool written with TypeScript converts a CSV file of the following format:

```csv
category,base,translation
Category 1,Hello,Bonjour
Category 2,Settings,Réglages
Category 1,Thanks,Merci
```

Into a `.strings` file of the following format:

```strings
/* Category 1 */
"Hello" = "Bonjour";
"Thanks = "Merci";

/* Category 2 */
"Settings" = "Réglages";
```

## Build

To build the tool, simply install the required dependencies then build the source code

```
yarn
yarn build
```

## Run

Then, run the tool

```
bin/csv-to-strings --in <path to csv file> (--out <path to strings file>)
```

The `--in` parameter is required, while `--out` is not and defaults to `./out/translations.strings`
