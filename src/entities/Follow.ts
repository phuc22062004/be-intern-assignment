
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Unique,
    JoinColumn,

} from "typeorm"

import { User } from "./User";

@Entity('follows')
@Unique(['followerId','followingId'])
export class Follow{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    followerId: number;

    @Column()
    followingId: number;

    @ManyToOne(() => User, (user) => user.followings, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'followerId'})
    follower: User;

    @ManyToOne(() => User, (user) => user.followers, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'followingId'})
    following: User;
    
    @CreateDateColumn()
    createdAt: Date;
}