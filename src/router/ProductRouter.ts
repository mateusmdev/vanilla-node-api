import Router from "./Router";
import ProductController from "../controller/ProductController";

let controller = new ProductController()

let router = new Router()

router.get('/products', controller.getProducts)
router.get('/products/:id', controller.getProducts)
router.get('/products/:id/name/:name', controller.getProducts)
router.get('/products/:id/name/', controller.getProducts)

export default router