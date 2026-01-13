# Deploying to Hetzner (The "Easy" Way)

Since AgentHost is extremely lightweight, you can host it on the smallest Hetzner CX21 (or even a CX11) using a simple **Systemd** setup.

## 1. Prepare the Server
Once you have your Hetzner VPS (Ubuntu 22.04+ recommended), SSH in and run:

```bash
# Update and install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Create a directory for AgentHost
mkdir -p /opt/agenthost
cd /opt/agenthost
```

## 2. Upload the Code
You can either `git clone` your repo or just SCP the files. At a minimum, you need:
- `server.js`
- `sanitizer.js`
- `package.json`
- `ai-plugin.json`
- `llms.txt`

Run `npm install` once the files are on the server.

## 3. Setup Systemd (Process Management)
This ensures the server starts automatically on boot and restarts if it crashes.

Create the service file:
`sudo nano /etc/systemd/system/agenthost.service`

Paste this in:
```ini
[Unit]
Description=AgentHost MVP
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/agenthost
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=PORT=80
Environment=BASE_URL=http://your-vps-ip

[Install]
WantedBy=multi-user.target
```

## 4. Start the Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable agenthost
sudo systemctl start agenthost
```

## 5. (Optional) Quick Domain + SSL
If you want a real domain and HTTPS, the easiest way is **Caddy**.

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Edit the Caddyfile (`sudo nano /etc/caddy/Caddyfile`):
```text
your-domain.com {
    reverse_proxy localhost:80
}
```
Then run `sudo systemctl restart caddy`. Caddy will handle SSL certificates automatically.

## Summary Checklist
1. Buy Hetzner VPS (~€4/mo).
2. Install Node.js.
3. Copy files to `/opt/agenthost`.
4. Enable the `agenthost.service`.
5. Point your domain IP at the VPS.
