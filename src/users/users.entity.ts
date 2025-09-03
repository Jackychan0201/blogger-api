import { Post } from "src/posts/posts.entity";
import { BaseEntity, Entity, Column, Unique, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Unique(["email"])
@Entity("users")
export class User extends BaseEntity { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[];
}
