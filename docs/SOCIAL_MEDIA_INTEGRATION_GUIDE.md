# Social Media Integration Guide

## Instagram Integration Options

### Option 1: Instagram Basic Display API (Recommended for Brand Posts)

**Pros:**
- Official API from Instagram
- Can display your own brand's posts
- Real-time updates
- Free to use

**Cons:**
- Cannot fetch posts by hashtag (restricted by Instagram)
- Requires Facebook Developer account
- Token refresh needed every 60 days
- Only shows your own account's posts

**Implementation Steps:**
1. Create Facebook Developer account
2. Create an app and add Instagram Basic Display
3. Get Instagram Business account
4. Generate access tokens
5. Use API to fetch posts

**Example Implementation:**
```typescript
// lib/instagram-api.ts
export async function getInstagramPosts() {
  const response = await fetch(
    `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
  );
  return response.json();
}
```

### Option 2: Instagram oEmbed API (For Specific Posts)

**Pros:**
- No authentication required
- Can embed any public post
- Simple implementation

**Cons:**
- Manual process - need to add each post URL
- No automatic updates
- Limited customization

**Example:**
```typescript
// Fetch embed HTML for a specific post
const response = await fetch(
  `https://api.instagram.com/oembed?url=https://www.instagram.com/p/POST_ID/`
);
```

### Option 3: Third-Party Services (Easiest Setup)

**Popular Services:**
- **EmbedSocial** ($10-50/month) - Best for hashtag feeds
- **Snapwidget** ($6-30/month) - Good customization options
- **Taggbox** ($15-99/month) - Advanced moderation features
- **Curator.io** ($29-299/month) - Multi-platform support

**Pros:**
- Can aggregate posts by hashtag
- Easy setup (just add script tag)
- Automatic updates
- Built-in moderation tools

**Cons:**
- Monthly cost
- Less control over styling
- Dependency on third-party service

### Option 4: Manual Curation (Full Control)

**Pros:**
- Complete control over content
- No API limitations
- Can mix Instagram/TikTok content
- No ongoing costs

**Cons:**
- Manual work to update
- No real-time updates

**Implementation:**
```typescript
// Create a data structure for manual posts
interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok';
  username: string;
  imageUrl: string;
  caption?: string;
  likes?: number;
  permalink: string;
  createdAt: Date;
}

// Store in database or CMS
const curatedPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    username: '@fashion_lover',
    imageUrl: '/images/ugc/post-1.jpg',
    likes: 234,
    permalink: 'https://instagram.com/p/...',
    createdAt: new Date('2024-01-15')
  }
];
```

## TikTok Integration Options

### Option 1: TikTok oEmbed API

Similar to Instagram oEmbed, allows embedding specific TikTok videos.

```typescript
const response = await fetch(
  `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@username/video/VIDEO_ID`
);
```

### Option 2: TikTok Display API

**Note:** Currently in limited beta. Requires approval from TikTok.

## Recommended Approach for Indecisive Wear

1. **Start with Manual Curation**
   - Full control over content quality
   - No API limitations
   - Can showcase best user-generated content

2. **Add Instagram Basic Display API**
   - Show your own brand posts automatically
   - Keep manual curation for user posts

3. **Consider Third-Party Service**
   - When you need hashtag aggregation
   - EmbedSocial is recommended for fashion brands

## Implementation Checklist

- [ ] Decide on integration method
- [ ] Set up necessary API accounts
- [ ] Create content moderation guidelines
- [ ] Implement lazy loading for performance
- [ ] Add proper attribution and links
- [ ] Test on mobile devices
- [ ] Set up content refresh schedule
- [ ] Create fallback for API failures

## Legal Considerations

1. **User Consent:** Always get permission before featuring user content
2. **Attribution:** Link back to original posts
3. **Terms of Service:** Follow platform guidelines
4. **Privacy:** Don't store user data unnecessarily

## Performance Tips

1. **Lazy Load Images:** Use Next.js Image component
2. **Cache API Responses:** Reduce API calls
3. **Optimize Images:** Resize for web before serving
4. **Use CDN:** Serve images from a CDN
5. **Implement Pagination:** Don't load all posts at once