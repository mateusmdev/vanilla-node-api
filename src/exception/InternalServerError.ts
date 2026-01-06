import APIError from "./APIError"

class InternalServerError extends APIError {
  constructor(message = ``){
    super(message)
    this.name = this.constructor.name
  }
}

export default InternalServerError