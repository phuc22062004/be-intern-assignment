
## Database Schema Design and Entity Relationships

### User
- `id`: Primary Key
- `firstName`, `lastName`: User's name
- `email`: Unique email identifier
- `createdAt`, `updatedAt`: Timestamps
- **Relations**:
  - One-to-Many: `posts` → `Post`
  - One-to-Many: `likes` → `Like`
  - One-to-Many: `followings` → `Follow` (as follower)
  - One-to-Many: `followers` → `Follow` (as following)

### Post
- `id`: Primary Key
- `content`: Text content
- `userId`: FK to `User`
- `sumlikes`: Denormalized like count
- `createdAt`, `updatedAt`: Timestamps
- **Relations**:
  - Many-to-One: `user` → `User`
  - One-to-Many: `likes` → `Like`
  - One-to-Many: `post_hashtags` → `Post_hashtag`

### Like
- `id`: Primary Key
- `userId`: FK to `User`
- `postId`: FK to `Post`
- `createdAt`: Timestamp
- **Constraints**: Unique (`userId`, `postId`)
- **Relations**:
  - Many-to-One: `user` → `User`
  - Many-to-One: `post` → `Post`

### Follow
- `id`: Primary Key
- `followerId`: FK to `User`
- `followingId`: FK to `User`
- `createdAt`, `deletedAt`: Timestamps
- **Constraints**: Unique (`followerId`, `followingId`)
- **Relations**:
  - Many-to-One: `follower` → `User`
  - Many-to-One: `following` → `User`

### Hashtag
- `id`: Primary Key
- `name`: Hashtag text
- `createdAt`: Timestamp
- **Relations**:
  - One-to-Many: `post_hashtags` → `Post_hashtag`

### Post_hashtag
- `id`: Primary Key
- `postId`: FK to `Post`
- `hashtagId`: FK to `Hashtag`
- `createdAt`: Timestamp
- **Relations**:
  - Many-to-One: `post` → `Post`
  - Many-to-One: `hashtag` → `Hashtag`


## Indexing Strategy

- `users`: Unique index on `email`
- `posts`: Index on `userId`, `createdAt`
- `likes`: Unique composite index on (`userId`, `postId`)
- `follows`: Unique composite index on (`followerId`, `followingId`)
- `post_hashtags`: Index on `postId`, `hashtagId`
- `hashtags`: Index on `name` for fast search

![Hình ảnh database][https://drive.google.com/file/d/1URorZDnr7Sb6yuQmg-YhJkjQ1FjS6sig/view?usp=drive_link]


## Scalability Considerations and Solutions

### Caching
- Use Redis to cache:
  - User feeds
  - Trending hashtags
  - `sumlikes` count for posts

### Background Processing
- Use a job queue system for:
  - Updating like counts asynchronously
  - Sending notifications
  - Generating feed content

### Sharding
- Shard large tables like `posts`, `likes`, and `follows` by `userId`

### Read/Write Separation
- Implement read replicas for scaling read-heavy endpoints

### Pagination
- Use keyset pagination for large result sets 


## Other Design Considerations

### Data Integrity
- All foreign keys use `ON DELETE CASCADE` to ensure referential cleanup
- Composite unique constraints prevent duplicates 

### Soft Deletes
- `Follow` entity uses `deletedAt` to support soft unfollow
- Consider soft delete for `Post` if moderation or restoration is needed

### Security
- Rate-limit sensitive operations: like/unlike, follow/unfollow
- Validate email uniqueness strictly at the application level

### Future Enhancements
- Add support for comment system
- Enable full-text search for posts and hashtags
- Implement notification system for likes/follows
- Add user roles 

