class APIError extends Error {
  constructor(message = `An API error occurred.`){
    super(message)
    this.name = this.constructor.name
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default APIError