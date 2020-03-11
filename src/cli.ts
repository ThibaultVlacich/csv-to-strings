import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import program from 'commander'

import CSVToStrings from './classes/CSVToStrings'

program
  .version(require('../package.json').version)
  .description('A simple tool converting a CSV file to a .strings file')
  .requiredOption('-i, --in <path>', 'Path to input CSV file')
  .option('-o, --out <path>', 'Path to output strings file')
  .parse(process.argv)

if (!fs.existsSync(program.in)) {
  console.log(
    chalk`
      {bold.red Error}: File specified with --in parameter does not exist.
    `
  )
  process.exit(1)
}

const inPath = program.in
const outPath =
  program.out || path.join(path.dirname(inPath), 'translations.strings')

try {
  const data = fs.readFileSync(inPath, 'utf8')

  const csvToStrings = new CSVToStrings(data)
  csvToStrings.exec((output) => {
    fs.writeFileSync(outPath, output)

    console.log(
      chalk`
        {bold.green Success}: .strings file successfully generated.
        Path of the generated file: ${outPath}
      `
    )
  })
} catch (e) {
  console.log(e)
}
