import APIError from "./APIError"

class ValidationError extends APIError {
  public details: string[]

  constructor(message = ``, details: string[] = []){
    super(message)
    this.name = this.constructor.name
    this.details = details
  }
}

export default ValidationError