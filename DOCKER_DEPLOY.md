# Updating the Service on VPS

## Quick Update Steps

```bash
# 1. Navigate to your project directory
cd ~/pipedrive-apps/teamagenda-beta

# 2. Pull the latest changes from the repository
git pull origin main

# 3. Rebuild and restart the containers
docker compose -f teamagenda-beta.yml down
docker compose -f teamagenda-beta.yml up -d --build
```

## Detailed Update Process

### Step 1: SSH into Your VPS
```bash
ssh user@your-vps-ip
```

### Step 2: Navigate to Project Directory
```bash
cd ~/pipedrive-apps/teamagenda-beta
```

### Step 3: Pull Latest Changes
```bash
git pull origin main  # Pull from the main branch (or your deployment branch)
```

### Step 4: Check Docker Status (Optional)
```bash
docker compose -f teamagenda-beta.yml ps  # View running containers
```

### Step 5: Rebuild and Redeploy
```bash
docker compose -f teamagenda-beta.yml up -d --build
```

The flags mean:
- `-d` : Run containers in the background (detached mode)
- `--build` : Rebuild images before starting containers

### Step 6: Verify the Update (Optional)
```bash
docker compose -f teamagenda-beta.yml logs -f  # Follow logs in real-time
# Press Ctrl+C to exit
```

## Troubleshooting

### Check Container Logs
```bash
docker compose -f teamagenda-beta.yml logs [service-name]
```

### Stop All Services
```bash
docker compose -f teamagenda-beta.yml down
```

### Restart Services Without Rebuilding
```bash
docker compose -f teamagenda-beta.yml restart
```

### Full Restart (Clean)
```bash
docker compose -f teamagenda-beta.yml down
docker compose -f teamagenda-beta.yml up -d --build
```

## Notes
- Ensure you have sufficient disk space before rebuilding
- The `--build` flag rebuilds images, which may take some time
- Always test changes in a staging environment first
- Keep your VPS dependencies (Docker, Docker Compose) updated
