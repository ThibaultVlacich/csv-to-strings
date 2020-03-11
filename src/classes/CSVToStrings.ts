import CSVParser from 'csv-parser'
import { Readable } from 'stream'

import Category from '../models/Category'
import Translation from '../models/Translation'

export default class CSVToStrings {
  private categories: Category[] = []
  private csvData: string

  constructor(csvData: string) {
    this.csvData = csvData
  }

  public exec(callback: (output: string) => void): void {
    Readable.from(this.csvData)
      .pipe(
        CSVParser({
          headers: ['Category', 'Base', 'Translation'],
          skipLines: 1
        })
      )
      .on('data', (data) => this.parse(data))
      .on('end', () => this.outputStringsFile(callback))
  }

  private parse(data: {
    Category: string
    Base: string
    Translation: string
  }): void {
    if (
      !('Category' in data) ||
      !('Base' in data) ||
      !('Translation' in data)
    ) {
      // Could not parse line correctly, ignore
      return
    }

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

  private outputStringsFile(callback: (output: string) => void): void {
    let writeStream = ''

    this.categories.forEach((category) => {
      writeStream += `/* ${category.name} */\r\n`

      category.translations.forEach((translation) => {
        writeStream += `"${translation.base}" = "${translation.translation}";\r\n`
      })

      writeStream += '\r\n'
    })

    callback(writeStream)
  }
}
