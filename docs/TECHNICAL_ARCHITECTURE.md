# Technical Architecture

## Infrastructure
- **Single Hetzner VPS**: Minimalist footprint for maximum efficiency.
- **Nginx static file serving**: High-performance serving of static assets.
- **Files stored on disk by expiration date**: Organised for easy cleanup.

## Storage Model
Files are organised in a directory structure that encodes the expiration date:

```text
/sites/
  /YYYY-MM-DD/
    /site_id/
      index.html
```

## Expiration Handling
- **Directory-based expiration**: Cleanups are performed by targetting the date-stamped folders.
- **Daily cron job deletes expired folders**: A simple script runs every 24 hours to `rm -rf` the directories for `TODAY - 365 days`.
- **No database required**: The filesystem serves as the source of truth for site existence and expiration.

## Access Model
- **Public URL**: Sites are accessible to anyone with the link.
- **No authentication**: No login required to view or deploy (test version).
- **Site served only while directory exists**: Once the cron job deletes the folder, the site is gone.
