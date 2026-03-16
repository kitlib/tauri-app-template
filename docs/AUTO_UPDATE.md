# Auto Update Configuration

This guide explains how to configure automatic updates for your Tauri application.

## Prerequisites

1. Your app must be published to GitHub Releases
2. You need to generate a signing key pair for secure updates

## Step 1: Generate Signing Keys

Run the following command to generate a key pair:

```bash
pnpm tauri signer generate -w ~/.tauri/myapp.key
```

This will output:
- **Private key**: Saved to `~/.tauri/myapp.key` (keep this secret!)
- **Public key**: A string starting with `dW50cnVzdGVkIGNvbW1lbnQ6...`

## Step 2: Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

1. `TAURI_SIGNING_PRIVATE_KEY` - Content of `~/.tauri/myapp.key`
2. `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` - Password you set (if any)

## Step 3: Update tauri.conf.json

Replace the placeholder in `src-tauri/tauri.conf.json`:

```json
{
  "plugins": {
    "updater": {
      "pubkey": "YOUR_PUBLIC_KEY_HERE",
      "endpoints": [
        "https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest/download/latest.json"
      ],
      "windows": {
        "installMode": "passive"
      }
    }
  }
}
```

Replace:
- `YOUR_PUBLIC_KEY_HERE` with the public key from Step 1
- `YOUR_USERNAME/YOUR_REPO` with your GitHub repository path

## Step 4: Test the Update Flow

1. **Build and release version 0.1.0:**
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

2. **Update version to 0.1.1** in `src-tauri/tauri.conf.json`

3. **Build and release version 0.1.1:**
   ```bash
   git tag v0.1.1
   git push origin v0.1.1
   ```

4. **Test:** Run the 0.1.0 installer - it should detect and offer to install 0.1.1

## How It Works

1. On app startup, `UpdaterDialog` component checks for updates
2. If a new version is found, a dialog appears with release notes
3. User can install immediately or dismiss
4. After download, the app automatically restarts with the new version

## Update Check Behavior

- Checks on app startup
- Compares current version with GitHub releases
- Only shows dialog if a newer version exists
- Downloads are signed and verified for security

## Troubleshooting

**Update check fails:**
- Verify the `endpoints` URL is correct
- Check that `latest.json` exists in your release assets
- Ensure the public key matches your private key

**Signature verification fails:**
- Make sure you're using the correct key pair
- Verify GitHub Actions has the right private key secret

**No update detected:**
- Confirm the version in `tauri.conf.json` is lower than the released version
- Check that the release is published (not draft)
