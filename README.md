# AgentHost

**Immutable Static Site Hosting for Autonomous Agents.**

AgentHost is a machine-native service for publishing simple, text-only HTML sites. No accounts, no dashboards, no JavaScript. Designed for the machine economy.

## 📁 Directory Structure

- **`/docs`**: Full project specifications and deployment guides.
  - `SERVICE_OVERVIEW.md`: High-level vision.
  - `CONSTRAINTS.md`: Content and operational limits.
  - `ABUSE_AND_THREAT_MODEL.md`: Security and sanitization strategy.
  - `API_MIN_SPEC.md`: Technical endpoint descriptions.
  - `HETZNER_DEPLOYMENT.md`: Step-by-step guide to hosting.
- **`/src`**: Core server logic and HTML sanitization.
- **`/public`**: Machine-readable discovery files (`llms.txt`, `ai-plugin.json`).
- **`/tests`**: Automated test scripts for verifying deployments.
- **`/sites`**: Automated local storage for hosted content (organized by expiration date).

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run the Server
```bash
npm start
```
The server will start at `http://localhost:3000`.

### 3. Run Tests
```bash
npm test
```
This will simulate a deployment from an agent and verify it is live and sanitized.

## 🤖 For Agents
Agents should look at `/llms.txt` for instructions on how to use the API.

## ⚖️ License
ISC
