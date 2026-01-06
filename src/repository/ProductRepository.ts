import * as fs from 'fs/promises'
import * as path from 'path'
import { randomUUID } from 'crypto'
import { ProductData } from '../utils/Type'
import PersistenceError from '../exception/PersistenceError'

class ProductRepository {
  private jsonPath = path.join(__dirname, './../db/db.json')

  private async findOrCreateFile() {
    
    try {
      await fs.access(this.jsonPath);
    } catch { 
      await fs.mkdir(path.dirname(this.jsonPath), { recursive: true })
      await fs.writeFile(this.jsonPath, '[]')
    }
  }
  
  private async readData(): Promise<ProductData[]> {
    try {
      const jsonString = await fs.readFile(this.jsonPath, 'utf8')
      return JSON.parse(jsonString) as ProductData[]
    } catch (error) {
      throw new PersistenceError('Could not read from the persistence storage.')
    }
  }

  private async writeData(data: ProductData[]) {
    try {
      await fs.writeFile(this.jsonPath, JSON.stringify(data, null, 2))
    } catch (error) {
      throw new PersistenceError('Failed to write data to the persistence layer.')
    }
  }

  async findAll() {
    await this.findOrCreateFile()
    return await this.readData()
  }
  
  async findByName(name: string) {
    await this.findOrCreateFile()
    
    let data:unknown = await this.readData()
    let product = (data as ProductData[]).find(currentProduct => {
      return currentProduct.name === name
    })
    
    return product
  }
  
  async findById(id: string) {
    await this.findOrCreateFile()
    
    let data:unknown = await this.readData() 
    let product = (data as ProductData[]).find(currentProduct => {
      return currentProduct.id === id
    })
    
    return product
  }
  
  async save(productData: Omit<ProductData, 'id'>) {
    await this.findOrCreateFile()
    
    const data = await this.readData()
    const newProduct: ProductData = {
      id: randomUUID(),
      ...productData,
    }

    data.push(newProduct)
    await this.writeData(data)

    return newProduct
  }

  async update(id: string, updatedData: Partial<Omit<ProductData, 'id'>>) {
    await this.findOrCreateFile()

    const data = await this.readData()
    const existingProduct = data.find(product => product.id === id)

    if (!existingProduct) return null

    const updatedProduct: ProductData = {
      id,
      name: updatedData.name ?? existingProduct.name,
      price: updatedData.price ?? existingProduct.price,
      count: updatedData.count ?? existingProduct.count,
    }

    let updatedDataBase = data.map(currentItem => {
      if (currentItem.id === updatedProduct.id) {
        return updatedProduct
      }

      return currentItem
    })

    await this.writeData(updatedDataBase)

      return updatedProduct
  }
  
  async deleteById(id: string) {
    await this.findOrCreateFile()
    
    const data = await this.readData()
    let productIndex = data.findIndex(product => {
      return product.id === id
    })

    if (productIndex !== -1) {
      data.splice(productIndex, 1)
      await this.writeData(data)
      
      return true
    }

    return false
  }
}

export default ProductRepository