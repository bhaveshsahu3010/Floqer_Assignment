declare module 'papaparse' {
    export type ParseResult<T> = {
      data: T[];
      errors: any[];
      meta: {
        delimiter: string;
        linebreak: string;
        aborted: boolean;
        truncated: boolean;
        cursor: number;
      };
    };
  
    export type ParseConfig<T> = {
      delimiter?: string;
      newline?: string;
      quoteChar?: string;
      escapeChar?: string;
      header?: boolean;
      transformHeader?: (header: string) => string;
      dynamicTyping?: boolean | { [header: string]: boolean };
      preview?: number;
      encoding?: string;
      worker?: boolean;
      comments?: string | boolean;
      step?: (results: ParseResult<T>, parser: any) => void;
      complete?: (results: ParseResult<T>, file?: File) => void;
      error?: (error: any, file?: File) => void;
      download?: boolean;
      skipEmptyLines?: boolean | 'greedy';
      chunk?: (results: ParseResult<T>, parser: any) => void;
      fastMode?: boolean;
      beforeFirstChunk?: (chunk: string) => string | void;
      withCredentials?: boolean;
    };
  
    export function parse<T>(input: string | File, config?: ParseConfig<T>): ParseResult<T>;
  }
  