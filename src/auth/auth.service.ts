import { Injectable, BadRequestException, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private logger=new Logger();

  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private readonly jwtService:JwtService
  ){

  }


  async create(createUserDto: CreateUserDto) {

    
    
    try {

      const {password, ...userData}=createUserDto;

      const user=this.userRepository.create({
        ...userData,
        //encriptar contraseña
        password: bcrypt.hashSync(password, 10)
      });
    
      await this.userRepository.save(user);
      delete user.password
      return {...user, token:this.getJwtToken({email:user.email})};
  
    } catch (err) {
      this.handleDBException(err)
    }
   
    
    

  }


  async login(loginUserDto:LoginUserDto){

      const {email, password}=loginUserDto;

     const user = await this.userRepository.findOne({
      where: {email},
      select :{email:true, password:true}
     });

     if(!user) throw new UnauthorizedException('Credentials are not valid (email)')

     if(!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credentials are not valid (password)')
   
        
      return {...user, token:this.getJwtToken({email:user.email})};
  }

  private getJwtToken(payload:JwtPayload){
       const token=this.jwtService.sign(payload);
        return token;
  } 

  
  handleDBException(error:any):never{

    if(error.code==="23505"){
      throw new BadRequestException(`${error.detail}`)
    }

    console.log(error)
    this.logger.error(error);
    throw new InternalServerErrorException(`Unexpected error, check server logs`)
  }
}
