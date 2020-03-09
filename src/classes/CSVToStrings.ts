import chalk from 'chalk'
import program from 'commander'
import CSVParser from 'csv-parser'
import path from 'path'
import fs from 'fs'
import Category from '../models/Category'
import Translation from '../models/Translation'

export default class CSVToStrings {
  private categories: Category[] = []
  private inPath: string
  private outPath: string

  constructor() {
    program
      .version('1.0.0')
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

    this.inPath = program.in
    this.outPath =
      program.out ||
      path.join(path.dirname(this.inPath), 'translations.strings')
  }

  public exec(): void {
    fs.createReadStream(this.inPath)
      .pipe(
        CSVParser({
          headers: ['Category', 'Base', 'Translation'],
          skipLines: 1
        })
      )
      .on('data', (data) => this.parse(data))
      .on('end', () => this.outputStringsFile())

    console.log(
      chalk`
        {bold.green Success}: .strings file successfully generated.
        Path of the generated file: ${this.outPath}
      `
    )
  }

  private parse(data: {
    Category: string
    Base: string
    Translation: string
  }): void {
    let categoryIndex = this.categories.findIndex((category) => {
      return category.name === data.Category
    })

    if (categoryIndex === -1) {
      const category: Category = {
        name: data.Category,
        translations: []
      }

      this.categories.push(category)

      categoryIndex = this.categories.length - 1
    }

    const translation: Translation = {
      base: data.Base,
      translation: data.Translation
    }

    this.categories[categoryIndex].translations.push(translation)
  }

  private outputStringsFile(): void {
    const writeStream = fs.createWriteStream(this.outPath)

    this.categories.forEach((category) => {
      writeStream.write(`/* ${category.name} */\r\n`)

      category.translations.forEach((translation) => {
        writeStream.write(
          `"${translation.base}" = "${translation.translation}";\r\n`
        )
      })

      writeStream.write('\r\n')
    })

    writeStream.end()
  }
}
