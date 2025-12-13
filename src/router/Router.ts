import { HTTPHandler, Params, Callback, RouteDetail } from '../utils/Type'

class Router {
  private routes: Record<string, RouteDetail> = {}
  private baseName: string = ''
  
  constructor(baseName: string = '') {
    this.baseName = baseName
  }

  private addRoute(method: string, url: string, callback: Callback) {
    let normalizedUrl = url;

    if (normalizedUrl !== '/' && !normalizedUrl.endsWith('/')) {
      normalizedUrl = normalizedUrl + '/';
    }

    const routeKey = `${method}:${normalizedUrl}`;
    let { regex, paramNames } = this.pathToRegex(normalizedUrl)

    this.routes[routeKey] = {
      callback,
      regex,
      paramNames
    };
  }

  private pathToRegex(path: string) {
    const paramNames: string[] = []
    
    const regexPath = path.replace(/:([a-zA-Z_]+)/g, (_, key) => {
      paramNames.push(key)
      return '([^/]+)'
    });
  
    let finalRegexPath = regexPath;
    if (finalRegexPath.endsWith('/') && finalRegexPath.length > 1) {
        finalRegexPath = finalRegexPath.slice(0, -1);
    }
    
    const regex = new RegExp(`^[A-Z]+:${finalRegexPath}\\/?$`)
    return { regex, paramNames }
  }

  get(url: string, callback: Callback) {
    this.addRoute('GET', url, callback)
  }

  post(url: string, callback: Callback) {
    this.addRoute('POST', url, callback)
  }

  put(url: string, callback: Callback) {
    this.addRoute('PUT', url, callback)
  }

  delete(url: string, callback: Callback) {
    this.addRoute('DELETE', url, callback)
  }

  setBaseName(baseName: string) {
    this.baseName = baseName
  }

  async requestRouter(router: string, handlers: HTTPHandler) {
    let routesList = Object.entries(this.routes)
    let sortedRoutes = this.sortRoutes(routesList)

    let selectedRouter = sortedRoutes.find(entrie => {
      let [, detail] = entrie
      return detail.regex.test(router)
    })

    if (!selectedRouter) return

    let [, routeDetail] = selectedRouter
    let matchParams = router.match(routeDetail.regex)

    if (!matchParams) return

    let params: Record<string, string | undefined> | null = {}

    routeDetail.paramNames.forEach((name, index) => {
      params[name] = matchParams[index + 1]
    })

    let { request, response } = handlers

    await routeDetail.callback(request, response, params)
  }

  private sortRoutes(routes: [string, RouteDetail][]) {
    return routes.sort(([routeA], [routeB]) => {
      const pathA = routeA.split(':')[1]!
      const pathB = routeB.split(':')[1]!
      const segmentsA = (pathA.match(/\//g) || []).length;
      const segmentsB = (pathB.match(/\//g) || []).length;
      
      return segmentsB - segmentsA;
    })
  }
}

export default Router