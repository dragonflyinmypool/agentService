const axios = require('axios');

async function deployMovieSite() {
    const movieHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        :root {
            --bg: #0a0a0c;
            --surface: #16161a;
            --primary: #f5c518; /* IMDb Yellow */
            --text: #eeeeee;
            --text-dim: #94a3b8;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 40px 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        header {
            text-align: center;
            margin-bottom: 60px;
            border-bottom: 1px solid var(--surface);
            padding-bottom: 20px;
        }
        h1 {
            font-size: 3rem;
            letter-spacing: -1px;
            margin: 0;
            color: var(--primary);
            text-transform: uppercase;
        }
        .subtitle {
            color: var(--text-dim);
            font-size: 1.1rem;
        }
        .movie-card {
            background: var(--surface);
            padding: 30px;
            margin-bottom: 30px;
            border-radius: 12px;
            border: 1px solid #2d2d35;
            transition: transform 0.2s;
        }
        .movie-category {
            font-size: 0.8rem;
            text-transform: uppercase;
            color: var(--primary);
            font-weight: bold;
            display: block;
            margin-bottom: 10px;
        }
        .movie-title {
            font-size: 2rem;
            margin: 0 0 15px 0;
        }
        .movie-meta {
            display: flex;
            gap: 20px;
            font-size: 0.9rem;
            color: var(--text-dim);
            margin-bottom: 20px;
        }
        .movie-plot {
            font-size: 1.1rem;
            color: #d1d5db;
        }
        .rating {
            color: var(--primary);
            font-weight: bold;
        }
        footer {
            text-align: center;
            margin-top: 60px;
            color: var(--text-dim);
            font-size: 0.8rem;
        }
        /* Visual Placeholder for images since they are stripped */
        .poster-placeholder {
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), transparent);
            margin-bottom: 20px;
            border-radius: 2px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>CineAgent</h1>
            <p class="subtitle">Hand-picked essentials for the autonomous viewer.</p>
        </header>

        <div class="movie-card">
            <span class="movie-category">Sci-Fi / Thriller</span>
            <h2 class="movie-title">Inception</h2>
            <div class="movie-meta">
                <span>2010</span>
                <span>Directed by Christopher Nolan</span>
                <span class="rating">★ 8.8</span>
            </div>
            <div class="poster-placeholder"></div>
            <p class="movie-plot">A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.</p>
        </div>

        <div class="movie-card">
            <span class="movie-category">Sci-Fi / Action</span>
            <h2 class="movie-title">The Matrix</h2>
            <div class="movie-meta">
                <span>1999</span>
                <span>Directed by The Wachowskis</span>
                <span class="rating">★ 8.7</span>
            </div>
            <div class="poster-placeholder"></div>
            <p class="movie-plot">A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.</p>
        </div>

        <div class="movie-card">
            <span class="movie-category">Sci-Fi / Drama</span>
            <h2 class="movie-title">Interstellar</h2>
            <div class="movie-meta">
                <span>2014</span>
                <span>Directed by Christopher Nolan</span>
                <span class="rating">★ 8.7</span>
            </div>
            <div class="poster-placeholder"></div>
            <p class="movie-plot">When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.</p>
        </div>

        <footer>
            <p>Hosted on AgentHost &bull; Delivered by CineAgent API</p>
        </footer>
    </div>
</body>
</html>
    `;

    const REMOTE_IP = '157.180.95.179';

    try {
        console.log(`Deploying your movie site to http://${REMOTE_IP}...`);
        const response = await axios.post(`http://${REMOTE_IP}/api/v1/deploy`, {
            html_content: movieHtml
        });

        console.log('\n--- SUCCESS ---');
        console.log(`Site ID: ${response.data.site_id}`);
        console.log(`URL: ${response.data.url}`);
        console.log(`Expires: ${response.data.expires_at}`);

    } catch (err) {
        console.error('Deployment Failed:', err.response ? err.response.data : err.message);
    }
}

deployMovieSite();
