import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticuloService } from './articulo.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';

@Controller('articulo')
export class ArticuloController {
  constructor(private readonly articuloService: ArticuloService) {}

  @Post()
  create(@Body() createArticuloDto: CreateArticuloDto) {
    return this.articuloService.create(createArticuloDto);
  }

  @Get()
  findAll() {
    return this.articuloService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articuloService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticuloDto: UpdateArticuloDto) {
    return this.articuloService.update(id, updateArticuloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articuloService.remove(id);
  }
}
