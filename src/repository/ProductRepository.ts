// const fs = require('fs/promises');
import * as fs from 'fs/promises'
import * as path from 'path'
import { randomUUID } from 'crypto'
import { ProductData } from '../utils/Type'

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
    const jsonString = await fs.readFile(this.jsonPath, 'utf8')
    return JSON.parse(jsonString) as ProductData[]
  }

  private async writeData(data: ProductData[]) {
    await fs.writeFile(this.jsonPath, JSON.stringify(data, null, 2))
  }

  async findAll() {
    await this.findOrCreateFile()
  
    try {
      return await this.readData()
    } catch (error) {
      throw error
    }
  }
  
  async findByName(name: string) {
    await this.findOrCreateFile()
    
    try {
      let data:unknown = await this.readData()
      
      let product = (data as ProductData[]).find(currentProduct => {
        return currentProduct.name === name
      })
      
      return product
    } catch (error) {
      throw error
    }
  }
  
  async findById(id: string) {
    await this.findOrCreateFile()
    
    try {
      let data:unknown = await this.readData()
      
      let product = (data as ProductData[]).find(currentProduct => {
        return currentProduct.id === id
      })
      
      return product
    } catch (error) {
      throw error
    }
  }
  
  async save(productData: Omit<ProductData, 'id'>) {
    await this.findOrCreateFile()
    
    try {
      const data = await this.readData()

      const newProduct: ProductData = {
        id: randomUUID(),
        ...productData,
      }

      data.push(newProduct)
      await this.writeData(data)

      return newProduct
    } catch (error) {
      throw error
    }
  }

  async update(id: string, updatedData: Partial<Omit<ProductData, 'id'>>) {
    await this.findOrCreateFile()

    try {
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
    } catch (error) {
      throw error
    }
  }
  
  async deleteById(id: string) {
    await this.findOrCreateFile()

    try {
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
    } catch (error) {
      throw error
    }
  }
}

export default ProductRepository