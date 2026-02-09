# Inkedfeed Admin Panel

Create and edit posts from a simple dashboard (like WordPress/Blogger) instead of editing markdown by hand.

## Quick start (local)

**1. Start the site** (in one terminal):

```bash
npm start
```

**2. Start the admin backend** (in a second terminal):

```bash
npm run admin
```

**3. Open the admin:**

- In your browser go to: **http://localhost:8080/admin/**  
  (Use the same port your Eleventy server shows in the terminal.)

You’ll see the Decap CMS dashboard with a **Posts** collection. Use it to:

- **New post** – Create a post with a form (title, date, excerpt, images, body, etc.).
- **Edit** – Open any existing post and change fields or body.
- **Upload images** – Use the image fields; files are saved under `src/images/uploads/`.

Changes are written to markdown in `src/posts/`. If `npm start` is running, the site will reload automatically.

## Admin fields

| Field | What it does |
|-------|----------------|
| **Title** | Post title |
| **Publish Date** | Shown on the post and in the grid |
| **Excerpt** | Short summary on the home page |
| **Featured Image** | Thumbnail in the post grid |
| **Hero Image** | Big image on the post and in the top rotator |
| **Show in rotator?** | Toggle to show this post in the top carousel |
| **Rotator points** | Bullet lines under the rotator (e.g. “Read in 4 min”) |
| **Special tag** | Label on the bottom slider (e.g. “Essay”, “Featured”) |
| **Body** | Main post content (Markdown) |

## Deploying with Git (optional)

To use the admin on a live site, connect Decap to your Git repo:

1. In `admin/config.yml`, comment out the `proxy` backend and set a Git backend, for example:

   ```yaml
   backend:
     name: github
     repo: your-username/inkedfeed
     branch: main
   ```

2. Configure [Decap CMS authentication](https://decapcms.org/docs/authentication-backends/) (e.g. GitHub OAuth or Netlify Identity).

3. Deploy the site and open `https://yoursite.com/admin/` to create and edit posts; they’ll be saved as commits in your repo.
