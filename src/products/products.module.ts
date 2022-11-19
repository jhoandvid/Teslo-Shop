import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage, Detail } from './entities';
import { AuthModule } from '../auth/auth.module';




@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[ProductsService, TypeOrmModule],
  imports:[
    TypeOrmModule.forFeature([Product, ProductImage, Detail]),
    AuthModule
  ]
})
export class ProductsModule {}
