import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { Articulo } from './entities/articulo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticuloService {

  private readonly logger=new Logger('ArticuloService');

  constructor(
    @InjectRepository(Articulo)
    private readonly articuloRepository:Repository<Articulo>
  ){
  }

  async create(createArticuloDto: CreateArticuloDto) {
    
      const articulo=this.articuloRepository.create(createArticuloDto);
        try {
          await this.articuloRepository.save(articulo);
          return articulo
        } catch (error) {
            this.handlesError(error);
        }
      


  }

  async findAll() {
   

    return await this.articuloRepository.find({})
   
  }

  async findOne(id: string) {
      const articulo=await this.articuloRepository.findOneBy({id});

      if(!articulo){
        throw new NotFoundException(`El id ${id} no existe`);
      }

      return articulo;
  }

 async update(id: string, updateArticuloDto: UpdateArticuloDto) {
 
  const articulo=await this.findOne(id);

  await this.articuloRepository.update(id, updateArticuloDto);

    return {...articulo, ...updateArticuloDto }

  }

  async remove(id: string) {

    await this.findOne(id);

    this.articuloRepository.delete(id); 
  }

  private handlesError(error){

    if(error.code=="23505"){
      throw new NotFoundException(`${error.detail}`)
      
    }
    
      console.log(error);      
      throw new InternalServerErrorException(`Ocurrio algo inesperado`)


  }

}
