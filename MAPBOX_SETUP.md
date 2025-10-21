# Mapbox Setup Instructions

## Quick Start

### 1. Create Mapbox Account
1. Go to [mapbox.com](https://www.mapbox.com/)
2. Click "Sign up" (it's free!)
3. Create your account

### 2. Get Your Access Token
1. After signing in, you'll be on your dashboard
2. Your **Default public token** will be displayed
3. Copy this token

### 3. Add to Environment Variables

**Local Development:**
Open your `.env` file and replace `your_mapbox_token_here` with your actual token:
```
VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJja...
```

**Netlify Deployment:**
1. Go to your Netlify dashboard
2. Site settings → Environment variables
3. Add new variable:
   - Name: `VITE_MAPBOX_TOKEN`
   - Value: Your Mapbox public token
4. Redeploy your site

### 4. Restart Dev Server
After adding the token, restart your development server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Features You Get

✅ **Interactive zoomable map** centered on Vale of Glamorgan  
✅ **Click to add pins** with custom labels  
✅ **Precise lat/lng coordinates** stored in database  
✅ **Community map** showing all submissions  
✅ **Popups on click** to see suggestions  
✅ **Navigation controls** (zoom, rotate)  
✅ **Mobile-friendly** touch gestures  

## Free Tier Limits

- **50,000 map loads per month** for free
- Perfect for community consultation sites
- No credit card required

## Map Styles

Currently using: `mapbox://styles/mapbox/streets-v12`

You can change the style in the components to:
- `streets-v12` - Standard street map (current)
- `satellite-v9` - Satellite imagery
- `outdoors-v12` - Topographic
- `light-v11` - Light theme
- `dark-v11` - Dark theme

## Support

If you have issues:
- [Mapbox Documentation](https://docs.mapbox.com/)
- [Mapbox Support](https://support.mapbox.com/)

