import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        database:process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        autoLoadEntities:true,
      
        //No se usa en producción
        synchronize:true
    }),

   
    ServeStaticModule.forRoot({
      rootPath:join(__dirname, '..', 'public'),
    }),

    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
   
  ],
})
export class AppModule {

  constructor(private readonly configService:ConfigService){
  
  }

}
