import { IncomingMessage, ServerResponse } from "http";
import { Params } from "../utils/Type";

class ProductController {
  async getProducts(request: IncomingMessage, response: ServerResponse, params:Params = {}) {
    console.log('Searching all products...')
    console.log(request.url)
    console.log('Controller: ', params)
  }
  
  async addProduct(request: IncomingMessage, response: ServerResponse) {
    console.log('Adding product...')
  }
  
  async updateProduct(request: IncomingMessage, response: ServerResponse) {
    console.log('Changing product...')
  }
  
  async deleteProduct(request: IncomingMessage, response: ServerResponse) {
    console.log('Deleting product...')
  }
}

export default ProductController