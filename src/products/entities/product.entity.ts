
import { text } from 'stream/consumers';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProductImage } from './product-image.entity';
import { Detail } from '../entities/detail.entity';
import { User } from 'src/auth/entities/user.entity';
import { use } from 'passport';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example:'2aea988a-fdce-4579-9041-2b2dff6544c2',
        description:'Product ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'T-Shirt Teslo',
        description:'Product Title',
        uniqueItems:true
    })
    @Column('text', {
        unique: true
    })
    title: string;



    @ApiProperty({
        example:0,
        description:'Product price',
       
    })
    @Column('float', {
        default: 0
    })
    price: number;



    @ApiProperty({
        example:'wewer fdsf rewwe sfdsdf wrwer',
        description:'Product description',
        default:null
    })
    @Column({

        type: 'text',
        nullable: true
    })
    @ApiProperty()
    description: string;



    @ApiProperty({
        example:'T_Shirt_Teslo',
        description:'Product Slug - for SEO routes',
        uniqueItems:true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example:10,
        description:'Product stock',
        default:0
    })
    @Column('int', {
        default: 0
    })
    stock: number;



    @ApiProperty({
        example:['M', 'XL', 'XXL'],
        description:'Product sizes',
        default:0
    })
    @Column('text', {
        array: true
    })
    sizes: string[];


    @ApiProperty({
        example:'women',
        description:'Product gander',
    })
    @Column('text')
    gender: string;

    //tags
    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    //image
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        //eager:cargar todas las relaciones
        { cascade: true, eager: true }
    )
    images?: ProductImage[];




    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User




    @BeforeUpdate()
    checkSlugUpdate() {
        //limpia la data
        this.slug = this.slug.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }



    @OneToMany(
        () => Detail,
        (detail) => detail.product,
        { cascade: true, eager: true }
    )
    details?: Detail[]


    
    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }
        //limpia la data
        this.slug = this.slug.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '')

    }

}



