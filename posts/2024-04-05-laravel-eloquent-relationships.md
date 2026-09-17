---
title: "Laravel Eloquent Relationships: Hướng dẫn thực tế từ A đến Z"
slug: "laravel-eloquent-relationships"
date: "2024-04-05"
category: "Web Development"
tags: ["Laravel", "PHP", "Eloquent", "Database", "ORM"]
excerpt: "Nắm vững tất cả các loại quan hệ trong Eloquent ORM của Laravel với các ví dụ thực tế."
thumbnail: "/images/posts/laravel-eloquent.jpg"
published: true
---

Eloquent ORM là một trong những tính năng mạnh mẽ và được yêu thích nhất của Laravel. Khả năng định nghĩa quan hệ giữa các model theo cách trực quan giúp việc thao tác với database trở nên dễ dàng hơn rất nhiều so với viết SQL thuần.

Trong bài này, tôi sẽ đi qua tất cả các loại quan hệ Eloquent với ví dụ thực tế từ dự án thực tế mà tôi đã làm.

## Chuẩn bị môi trường

Giả sử chúng ta đang xây dựng một hệ thống blog đơn giản với các bảng:
- `users` — tác giả
- `posts` — bài viết
- `categories` — danh mục
- `tags` — nhãn
- `comments` — bình luận
- `post_tag` — pivot table (nhiều-nhiều)

## One to One (Một - Một)

Mỗi `User` có một `Profile`.

```php
// app/Models/User.php
class User extends Model
{
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }
}

// app/Models/Profile.php
class Profile extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

### Sử dụng

```php
// Lấy profile của user
$user = User::find(1);
$profile = $user->profile; // Eloquent tự join

// Tạo profile cho user
$user->profile()->create([
    'bio' => 'Full-Stack Developer tại Hà Nội',
    'avatar' => 'avatar.jpg',
]);

// Eager loading (tránh N+1 problem)
$users = User::with('profile')->get();
```

## One to Many (Một - Nhiều)

Một `User` có nhiều `Post`, một `Post` thuộc về một `User`.

```php
// User.php
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

// Lấy chỉ posts đã published
public function publishedPosts(): HasMany
{
    return $this->hasMany(Post::class)
                ->where('status', 'published')
                ->orderBy('created_at', 'desc');
}

// Post.php
public function author(): BelongsTo
{
    return $this->belongsTo(User::class, 'user_id');
}
```

### Sử dụng

```php
// Lấy tất cả posts của user
$posts = $user->posts()->latest()->paginate(10);

// Đếm posts
$count = $user->posts()->count();

// Tạo post cho user
$post = $user->posts()->create([
    'title' => 'Bài viết mới',
    'content' => 'Nội dung...',
    'status' => 'draft',
]);
```

## Many to Many (Nhiều - Nhiều)

`Post` có nhiều `Tag`, một `Tag` có thể gắn với nhiều `Post`.

```php
// Post.php
public function tags(): BelongsToMany
{
    return $this->belongsToMany(Tag::class)
                ->withTimestamps(); // Tự động cập nhật created_at/updated_at trong pivot
}

// Tag.php
public function posts(): BelongsToMany
{
    return $this->belongsToMany(Post::class)->withTimestamps();
}
```

### Pivot Table với Extra Columns

Đôi khi pivot table có thêm dữ liệu. Ví dụ bảng `post_tag` có thêm cột `order`:

```php
// Post.php
public function tags(): BelongsToMany
{
    return $this->belongsToMany(Tag::class)
                ->withPivot('order')
                ->withTimestamps()
                ->orderByPivot('order');
}
```

### Sử dụng

```php
// Gắn tags vào post
$post->tags()->attach([1, 2, 3]);

// Đồng bộ tags (xóa cũ, thêm mới)
$post->tags()->sync([1, 2, 5]);

// Gắn với pivot data
$post->tags()->attach([1 => ['order' => 1], 2 => ['order' => 2]]);

// Kiểm tra có tag không
$hasTag = $post->tags()->where('name', 'Laravel')->exists();
```

## Has Many Through

Lấy tất cả `Comment` của một `User` qua `Post`:

```php
// User.php
public function comments(): HasManyThrough
{
    return $this->hasManyThrough(Comment::class, Post::class);
    // User -> Post -> Comment
}
```

### Sử dụng thực tế

```php
// Lấy tất cả comments trên các bài viết của user
$comments = $user->comments()
                 ->with('post:id,title')
                 ->latest()
                 ->take(10)
                 ->get();
```

## Xử lý N+1 Problem với Eager Loading

N+1 là vấn đề hiệu suất phổ biến nhất với ORM. Đây là cách phát hiện và xử lý:

```php
// BAD: N+1 problem — 1 query cho posts + N queries cho mỗi author
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // Query mới mỗi lần!
}

// GOOD: Eager loading — chỉ 2 queries
$posts = Post::with('author', 'tags', 'category')->get();
foreach ($posts as $post) {
    echo $post->author->name; // Không query thêm
}

// Nested eager loading
$posts = Post::with(['author.profile', 'tags', 'comments.user'])->get();

// Lazy eager loading (sau khi đã fetch)
$posts = Post::all();
$posts->load('author', 'tags');
```

### Phát hiện N+1 bằng Laravel Debugbar

```bash
composer require barryvdh/laravel-debugbar --dev
```

Sau đó check số lượng queries trong toolbar. Nếu thấy quá nhiều queries tương tự nhau, đó là dấu hiệu N+1.

## Polymorphic Relationships

Khi nhiều model dùng chung một bảng. Ví dụ `Image` có thể thuộc về `Post` hoặc `User`:

```php
// Image.php
public function imageable(): MorphTo
{
    return $this->morphTo();
}

// Post.php
public function images(): MorphMany
{
    return $this->morphMany(Image::class, 'imageable');
}

// User.php
public function images(): MorphMany
{
    return $this->morphMany(Image::class, 'imageable');
}
```

## Kết luận

Eloquent Relationships giúp code trở nên sạch và expressive hơn rất nhiều. Điểm quan trọng nhất cần nhớ:

1. Luôn dùng **eager loading** (`with()`) khi load dữ liệu liên quan để tránh N+1
2. Dùng **query constraints** trong định nghĩa relationship để tái sử dụng logic
3. Với pivot table có extra data, dùng **withPivot()** và **Custom Pivot Model**

Hy vọng bài viết giúp ích cho bạn. Nếu có thắc mắc, để lại comment nhé!
