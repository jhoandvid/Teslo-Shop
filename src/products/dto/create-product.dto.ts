import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, isJSON, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Detail } from '../entities';


export class CreateProductDto {


    @ApiProperty({
        description:'Product  title (unique)',
        nullable:false,
        minLength:1
    })
    @IsString()
    @MinLength(1)
    title:string;


    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?:string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;
    
    @ApiProperty()
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    sizes:string[];

    @ApiProperty()
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender:string;

    @ApiProperty()
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    tags:string[];


    @ApiProperty()
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images?:string[]

    @ApiProperty()
    @IsArray()
    @IsOptional()
    details?:Detail[]

}
