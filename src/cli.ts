import chalkTemplate from 'chalk-template'
import fs from 'fs'
import path from 'path'
import program from 'commander'

import CSVToStrings from './classes/CSVToStrings'
import InvalidPlatformError from './errors/InvalidPlatformError'

program
  .version(require('../package.json').version) // eslint-disable-line @typescript-eslint/no-var-requires
  .description('A simple tool converting a CSV file to a .strings file')
  .requiredOption(
    '-p, --platform <platform>',
    'Platform to generate (ios or android)'
  )
  .requiredOption('-i, --in <path>', 'Path to input CSV file')
  .option('-o, --out <path>', 'Path to output strings file')
  .parse(process.argv)

if (!fs.existsSync(program.in)) {
  console.log(
    chalkTemplate`\r\n\t{bold.red Error}: File specified with --in parameter does not exist.\r\n`
  )
  process.exit(1)
}

const platform = program.platform
const inPath = program.in

try {
  const data = fs.readFileSync(inPath, 'utf8')

  const csvToStrings = new CSVToStrings(platform, data)
  csvToStrings.exec((output, format) => {
    const outPath =
      program.out || path.join(path.dirname(inPath), `translations.${format}`)

    fs.writeFileSync(outPath, output)

    console.log(
      chalkTemplate`\r\n\t{bold.green Success}: .strings file successfully generated.\r\n` +
        `\tPath of the generated file: ${outPath}\r\n`
    )
  })
} catch (e) {
  if (e instanceof InvalidPlatformError) {
    console.log(
      chalkTemplate`\r\n\t{bold.red Error}: Unsupported platform. Accepted values: android, ios.\r\n`
    )
  } else {
    console.log(
      chalkTemplate`\r\n\t{bold.red Error}: An unknown error happened.\r\n`
    )
    console.log(e)
  }
}
