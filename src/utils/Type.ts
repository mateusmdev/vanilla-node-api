import type {IncomingMessage, ServerResponse} from 'http'

export type HTTPHandler = { request: IncomingMessage, response: ServerResponse }
export type Params = { 
  queryParams?: Record<string, string | undefined> | null
}

export type Callback = (request: IncomingMessage, response: ServerResponse, params: Params) => unknown

export type RouteDetail =  {
  callback: Callback,
  regex: RegExp,
  paramNames: string[]
}