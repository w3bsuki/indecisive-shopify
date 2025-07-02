# Instagram Integration Setup Guide

## Overview

The Instagram integration displays real Instagram posts in the Community section using Instagram's Graph API. The system includes fallback sample posts for development and handles API errors gracefully.

## Current Status

✅ **Infrastructure Ready**: API client, React hooks, and UI components implemented  
⏳ **API Setup Required**: Instagram Graph API credentials needed for production  
✅ **Fallback System**: Sample posts display when API is not configured  

## Production Setup Requirements

### 1. Instagram Account Setup

**Convert to Professional Account (Required)**
- Instagram Basic Display API was discontinued in December 2024
- Only Professional (Business/Creator) accounts work with Graph API
- Conversion is **free** and can be done in Instagram settings

### 2. Facebook Developer App Setup

1. **Create Facebook App**
   - Go to [developers.facebook.com](https://developers.facebook.com)
   - Click "Create App" → Choose "Business" type
   - Fill in app details

2. **Add Instagram Graph API Product**
   - In your Facebook app dashboard
   - Click "Add Product" → Select "Instagram Graph API"
   - Complete the setup process

3. **Configure App Settings**
   - Add your website domain to "App Domains"
   - Set up OAuth redirect URIs
   - Configure data use checkup

### 3. Generate Access Tokens

**Initial Access Token (via Graph API Explorer)**
1. Go to [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Select your app and Instagram Graph API
3. Request permissions:
   - `instagram_graph_user_profile`
   - `instagram_graph_user_media`
4. Generate and copy the access token

**Long-Lived Token (Recommended)**
```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"
```

### 4. Environment Variables

Add to your `.env.local` file:

```bash
# Instagram Graph API Configuration
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
INSTAGRAM_USER_ID=your_instagram_business_user_id
```

**Finding Your Instagram User ID:**
```bash
curl -i -X GET "https://graph.instagram.com/me?fields=id,username&access_token={access-token}"
```

### 5. Deployment Configuration

**Vercel Environment Variables**
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the Instagram environment variables
4. Deploy your project

**Security Notes**
- Never commit access tokens to version control
- Use long-lived tokens (60 days) and implement refresh logic
- Monitor token expiration in production
- Set up proper error handling for API failures

## API Features & Limitations

### Available Features
- Fetch recent posts (images, videos, carousels)
- Access post metadata (caption, timestamp, permalink)
- Get basic profile information
- Rate limit: 200 calls per user per hour

### Current Limitations
- No like/comment counts without Instagram Insights API
- No access to posts from other users (only your own business account)
- Requires HTTPS for OAuth (even in development)
- Token refresh needed every 60 days

## Development Workflow

### Without API Setup (Current State)
- Displays sample posts with realistic data
- All UI components work normally
- Perfect for development and testing

### With API Setup
- Fetches real Instagram posts
- Displays actual engagement metrics
- Links to real Instagram posts
- Graceful fallback to samples on API errors

## Testing the Integration

### Local Testing
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Navigate to homepage and check Community section
# Should show either real Instagram posts or sample fallbacks
```

### API Testing
```bash
# Test Instagram API endpoint
curl http://localhost:3000/api/instagram/posts?limit=6

# Expected response:
{
  "posts": [...],
  "count": 6,
  "timestamp": "2025-01-02T..."
}
```

## Troubleshooting

### Common Issues

**"Instagram API not configured" Message**
- Environment variables not set
- Check `.env.local` file exists and is correctly formatted

**API Returns Error**
- Token might be expired (Instagram tokens last 60 days)
- Check app permissions and domains in Facebook Developer Console
- Verify Instagram account is set to Business/Creator

**No Posts Displayed**
- Check if Instagram business account has any posts
- Verify API permissions include media access
- Check browser console for JavaScript errors

### Production Monitoring

Monitor these metrics in production:
- API response times
- Token expiration warnings
- Error rates and fallback usage
- Rate limit consumption

## Future Enhancements

### Potential Improvements
1. **Automatic Token Refresh**: Implement server-side token refresh logic
2. **TikTok Integration**: Add TikTok API when available for business accounts
3. **Content Moderation**: Filter posts by hashtags or content guidelines
4. **Analytics Integration**: Track which posts generate most engagement
5. **Caching Strategy**: Implement Redis/database caching for better performance

### Content Strategy
- Use consistent hashtags: #IndecisiveWear #StreetStyle #MinimalFashion
- Post high-quality product photos and lifestyle content
- Engage with customer posts featuring your products
- Cross-promote between Instagram and website

## Support

For Instagram Graph API issues:
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/)
- [Facebook Developer Community](https://developers.facebook.com/community/)

For implementation questions:
- Check the codebase documentation
- Review the React hooks in `/hooks/use-instagram.tsx`
- Examine the API client in `/lib/instagram/client.ts`