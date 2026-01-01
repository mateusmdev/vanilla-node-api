import type {IncomingMessage, ServerResponse} from 'http'

export type HTTPHandler = { request: IncomingMessage, response: ServerResponse }
export type Params = { 
  // query?: Record<string, string | undefined> | null
  query?: Record<string, unknown>
  path?: Record<string, unknown>
  body?: Record<string, unknown>
}

export type Callback = (request: IncomingMessage, response: ServerResponse, params: Params) => unknown

export type RouteDetail =  {
  callback: Callback,
  regex: RegExp,
  paramNames: string[]
}

export type ProductData = {
  id: string,
  name: string,
  price: number,
  count: number
}

export enum HttpStatus {
  Ok = 200,
  Created = 201,
  NotFound = 404,
  InternalError = 500
}