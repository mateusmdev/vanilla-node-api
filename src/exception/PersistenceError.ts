import InternalServerError from "./InternalServerError"

class PersistenceError extends InternalServerError {
  constructor(message = ``){
    super(message)
    this.name = this.constructor.name
  }
}

export default PersistenceError