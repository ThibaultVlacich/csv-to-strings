![Build](https://github.com/ThibaultVlacich/csv-to-strings/workflows/Build/badge.svg) [![npm](https://badgen.net/npm/v/csv-to-strings)](https://www.npmjs.com/package/csv-to-strings) [![GitHub stars](https://badgen.net/github/stars/ThibaultVlacich/csv-to-strings)](https://github.com/ThibaultVlacich/csv-to-strings/stargazers) [![License](https://badgen.net/npm/license/csv-to-strings)](LICENSE)

# CSV to Strings (and XML)

This simple tool written with TypeScript converts a CSV file of the following format:

```csv
category,base,translation
Category 1,Hello,Bonjour
Category 2,Settings,Réglages
Category 1,Thanks,Merci
```

Into an Xcode `.strings` localization file of the following format:
```strings
/* Category 1 */
"Hello" = "Bonjour";
"Thanks" = "Merci";

/* Category 2 */
"Settings" = "Réglages";
```

Or into an `.xml` file for Android:
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!--Category 1-->
    <string name="Hello">Bonjour</string>
    <string name="Thanks">Merci</string>

    <!--Category 2-->
    <string name="Settings">Réglages</string>
</resources>
```

## Install
```
yarn global add csv-to-strings

OR

npm install --global csv-to-strings
```

Then, run the tool
```
csv-to-strings --platform <ios or android> --in <path to csv file> (--out <path to strings file>)
```

The `--in` parameter is required, while `--out` is not and defaults to `<path of in file>/translations.strings`
