import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

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

    console.log({validRoles});

    return true;
  }
}
