import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';


import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interface';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

 @Get()
 //@Auth(ValidRoles.admin)
 executeSeed(){
    return this.seedService.runSeed();
 }
}
