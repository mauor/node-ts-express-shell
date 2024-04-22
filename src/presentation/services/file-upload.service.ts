import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { Uuid } from "../../config";
import { CustomError } from "../../domain";

export class FileUploadService{
    
    constructor(
        private readonly uuid = Uuid.v4
    ){}

    private checkFolder( folderPath: string){
        if( !fs.existsSync( folderPath ) ){
            fs.mkdirSync( folderPath );
        }
    }

    async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtensions: string[] = ['jpg', 'jpeg', 'png'],
    ){
        try{
            
            const extension = file.mimetype.split('/').at( 1 ) ?? '';
            const destination = path.resolve( __dirname, '../../../', folder );
            const fileName = `${ this.uuid() }.${ extension }`;
            
            if( !validExtensions.includes( extension )){
                throw CustomError.badRequest(`Inavlid extension: ${extension}, valid ones: ${ validExtensions }`)
            }

            this.checkFolder( destination );

            file.mv(`${destination}/${fileName}`);
            return { fileName };
        }
        catch( error ){
            console.log( error );
            throw error;
        }
    }

    async uploadMultiple(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtensions: string[] = ['jpg', 'jpeg', 'png'],
    ){
        const fileNames = await Promise.all([
            files.map( file => this.uploadSingle( file, folder, validExtensions) )
        ]);
        return fileNames;
    }

}