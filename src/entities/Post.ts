import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { User } from './User';
import { Like } from './Like';
import {Post_hashtag} from './Post_hashtag'


@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('increment')
    id : number;

    @Column('text')
    content: string;

    @Column()
    userId: number;

    @Column({default: 0})
    sumlikes: number;

    @ManyToOne(() => User, (user) => user.posts, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: User;

    @OneToMany(() => Like, (like) => like.post)
    likes: Like[];

    @OneToMany(() => Post_hashtag, (ph) => ph.post)
    post_hashtags: Post_hashtag[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
