import { Params, ProductData } from "../utils/Type"
import ProductRepository from "../repository/ProductRepository"

class ProductService {
  private repository = new ProductRepository()

  async getProducts(identifier?: string, isId=true) {
    
    if (identifier && isId === true) {
      return await this.repository.findById(identifier)
    }
    
    if (identifier) {
      return await this.repository.findByName(identifier)
    }

    return await this.repository.findAll()
  }
  
  async addProduct(body:Record<string, unknown>) {
    let bodyData = body as ProductData
    return await this.repository.save(bodyData)
  }
  
  async updateProduct(id: string, body: Record<string, unknown>) {
    let bodyData = body as ProductData
    return await this.repository.update(id, bodyData)
  }
  
  async deleteProduct(id: string) {
    return await this.repository.deleteById(id)
  }
}

export default ProductService