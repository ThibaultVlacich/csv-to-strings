import CSVParser from 'csv-parser'
import { Readable } from 'stream'

import Category from '../models/Category'
import Translation from '../models/Translation'

import Compiler from '../models/Compiler'
import AndroidCompiler from '../compilers/AndroidCompiler'
import IOSCompiler from '../compilers/IOSCompiler'

import InvalidPlatformError from '../errors/InvalidPlatformError'

export default class CSVToStrings {
  private categories: Category[] = []
  private csvData: string
  private compiler: Compiler

  constructor(platform: string, csvData: string) {
    this.csvData = csvData

    switch (platform) {
      case 'android':
        this.compiler = new AndroidCompiler()
        break

      case 'ios':
        this.compiler = new IOSCompiler()
        break

      default:
        throw new InvalidPlatformError()
    }
  }

  public exec(callback: (output: string, format: string) => void): void {
    Readable.from(this.csvData)
      .pipe(
        CSVParser({
          headers: ['Category', 'Base', 'Translation'],
          skipLines: 1,
        })
      )
      .on('data', (data) => this.parse(data))
      .on('end', () => this.outputFile(callback))
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
        translations: [],
      }

      this.categories.push(category)

      categoryIndex = this.categories.length - 1
    }

    const translation: Translation = {
      base: data.Base,
      translation: data.Translation,
    }

    this.categories[categoryIndex].translations.push(translation)
  }

  private outputFile(callback: (output: string, format: string) => void): void {
    callback(this.compiler.compile(this.categories), this.compiler.outputFormat)
  }
}
