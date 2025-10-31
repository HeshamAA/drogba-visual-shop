declare module "slugify" {
  export interface SlugifyOptions {
    replacement?: string;
    remove?: RegExp;
    lower?: boolean;
    strict?: boolean;
    locale?: string;
    trim?: boolean;
  }

  export type Slugify = (str: string, options?: SlugifyOptions) => string;

  const slugify: Slugify;
  export default slugify;
}
