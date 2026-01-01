import Router from "./Router";
import ProductController from "../controller/ProductController";

let controller = new ProductController()

let router = new Router()

router.get('/products/', controller.getProducts.bind(controller))
router.get('/products/:id/', controller.getProducts.bind(controller))
router.post('/products/add/', controller.addProduct.bind(controller))
router.put('/products/:id/', controller.updateProduct.bind(controller))
router.delete('/products/:id/', controller.deleteProduct.bind(controller))

export default router