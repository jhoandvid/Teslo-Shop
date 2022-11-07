import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage, Detail } from './entities';




@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[ProductsService, TypeOrmModule],
  imports:[
    TypeOrmModule.forFeature([Product, ProductImage, Detail]),
   
  ]
})
export class ProductsModule {}
