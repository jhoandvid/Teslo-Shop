import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

import { GetUser, RawHeader } from './descorators';
import { User } from './entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto){
    return this.authService.login (loginUserDto)
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    
    @Req() request:Express.Request,
    //Dcustom decorator data req
    @GetUser() user:User,
    @GetUser('email') userEmail:string,
    @RawHeader() rawHeaders:String[]


  ){

    console.log(request);

    return {
      ok:true,
      user, 
      userEmail, 
      rawHeaders
    }
  }

}
