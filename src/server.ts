import type { IncomingMessage, ServerResponse } from 'http'
import RouterContext from './router/RouterContext'
import FactoryRouter from './router/FactoryRouter'
import productRouter from './router/ProductRouter'
import Router from './router/Router'
import NotFoundError from './exception/NotFoundError'
import { HttpStatus } from './utils/Type'

class ServerAPI {
  private router = new RouterContext()

  async runApi(request: IncomingMessage, response: ServerResponse) {
    try {
      let route = `${request.method}:${request.url}`
      let selectedRouter = FactoryRouter.getRouter(route)

      if (selectedRouter) {
        this.router.setStrategy(selectedRouter)
        return await this.router.execute(route, { request, response })
      }
      
      this.defaultRoute(response, HttpStatus.NotFound)
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.defaultRoute(response, HttpStatus.NotFound)
      }
    }
  }

  addRouter(name:string, route: Router) {
    FactoryRouter.addRouter(`/${name}`, route)
  }

  private defaultRoute(response: ServerResponse, status: HttpStatus) {
    response.writeHead(status, {'Content-Type': 'application/json'})
    return response.end(JSON.stringify({
      status: status,
      message: `This route doesn't exist in the application.`
    }))
  }
}

let serverApi = new ServerAPI()

serverApi.addRouter('products', productRouter)

export default serverApi