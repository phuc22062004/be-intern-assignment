import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { Follow } from '../entities/Follow';
import { Post_hashtag } from '../entities/Post_hashtag';
import { Like } from '../entities/Like';
import { User } from '../entities/User';
import { In, ILike, Between } from 'typeorm';

export class CustomController {
  private postRepo = AppDataSource.getRepository(Post);
  private followRepo = AppDataSource.getRepository(Follow);
  private hashtagRepo = AppDataSource.getRepository(Post_hashtag);
  private likeRepo = AppDataSource.getRepository(Like);

  async getFeed(req: Request, res: Response) {
    const currentUserId = parseInt(req.query.userId as string);
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!currentUserId) {
      return res.status(400).json({message: 'Missing userId'});
    }

    try {
      const follows = await this.followRepo.find({
        where: { followerId: currentUserId },
      });
      const followedUserIds = follows.map(f => f.followingId);

      if (followedUserIds.length === 0) {
        return res.json([]);
      }

      const posts = await this.postRepo.find({
        where: { userId: In(followedUserIds) },
        relations: ['user', 'likes', 'post_hashtags', 'post_hashtags.hashtag'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });
      const formatted = posts.map(post =>({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        author: {
          id: post.user.id,
          first_name: post.user.firstName,
          last_name: post.user.lastName,
          email: post.user.email,
        },
        likeCount: post.likes?.length || 0,
        hashtags: post.post_hashtags?.map(ph => ph.hashtag.name) || [],
      }));

      res.json(formatted);
    } 
    catch (e) {
      res.status(500).json({message: 'Error fetching feed',e});
    }
  }
  async getPersonalizedFeed(req: Request, res: Response) {
    const currentUserId = parseInt(req.query.userId as string);
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const follows = await this.followRepo.find({where:{ followerId: currentUserId }});
      const followedUserIds = follows.map(f => f.followingId);

      const posts = await this.postRepo.find({
        where: {userId: In(followedUserIds)},
        order: {createdAt: 'DESC' },
        relations: ['user', 'likes', 'post_hashtags', 'post_hashtags.hashtag'],
        skip: offset,
        take: limit,
      });

      const formatted = posts.map(post => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        author: {
          id: post.user.id,
          first_name: post.user.firstName,
          last_name: post.user.lastName,
          email: post.user.email,
        },
        likeCount: post.likes.length,
        hashtags: post.post_hashtags.map(ph => ph.hashtag.name),
      }));

      res.json(formatted);
    } 
    catch(e){
      res.status(500).json({message: 'Error fetching feed',e});
    }
  }

  async getPostsByHashtag(req: Request, res: Response) {
    const tag = req.params.tag;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const matched = await this.hashtagRepo.find({
        where: {
          hashtag: { name: ILike(tag) },
        },
        relations: ['post', 'post.user', 'hashtag', 'post.likes', 'post.post_hashtags', 'post.post_hashtags.hashtag'],
        skip: offset,
        take: limit,
      });

      const posts = matched.map(ph => ph.post);

      const formatted = posts.map(post => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        author: {
          id: post.user.id,
          first_name: post.user.firstName,
          last_name: post.user.lastName,
          email: post.user.email,
        },
        likeCount: post.likes.length,
        hashtags: post.post_hashtags.map(ph => ph.hashtag.name),
      }));

      res.json(formatted);
    } 
    catch(e) {
      res.status(500).json({ message: 'Error fetching posts by hashtag',e});
    }
  }

  async getUserActivity(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const type = req.query.type as string | undefined;
    const from = req.query.from ? new Date(req.query.from as string) : undefined;
    const to = req.query.to ? new Date(req.query.to as string) : undefined;

    try {
      const posts = await this.postRepo.find({
        where: { userId, ...(from && to ? { createdAt: Between(from, to) } : {}) },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      const likes = await this.likeRepo.find({
        where: { userId, ...(from && to ? { createdAt: Between(from, to) } : {}) },
        relations: ['post'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      const follows = await this.followRepo.find({
        where: [
          { followerId: userId, ...(from && to ? { createdAt: Between(from, to) } : {}) },
          { followingId: userId, ...(from && to ? { createdAt: Between(from, to) } : {}) },
        ],
        relations: ['follower', 'following'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      const activities: any[] = [];

      if (!type || type === 'post') {
        posts.forEach(p => activities.push({
          type: 'post',
          postId: p.id,
          content: p.content,
          createdAt: p.createdAt,
        }));
      }

      if (!type || type === 'like') {
        likes.forEach(l => activities.push({
          type: 'like',
          postId: l.postId,
          postContent: l.post.content,
          createdAt: l.createdAt,
        }));
      }

      if (!type || type === 'follow') {
        follows.forEach(f => activities.push({
          type: f.followerId === userId ? 'follow' : 'followed-by',
          userId: f.followerId === userId ? f.followingId : f.followerId,
          createdAt: f.createdAt,
        }));
      }

      activities.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      res.json({ total: activities.length, data: activities.slice(offset, offset + limit) });

    } 
    catch(e) {
      res.status(500).json({ message: 'Error fetching user activity',e});
    }
  }
}