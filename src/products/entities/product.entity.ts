
import { text } from 'stream/consumers';
import {BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { ProductImage } from './product-image.entity';
import { Detail } from '../entities/detail.entity';

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique:true
    })
    title:string;

    @Column('float',{
        default:0
    })
    price:number;

    @Column({

        type:'text',
        nullable:true
    })
    description:string;

    @Column('text',{
        unique:true
    })
    slug:string;

    @Column('int',{
        default:0
    })
    stock:number;

    @Column('text',{
        array:true
    })
    sizes:string[];

    @Column('text')
    gender:string;

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug=this.title
        }
        //limpia la data
        this.slug=this.slug.toLocaleLowerCase().replaceAll(' ','_').replaceAll("'", '')

    }

    
    //tags
    @Column('text',{
            array:true,
            default:[]
    })
    tags:string[] 
    
    //image
    @OneToMany(
        ()=>ProductImage,
        (productImage)=>productImage.product,
        //eager:cargar todas las relaciones
        {cascade:true, eager:true}
    )
    images?: ProductImage[];


    @OneToMany(
        ()=>Detail,
        (detail)=>detail.product,
        {cascade:true, eager:true}
    )
    details?:Detail[]


    @BeforeUpdate()
    checkSlugUpdate(){
        //limpia la data
        this.slug=this.slug.toLocaleLowerCase().replaceAll(' ','_').replaceAll("'", '')
    }

}



