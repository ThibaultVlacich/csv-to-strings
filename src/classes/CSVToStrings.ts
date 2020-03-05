import program from 'commander'
import CSVParser from 'csv-parser'
import fs from 'fs'
import Category from '../models/Category'
import Translation from '../models/Translation'

export default class CSVToStrings {
  private categories: Category[] = []

  constructor() {
    program
      .version('1.0.0')
      .description('A simple tool converting a CSV file to a .strings file')
      .requiredOption('-i, --in <path>', 'Path to input CSV file')
      .option('-o, --out <path>', 'Path to output strings file')
      .parse(process.argv)
  }

  public exec(): void {
    fs.createReadStream(program.in)
      .pipe(
        CSVParser({
          headers: ['Category', 'Base', 'Translation'],
          skipLines: 1
        })
      )
      .on('data', (data) => this.parse(data))
      .on('end', () => this.outputStringsFile())
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
    const outFile = program.out || './out/translations.strings'
    const writeStream = fs.createWriteStream(outFile)

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
