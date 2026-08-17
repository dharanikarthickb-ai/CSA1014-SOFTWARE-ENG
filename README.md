# Smart University Campus Resource Management System — Demo

A minimal full-stack demo used to illustrate the **Git version-control workflow**
and **Docker containerization** for the Smart Campus project.

- **backend/** — Node.js + Express API serving mock IoT/resource data
  (rooms, labs, energy readings, ML-style predictive alerts)
- **frontend/** — Static dashboard (HTML/CSS/JS) that polls the API and
  renders resource status, energy usage, and alerts
- **docker-compose.yml** — Runs both services together on one bridge network

This is intentionally lightweight: mock data instead of a real database and
real IoT sensors, so the focus stays on demonstrating the dev workflow
(git branching/commits) and the deployment workflow (Docker build/run).

---

## 1. Running it locally (no Docker)

```bash
# backend
cd backend
npm install
npm start          # runs on http://localhost:5000

# in a second terminal - frontend
cd frontend
python3 -m http.server 8080   # or any static file server
# open http://localhost:8080
```

## 2. Running it with Docker

```bash
# from the project root (where docker-compose.yml lives)
docker compose build
docker compose up -d

# backend:  http://localhost:5000/api/resources
# frontend: http://localhost:8080

docker compose ps        # see running containers
docker compose logs -f   # tail logs
docker compose down      # stop and remove containers
```

Or build/run each service individually without compose:

```bash
docker build -t smart-campus-backend ./backend
docker run -d -p 5000:5000 --name campus-backend smart-campus-backend

docker build -t smart-campus-frontend ./frontend
docker run -d -p 8080:80 --name campus-frontend smart-campus-frontend
```

---

## 3. Demonstrating Git operations

A typical workflow you can screenshot/log for your report:

```bash
# 1. Initialize repo and make the first commit
git init
git add .
git commit -m "Initial commit: scaffold backend, frontend, docker setup"

# 2. Create a feature branch for new work
git checkout -b feature/energy-alerts

# ... edit backend/server.js to add a new alert endpoint ...

git add backend/server.js
git commit -m "Add predictive maintenance alert endpoint"

# 3. Push to a remote (after creating an empty repo on GitHub/GitLab)
git remote add origin https://github.com/<your-username>/smart-campus-demo.git
git branch -M main
git push -u origin main
git push origin feature/energy-alerts

# 4. Merge the feature back into main
git checkout main
git merge feature/energy-alerts
git push origin main

# 5. Tag a release
git tag -a v1.0-demo -m "Demo release for SRS validation milestone"
git push origin v1.0-demo

# 6. Inspect history
git log --oneline --graph --all
```

Suggested branch naming for the fuller project, if you extend this demo:
- `feature/iot-data-ingestion`
- `feature/anomaly-detection-model`
- `feature/faculty-dashboard`
- `bugfix/energy-reading-timestamp`

---

## 4. Suggested next steps to extend this demo

- Swap the in-memory arrays in `server.js` for a real database (e.g.
  PostgreSQL or MongoDB) and add it as a third service in `docker-compose.yml`.
- Add a simple anomaly-detection stub (e.g. a threshold check on `kwh`) to
  connect back to the AI/ML prediction requirement in your SRS.
- Add a `.github/workflows/ci.yml` GitHub Actions file that runs `docker
  compose build` on every push, to show CI/CD alongside git and Docker.
