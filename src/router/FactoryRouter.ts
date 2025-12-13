import Router from "./Router"

class FactoryRouter {
  private static routers: Record<string, Router> = {} 

  static getRouter(router: string) {
    let regex = /^[A-Z]+:(\/[^\/]*)/ 
    let [, baseName]  = router.match(regex)!

    if (baseName) {
      let routers = Object.entries(FactoryRouter.routers)

      let result = routers.find(entrie => {
        let [key] = entrie

        return baseName.startsWith(key)
      })

      if (result) {
        let [, selectedRouter] = result
        return selectedRouter
      }

    }
  }

  static addRouter(baseName:string, router: Router) {
    router.setBaseName(baseName)
    this.routers[baseName] = router
  }
}

export default FactoryRouter