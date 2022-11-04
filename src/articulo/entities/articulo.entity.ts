import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Articulo {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique:true
    })
    nombre:string;
    
    @Column('float',{
        default:0
    })
    precio:number;

    @Column('float',)
    iva:number;

    @Column('text')
    description:string;
    
}
