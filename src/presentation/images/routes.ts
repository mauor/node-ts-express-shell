import { Router } from "express";
import { ImageController } from "./controller";




export class ImageRoutes {

    static get routes(): Router {

        const router = Router();

        // const fileService = new FileUploadService();
        const controller = new ImageController()
        //Middlewares
       

        // Definir las rutas
        router.get('/:type/:img', controller.getImage );

        return router;
    }

}

