import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { title } from 'process';
import { throwError, skip } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

import {validate as isUUID} from 'uuid'

@Injectable()
export class ProductsService {

  private readonly logger=new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>

  ){
    
  

  }

  async create(createProductDto: CreateProductDto) {
    
    try {

      const product=this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product


    } catch (error) {
      this.handleDBException(error);
      
    }
  }

  async findAll(paginationDto:PaginationDto) {

      const {limit=10, offset=0}=paginationDto;

      const [products, total]=await this.productRepository.findAndCount({
        take:limit,
        skip:offset

        //relaciones
      })
      return {products, total};
  }

  async findOne(term: string) {

    let product:Product;

    if(isUUID(term)){
        product=await this.productRepository.findOneBy({id:term})
    }else{
        const queryBuilder=this.productRepository.createQueryBuilder();
        product=await queryBuilder
        .where(`UPPER(title)=:title or slug=:slug`, {
          title: term.toUpperCase(),
          slug:term.toLocaleLowerCase()
        }).getOne();
    }



    //const product= await this.productRepository.findOneBy({id:term});

  



    if(!product){throw new NotFoundException(`Pokemon with id "${term}" no found`);} 

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {


   // const product=await this.findOne(id);

      
    /*   await this.productRepository.update(id, updateProductDto); 
  
      return {...product, ...updateProductDto  } */

      const product=await this.productRepository.preload({
        id:id,
        ...updateProductDto
      })

      if(!product) throw new NotFoundException(`Product with id: ${ id } not found`);
      
      try {
      await this.productRepository.save(product)

      return product

    } catch (error) {
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



    this.logger.error(error);
     throw new InternalServerErrorException(`Unexpected error, check server logs`)
    

  }

}



