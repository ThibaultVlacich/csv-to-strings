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

## Install
```
yarn global add csv-to-strings

OR

npm install --global csv-to-strings
```

Then, run the tool
```
csv-to-strings --in <path to csv file> (--out <path to strings file>)
```

The `--in` parameter is required, while `--out` is not and defaults to `./out/translations.strings`
