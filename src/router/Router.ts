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
    let { regex, paramNames } = this.pathToRegex(method, normalizedUrl)

    this.routes[routeKey] = {
      callback,
      regex,
      paramNames
    };
  }

  private pathToRegex(method: string, path: string) {
    const paramNames: string[] = []
    
    const regexPath = path.replace(/:([a-zA-Z_]+)/g, (_, key) => {
      paramNames.push(key)
      return '([^/]+)'
    });
  
    let finalRegexPath = regexPath;
    if (finalRegexPath.endsWith('/') && finalRegexPath.length > 1) {
        finalRegexPath = finalRegexPath.slice(0, -1);
    }
    
    const regex = new RegExp(`^${method}:${finalRegexPath}\\/?(\\?.*)?$`)
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
    let selectedRouter = await this.selectRoute(router)

    if (!selectedRouter) return

    let [, routeDetail] = selectedRouter
    let pathParams = await this.mapParams(router, routeDetail) || {}
    let { request, response } = handlers

    let bodyData = ''
    let params: Params = {}

    params.path = pathParams
    params.query = Object.fromEntries(new URL(router).searchParams);
    
    request.on('data', (data: Buffer) => {
      bodyData += data.toString()
    })

    request.on('end', () => {
      if (bodyData.trim() === ``){
        bodyData = `{}`
      }
        
      params.body = JSON.parse(bodyData)
      routeDetail.callback(request, response, params)
    })
  }

  private async selectRoute(router: string) {
    let routesList = Object.entries(this.routes)
    let sortedRoutes = this.sortRoutes(routesList)

    let selectedRouter = sortedRoutes.find(entrie => {
      let [, detail] = entrie
      return detail.regex.test(router)
    })

    return selectedRouter
  }

  private async mapParams(router: string, routeDetail: RouteDetail) {
    let matchParams = router.match(routeDetail.regex)

    if (!matchParams) return

    // let params: Record<string, string | undefined> | null = {}
    let params: Record<string, unknown> = {}

    routeDetail.paramNames.forEach((name, index) => {
      // params[name] = matchParams[index + 1]

      params[name] = matchParams[index + 1]
    })

    return params
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