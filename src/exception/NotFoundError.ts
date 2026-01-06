import APIError from "./APIError"

class NotFoundError extends APIError {
  constructor(message = `Route not found.`){
    super(message)
    this.name = this.constructor.name
  }
}

export default NotFoundError