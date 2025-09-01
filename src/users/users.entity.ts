import { BaseEntity, Entity, Column, Unique, PrimaryGeneratedColumn } from "typeorm";

@Unique(["email"])
@Entity("users")
export class User extends BaseEntity { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;
}
