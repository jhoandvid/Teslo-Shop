import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SeedService {

  constructor(private readonly productService:ProductsService, 
    
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,

    
    ){

  }

  async runSeed(){

    await this.deleteTable();
    const adminUser=await this.insertUsert()
    await this.insertNewProducts(adminUser)
    return 'Seed executed'
  
  }

  private async deleteTable(){

    await this.productService.deleteAllProducts();
    
    const queryBuilder=this.userRepository.createQueryBuilder();

    await queryBuilder.delete().where({}).execute();

  }

  private async insertUsert(){
    const seedUsers=initialData.users;

    

    const users:User[]=[];

  

    seedUsers.forEach(({password,...user})=>{
    
      const userDb=({password:bcrypt.hashSync(password,10), ...user})
      
     users.push(this.userRepository.create(userDb));
 
    })

  

   
  
   const dbUsers= await this.userRepository.save(users);

    return dbUsers[0]


  }

  private async insertNewProducts(user:User){
    this.productService.deleteAllProducts();


    const products=initialData.products;

    const insertPromise=[];

    products.forEach(product=>{

      insertPromise.push(this.productService.create(product, user));

  
    }) 

    await Promise.all(insertPromise);

    return true;
    
  }

}
