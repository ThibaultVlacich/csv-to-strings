import Category from '../models/Category'
import Compiler from '../models/Compiler'

export default class IOSCompiler implements Compiler {
  outputFormat = 'strings'

  compile(categories: Category[]): string {
    return categories
      .map(
        ({ name, translations }) =>
          `/* ${name} */\r\n` +
          translations
            .map(({ base, translation }) => `"${base}" = "${translation}";`)
            .join('\r\n')
      )
      .join('\r\n\r\n')
  }
}
