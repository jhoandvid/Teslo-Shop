import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
              private readonly configureService:ConfigService
    ) {}


  @Get('product/:imageName')
  findProductImage(
    @Res() res:Response,
    @Param('imageName') imageName){ 
    const path=this.filesService.getStaticProductImage(imageName);
    return res.sendFile(path);
    
  }


  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter:fileFilter,
    //limits:{fileSize:1000}
    storage: diskStorage({
      destination: './static/products',
      filename:fileNamer
    })
  }))

  uploadProductImage(@UploadedFile() file: Express.Multer.File){
    if(!file){
      throw new BadRequestException('Make sure that the file is an image')
    }

    //const secureUrl=`${file.filename}`
    
    const secureUrl=`${this.configureService.get('HOST_API')}/files/product/${file.filename}`
    
    return {secureUrl}
  }
}
