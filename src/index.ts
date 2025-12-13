import * as http from 'node:http'
import RouterContext from './router/RouterContext'
import FactoryRouter from './router/FactoryRouter'

import productRouter from './router/ProductRouter'

let router = new RouterContext()

FactoryRouter.addRouter('/products', productRouter)

let server = http.createServer(async (request, response) => {
  response.writeHead(200, {'Content-Type': 'application/json'})

  let route = `${request.method}:${request.url}`
  let selectedRouter = FactoryRouter.getRouter(route)

  if (selectedRouter) {
    router.setStrategy(selectedRouter)
    await router.execute(route, { request, response })
  }

  response.end()
})

const PORT = 3000
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`))

