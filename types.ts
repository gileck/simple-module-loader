export interface UI {
  Write(text: string): void
}

export interface BI {
  log(text: string): void
}

export interface Platform {
  doWork(): any
}

export type PlatformHandlers = any
export type RouterHandlers = any

export interface Feature {
  doWork(): any
}

export interface Router {

}

