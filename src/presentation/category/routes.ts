import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services';



export class CategoryRoutes {

    static get routes(): Router {

        const router = Router();

        const categoryService = new CategoryService();
    
        const controller = new CategoryController( categoryService );

        // Definir las rutas
        router.get('/', controller.getCategories );
        router.get('/:id', controller.getCategory );
        router.post('/', [ AuthMiddleware.validateJWT ], controller.createCategory );
        router.put('/:id', controller.updateCategory );
        router.delete('/:id', controller.deleteCategory );

        return router;
    }

}

