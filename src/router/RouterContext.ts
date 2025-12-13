import { HTTPHandler } from "../utils/Type";
import Router from "./Router";

class RouterContext {
  private router: Router | undefined 
  
  setStrategy(strategy: Router) {
    this.router = strategy
  }

  async execute(route:string, handlers: HTTPHandler) {
    await this.router?.requestRouter(route, handlers)
  }
}

export default RouterContext