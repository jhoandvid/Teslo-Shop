import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

import {validate as isUUID} from 'uuid'
import { ProductImage, Detail } from './entities';





@Injectable()
export class ProductsService {

  private readonly logger=new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository:Repository<ProductImage>,

    @InjectRepository(Detail)
    private readonly detailRepository:Repository<Detail>,

    private readonly dataSource:DataSource,

  ){
    
  

  }

  async create(createProductDto: CreateProductDto) {
    
    try {

      const {images=[], details=[],...productDetails}=createProductDto;

      console.log({...images})
      const product=this.productRepository.create({
        ...productDetails, 
        images:images.map(image=>this.productImageRepository.create({url:image})),
        details:details.map(details=>this.detailRepository.create({...details}))
      
      });    

      await this.productRepository.save(product);
      return {...product, images,details}


    } catch (error) {
      this.handleDBException(error);
      
    }
  }

  async findAll(paginationDto:PaginationDto) {

      const {limit=10, offset=0}=paginationDto;

      const products=await this.productRepository.find({
        take:limit,
        skip:offset,
        relations:{
          images: true,
          details:true
        }

        
      })
      return products.map(product=>({
          ...product,
          images:product.images.map(image=>image.url),
          details:product.details.map(detail=>({
            ...detail
          }))

      }));
  }

  async findOne(term: string) {

    let product:Product;

    if(isUUID(term)){
        product=await this.productRepository.findOneBy({id:term})
    }else{
        const queryBuilder=this.productRepository.createQueryBuilder('prod');
        product=await queryBuilder
        .where(`UPPER(title)=:title or slug=:slug`, {
          title: term.toUpperCase(),
          slug:term.toLocaleLowerCase()
        })
        .leftJoinAndSelect('prod.images','prod.details')
        .getOne();
    }



    //const product= await this.productRepository.findOneBy({id:term});

  



    if(!product){throw new NotFoundException(`Pokemon with id "${term}" no found`);} 

    return product;
  }

  async findOnePlain(term:string){
    const {images=[],details=[], ...rest}=await this.findOne(term);
    return {
        ...rest,
        images:images.map(image=>image.url),
        details:details.map(detail=>({
          ...detail
        }))
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

      const {images, details, ...toUpdate}=updateProductDto

      const product=await this.productRepository.preload({id, ...toUpdate,})

      if(!product) throw new NotFoundException(`Product with id: ${ id } not found`);
      

      //Create query runner
      const queryRunner=this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {

        if(images){
          await queryRunner.manager.delete(ProductImage, { product:{id} })
          product.images=images.map(image=>this.productImageRepository.create({url:image}))
        }

        if(details){
            await queryRunner.manager.delete(Detail, {product:id})
            product.details=details.map(detail=>this.detailRepository.create({...detail}))
          }

          await queryRunner.manager.save(product);
          await queryRunner.commitTransaction();
          await queryRunner.release();

          return this.findOnePlain(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBException(error)
    }


  }

  async remove(id: string) {

    const product=await this.findOne(id);
    await this.productRepository.remove(product)


  }




  private handleDBException(error){
    if(error.code==="23505"){
      throw new BadRequestException(error.detail)
     }

     console.log(error);
      this.logger.error(error);
       throw new InternalServerErrorException(`Unexpected error, check server logs`)
  
  }

  async deleteAllProducts(){
    const query=this.productRepository.createQueryBuilder('product');

    try {

      return await query.delete().where({}).execute()

    } catch (error) {
        this.handleDBException(error)
    }
  }

}



