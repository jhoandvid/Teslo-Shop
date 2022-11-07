import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from '../../products/entities/product.entity';

@Entity({name:'details'})
export class Detail {

    @PrimaryGeneratedColumn()
    id:number;

    @Column('int',{
        default:0
    })
    amount:number;

    @Column('float', {
        default:0
    })
    iva:number;

    @Column('float')
    price:number;

    @Column('int')
    total:number;

    @ManyToOne(
        ()=>Product,
        (product)=>product.details,
        {onDelete:'CASCADE'}
    )
    product:Product
}
