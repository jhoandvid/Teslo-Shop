import { Module } from '@nestjs/common';
import { ArticuloService } from './articulo.service';
import { ArticuloController } from './articulo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articulo } from './entities/articulo.entity';

@Module({
  controllers: [ArticuloController],
  providers: [ArticuloService],
  imports:[TypeOrmModule.forFeature([Articulo])]

})
export class ArticuloModule {


}
