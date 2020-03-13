import Category from '../models/Category'
import Compiler from '../models/Compiler'

export default class AndroidCompiler implements Compiler {
  outputFormat = 'xml'

  compile(categories: Category[]): string {
    return (
      '<?xml version="1.0" encoding="utf-8"?>\r\n' +
      '<resources>\r\n' +
      categories
        .map(
          ({ name, translations }) =>
            `    <!--${name}-->\r\n` +
            translations
              .map(
                ({ base, translation }) =>
                  `    <string name="${base}">${translation}</string>`
              )
              .join('\r\n')
        )
        .join('\r\n\r\n') +
      '\r\n</resources>\r\n'
    )
  }
}
