import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt"
import { User } from '../entities/user.entity';
import { JwtPayload } from "../interface/jwt-payload.interface";
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
        configService:ConfigService
    
        ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),

        });
    }


    async validate(payload:JwtPayload):Promise<User>{
        
        const {uid}=payload;

        const user= await this.userRepository.findOneBy({id:uid});
        if(!user){
            throw new UnauthorizedException('Token no valid');
        }

        if(!user.isActive){
            throw new UnauthorizedException('User is incative, talk with an admin');
        }

        return user; 
    }

}