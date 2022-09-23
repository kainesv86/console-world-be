import { Injectable } from '@nestjs/common';
import { storage } from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FirebaseService {
    constructor() {}

    async addFile(file: Express.Multer.File):Promise<string> {
        const {originalname} = file;
        const filename = uuidv4();
        const newFilename = `${filename}.${this.getFileExtension(originalname)}`;
        const fileRef = await storage().bucket().file(newFilename);

        // await fileRef.createWriteStream({contentType: file.mimetype}).end(file.buffer);
        return newFilename;
    }

    getFileExtension(filename) {
        return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
    }

    async getFileUrl(filename:string) {
        const fileRef = await storage().bucket().file(filename);
        fileRef.getSignedUrl({action:"read",expires:"03-09-2023"}).then(async (signedUrls) => {
            return signedUrls[0];
        });
       
    }

     
    
}
