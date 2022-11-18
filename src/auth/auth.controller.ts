import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser, RawHeader } from './descorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';


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
    @RawHeader() rawHeaders:String[],
    


  ){

    console.log(request);

    return {
      ok:true,
      user, 
      userEmail, 
      rawHeaders
    }
  }

  @Get('private2')
  @SetMetadata('roles', ['admin','super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ){
   return {
    ok:true,
    user
  }

  }

}
