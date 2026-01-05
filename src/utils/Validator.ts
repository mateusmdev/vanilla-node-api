import { ProductData } from "./Type"

type FieldType = 'string' | 'number' | 'boolean'

type FieldSchema = {
  type?: FieldType
  required?: string     
}

export type SchemaValidation<T> = {
  [K in keyof T]? : FieldSchema & ({ type: FieldType } | { required: string })
}

export const schemaProduct: SchemaValidation<ProductData> = {
  id: {
    type: 'string',
    required: `The 'id' field is required to execute the operation.`
  },
  
  name: {
    required: `The 'name' field is required to execute the operation.`
  },
  
  price: {
    type: 'number',
    required: `The 'price' field is required to execute the operation.`
  },
  
  count: {
    type: 'number',
    required: `The 'count' field is required to execute the operation.`
  }
};

class Validator<T> {

  private errors: string[] = []

  getErrors() {
    return this.errors
  }

  validate(schema: SchemaValidation<T>, data: Record<keyof T, unknown>) {
    if (this.errors.length > 0) {
      this.errors = [] 
    }

    (Object.keys(schema) as Array<keyof T>).forEach(name => {
      let schemaAttribute = schema[name]
      let value = data[name]

      if (schemaAttribute?.required && (value === undefined || value === '')) {
        this.errors.push(schemaAttribute.required)
      }
      
      
      if (schemaAttribute?.type && value !== undefined) {
        const actualType = typeof value
        
        if (actualType !== schemaAttribute.type) {
          let errorMessage = `The expected data type is a '${schemaAttribute?.type}'`
          this.errors.push(errorMessage)
        }
      }
    })

    if (this.errors.length > 0) throw Error(this.errors.join('\n'))
  }
}

export default Validator