import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';



import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser, RawHeader } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interface';

@ApiTags('Auth')
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

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user:User
  ){
    return this.authService.checkAuthStatus(user.id)
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
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin, ValidRoles.user)
  //@SetMetadata('roles', ['admin','super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ){
   return {
    ok:true,
    user
  }

  }


  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute(
    @GetUser() user:User
  ){    
    return {
      ok:true,
      user
    }
  }

}
