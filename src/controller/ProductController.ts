import { IncomingMessage, ServerResponse } from "http";
import { Params } from "../utils/Type";
import ProductService from "../service/ProductService";
import { ProductData, HttpStatus } from "../utils/Type";

class ProductController {
  private service = new ProductService()

  async getProducts(request: IncomingMessage, response: ServerResponse, params:Params = {}) {
    
    try {
      let products: ProductData | ProductData[] | undefined = undefined
      let name = params.query?.name

      if (name && typeof name === 'string') {
        products = await this.service.getProducts(name as string, false)
      } else {
        let productId = params.path?.id
        products = await this.service.getProducts(productId as string)
      }
      
      let httpStatus = products ? HttpStatus.Ok : HttpStatus.NotFound 

      let dataResponse = {
        status: httpStatus,
        data: products ?? null,
      }

      response.writeHead(httpStatus, {'Content-Type': 'application/json'})
      response.end(JSON.stringify(dataResponse))
    } catch (error) {
      throw error
    }
  }
  
  async addProduct(request: IncomingMessage, response: ServerResponse, params:Params = {}) {
    try {
      let body = params.body
      let result: ProductData | void = await this.service.addProduct(body as Record<string, unknown>)
      
      let dataResponse = {
        status: HttpStatus.Created,
        data: result
      }
      
      response.writeHead(HttpStatus.Created, {'Content-Type': 'application/json'})
      response.end(JSON.stringify(dataResponse)) 
    } catch (error) {
      throw error
    }
  }
  
  async updateProduct(request: IncomingMessage, response: ServerResponse, params:Params) {
    try {
      let { body, path } = params
      let result: ProductData | null = null

      if (path && path.id) {
        let userId = path.id as string
        result = await this.service.updateProduct(userId, body as Record<string, unknown>)
      }

      let httpStatus = result ? HttpStatus.Created : HttpStatus.NotFound

      let dataResponse = {
        status: httpStatus,
        data: result
      }

      response.writeHead(httpStatus, {'Content-Type': 'application/json'})
      response.end(JSON.stringify(dataResponse))

      return result
    } catch (error) {
      throw error
    }
  }
  
  async deleteProduct(request: IncomingMessage, response: ServerResponse, params: Params = {}) {
    try {
      let productId = params.path?.id
      let hasDeleted = await this.service.deleteProduct(productId as string)
      let httpStatus = hasDeleted ? HttpStatus.Created : HttpStatus.NotFound

      let dataResponse = {
        status: httpStatus,
        hasProductDeleted: hasDeleted 
      }
      
      response.writeHead(httpStatus, {'Content-Type': 'application/json'})
      response.end(JSON.stringify(dataResponse))
    } catch (error) {
      throw error
    }
  }
}

export default ProductController