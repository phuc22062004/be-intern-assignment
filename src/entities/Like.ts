import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
    Unique,
} from "typeorm"

import { User } from "./User"
import { Post } from "./Post"

@Entity('likes')
@Unique(['userId','postId'])
export class Like{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    postId: number;

    @ManyToOne(() => User, (user) => user.likes, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: User;

    @ManyToOne(() => Post, (post) => post.likes, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'postId'})
    post: Post;

    @CreateDateColumn()
    createdAt: Date;

}