import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from './product.entity';

@Entity({name:'products_images'})
export class ProductImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string

    @ManyToOne(
        ()=>Product,
        (product)=>product.images,
        //si se borra  el producto tambien se eliminan las imagenes
        {onDelete:'CASCADE'}
    )
    product:Product

   


}