import Category from '../models/Category'

export default interface Compiler {
  outputFormat: string
  compile(categories: Category[]): string
}
