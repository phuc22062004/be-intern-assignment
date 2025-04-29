import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,

} from "typeorm"

import { Post } from "./Post"
import {Hashtag} from "./Hashtag"

@Entity('post_hashtags')
export class Post_hashtag{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    postId: number;

    @Column()
    hashtagId: number;

    @ManyToOne(() => Post, (post) => post.post_hashtags, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'postId'})
    post: Post;

    @ManyToOne(() => Hashtag, (ht) => ht.post_hashtags, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'hashtagId'})
    hashtag: Hashtag;

    @CreateDateColumn()
    createdAt: Date;
}