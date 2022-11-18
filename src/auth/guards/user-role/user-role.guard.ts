import { BadGatewayException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  
  //obtener metadata
  constructor( private readonly reflector:Reflector){

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    console.log("USer Role Guard");

    const validRoles:String []=this.reflector.get('roles', context.getHandler());


    const req=context.switchToHttp().getRequest();
    const user=req.user as User;

    if(!user) throw new BadGatewayException("User not Found");

    for (const role of user.roles){
      if(validRoles.includes(role)){
        return true;
      }
    }

    throw new ForbiddenException (`User ${user.fullname} need valid role: [${validRoles}]`)

  }
}
