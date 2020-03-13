import CSVParser from 'csv-parser'
import { Readable } from 'stream'

import Category from '../models/Category'
import Translation from '../models/Translation'
import { Platform } from '../models/Platform'

export default class CSVToStrings {
  private categories: Category[] = []
  private csvData: string

  constructor(csvData: string) {
    this.csvData = csvData
  }

  public exec(platform: Platform, callback: (output: string) => void): void {
    Readable.from(this.csvData)
      .pipe(
        CSVParser({
          headers:
            platform === Platform.IOS ? ['Category', 'Base', 'Translation'] : ['Category', 'Base', 'FR', 'Translation'],
          skipLines: 1
        })
      )
      .on('data', (data) => this.parse(data))
      .on('end', () => this.outputStringsFile(platform, callback))
  }

  private parse(data: { Category: string; Base: string; Translation: string }): void {
    if (!('Category' in data) || !('Base' in data) || !('Translation' in data)) {
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

  private outputStringsFile(platform: Platform, callback: (output: string) => void): void {
    switch (platform) {
      case Platform.ANDROID:
        callback(`<?xml version="1.0" encoding="utf-8"?>
<resources>
${this.categories
  .map(
    ({ name, translations }) => `    <!--${name}-->
${translations.map(({ base, translation }) => `    <string name="${base}">${translation}</string>`).join('\r\n')}
`
  )
  .join('\r\n')}
</resources>
`)
        return
      case Platform.IOS:
        callback(
          this.categories
            .map(
              ({ name, translations }) => `/* ${name} */
${translations.map(({ base, translation }) => `"${base}" = "${translation}";`).join('\r\n')}`
            )
            .join('\r\n')
        )
    }
  }
}
