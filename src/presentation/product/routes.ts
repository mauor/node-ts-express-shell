import { ProductService } from './../services';
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProductController } from './controller';



export class ProductRoutes {

    static get routes(): Router {

        const router = Router();

        const productService = new ProductService();

        const controller = new ProductController( productService );

        // Definir las rutas
        router.get('/', controller.getProducts);
        router.get('/:id', controller.getProduct);
        router.post('/', [ AuthMiddleware.validateJWT ], controller.createProduct );
        router.put('/:id', controller.updateProduct );
        router.delete('/:id', controller.deleteProduct);

        return router;
    }

}

