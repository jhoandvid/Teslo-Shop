import { IsInt, IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreateArticuloDto {

    @IsString()
    @MinLength(1)
    nombre:string;

    @IsPositive()
    @IsNumber()
    precio:number;


    @IsPositive()
    @IsNumber()
    iva:number;

    @IsString()
    @MinLength(1)
    description:string;

}
