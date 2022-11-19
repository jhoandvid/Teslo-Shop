import { BadGatewayException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  
  //obtener metadata
  constructor( private readonly reflector:Reflector){

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

  

    const validRoles:String []=this.reflector.get(META_ROLES, context.getHandler());

    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;
    

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
