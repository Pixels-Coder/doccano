export class LabelItem {
  constructor(
    readonly id: number,
    readonly text: string,
    readonly description: string | null,
    readonly prefixKey: string | null,
    readonly suffixKey: string | null,
    readonly backgroundColor: string,
    readonly textColor: string = '#ffffff'
  ) {}

  static create(
    text: string,
    description: string | null,
    prefixKey: string | null,
    suffixKey: string | null,
    backgroundColor: string
  ): LabelItem {
    return new LabelItem(0, text, description, prefixKey, suffixKey, backgroundColor)
  }
}
