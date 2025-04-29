import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,

} from "typeorm"

import {Post_hashtag} from "./Post_hashtag"

@Entity('hashtags')
export class Hashtag{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @OneToMany(() => Post_hashtag, (ph) => ph.hashtag )
    post_hashtags: Post_hashtag[];

    @CreateDateColumn()
    createdAt: Date;
}