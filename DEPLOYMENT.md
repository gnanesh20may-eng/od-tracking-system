# Deployment Guide

This guide covers deploying the OD Verification System to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backed up
- [ ] Frontend built and optimized
- [ ] Backend tested thoroughly
- [ ] SSL/HTTPS certificates obtained
- [ ] CORS origins updated
- [ ] API URLs updated
- [ ] Database URL updated
- [ ] JWT_SECRET changed (strong random string)
- [ ] Logging configured
- [ ] Monitoring setup

## Backend Deployment

### Option 1: Deploy to Heroku

1. **Create Heroku Account**
   ```bash
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create od-verification-system
   ```

3. **Add PostgreSQL Addon**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your_very_secret_key
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=https://yourdomain.com
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Initialize Database**
   ```bash
   heroku run npm run db:init
   ```

### Option 2: Deploy to AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 20.04 LTS (free tier eligible)
   - t2.micro instance
   - Allow ports 22, 80, 443, 5000

2. **Connect and Setup**
   ```bash
   ssh -i key.pem ubuntu@your-instance-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   ```

3. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd od-system/backend
   npm install
   ```

4. **Configure Database**
   ```bash
   sudo -u postgres createdb od_verification_system
   npm run db:init
   ```

5. **Create .env File**
   ```bash
   nano .env
   # Add production environment variables
   ```

6. **Start with PM2**
   ```bash
   pm2 start src/server.js --name "od-api"
   pm2 save
   sudo pm2 startup
   ```

7. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install -y nginx
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Configure:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Option 3: Deploy to DigitalOcean

1. **Create Droplet**
   - Ubuntu 20.04
   - $5/month (512MB, 1GB swap)

2. **Initial Setup**
   ```bash
   # Same as AWS above
   ```

3. **Configure Firewall**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

4. **Configure Environment**
   - Set `REACT_APP_API_URL` to production API
   - Set `REACT_APP_MAP_TILE_URL` if needed

### Option 2: Deploy to Netlify

1. **Build Application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Connect to Netlify**
   - Drag and drop `build/` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

3. **Configure Environment & Redirects**
   - Create `public/_redirects` file:
   ```
   /* /index.html 200
   ```

### Option 3: Deploy to AWS S3 + CloudFront

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://od-system-frontend
   ```

2. **Upload Build**
   ```bash
   aws s3 sync build/ s3://od-system-frontend/ --delete
   ```

3. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Default root object: index.html
   - Configure CORS

## Database Deployment

### PostgreSQL Hosting Options

**1. AWS RDS**
- Managed PostgreSQL
- Automated backups
- High availability

**2. DigitalOcean Managed Databases**
- Simple setup
- Affordable
- Included backups

**3. Self-hosted on VPS**
- Full control
- Backup responsibility

## Environment Variables

### Backend Production (.env)
```
NODE_ENV=production
PORT=5000
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=od_verification_system
DB_USER=postgres
DB_PASSWORD=secure_password_here
JWT_SECRET=very_long_random_string_min_32_chars
JWT_EXPIRE=7d
API_URL=https://api.yourdomain.com
CLIENT_URL=https://yourdomain.com
GEOFENCE_RADIUS=500
```

### Frontend Production (.env)
```
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
REACT_APP_LOCATION_TRACKING_INTERVAL=30000
```

## SSL/HTTPS Setup

### Option 1: Let's Encrypt (Free)
```bash
sudo certbot certonly --standalone -d yourdomain.com
sudo certbot certonly --standalone -d api.yourdomain.com
```

### Option 2: AWS Certificate Manager
- Free for AWS resources
- Auto-renewal
- CloudFront integration

## Monitoring & Logging

### Application Logging
Use Winston or Morgan:
```javascript
const morgan = require('morgan');
app.use(morgan('combined'));
```

### Error Tracking
Consider Sentry:
```bash
npm install @sentry/node
```

### Performance Monitoring
- New Relic
- DataDog
- Prometheus + Grafana

## Backup Strategy

### Database Backups
```bash
# Automated backup with pg_dump
pg_dump od_verification_system > backup.sql

# Restore
psql od_verification_system < backup.sql
```

### File Backups
- S3 bucket for code backups
- Regular snapshot backups

## Scaling

### Vertical Scaling
- Increase server resources
- Upgrade database tier

### Horizontal Scaling
- Load balancing (Nginx, HAProxy)
- Multiple API instances
- Database replication
- Redis for caching

## Security Considerations

1. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Setup WAF (Web Application Firewall)**
   - AWS WAF
   - Cloudflare
   - ModSecurity

3. **Regular Security Audits**
   - Code review
   - Dependency scanning
   - Penetration testing

4. **API Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   app.use(rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   }));
   ```

5. **CORS Configuration**
   ```javascript
   app.use(cors({
     origin: ['https://yourdomain.com'],
     credentials: true
   }));
   ```

6. **HTTPS Everywhere**
   ```javascript
   app.use((req, res, next) => {
     if (req.header('x-forwarded-proto') !== 'https') {
       res.redirect(`https://${req.header('host')}${req.url}`);
     } else {
       next();
     }
   });
   ```

## Performance Optimization

### Backend
- Enable gzip compression
- Set up caching headers
- Use database indexes
- Connection pooling
- Implement pagination

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- CDN for static assets
- Service workers for offline

## Domain Configuration

### DNS Records
```
A Record: api.yourdomain.com → your-api-ip
A Record: yourdomain.com → your-frontend-ip (or CDN)
MX Record: (if email needed)
```

### Email Setup (Optional)
For notification emails:
```bash
npm install nodemailer
```

## Continued Maintenance

1. **Regular Updates**
   - Security patches
   - Library updates
   - OS updates

2. **Monitoring**
   - Uptime checks
   - Error rate monitoring
   - Database performance

3. **Backups**
   - Daily database backups
   - Weekly full system backups
   - Test restore procedure

4. **Documentation**
   - Keep deployment docs updated
   - Document any custom configurations
   - Runbooks for common issues

## Rollback Procedure

1. Keep previous version deployed
2. Use git tags for releases
3. Database migration backups
4. Quick rollback script:
   ```bash
   git checkout v1.0.0
   npm install
   npm run build
   pm2 restart all
   ```

## Post-Deployment Testing

- [ ] Login functionality works
- [ ] Create duty request works
- [ ] Location tracking works
- [ ] Maps render correctly
- [ ] API calls succeed
- [ ] Database operations work
- [ ] User authentication works
- [ ] All pages load
- [ ] Mobile responsiveness works
- [ ] HTTPS works correctly

## Support Contacts

- Server Issues: DevOps team
- Database Issues: Database admin
- Frontend Issues: Front-end team
- API Issues: Backend team
