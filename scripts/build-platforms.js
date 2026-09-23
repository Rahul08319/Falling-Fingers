/**
 * Multi-Platform Build Exporter
 * Generates standalone, ready-to-publish distributions for all 13 platforms.
 * ZERO Playgama or third-party middleware used.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const PLATFORMS_OUT_DIR = path.resolve(DIST_DIR, 'platforms');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'platforms') continue; // Avoid recursive copy
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function buildPlatforms() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  console.log('🚀 Packaging standalone distributions for 13 platforms...\n');

  if (fs.existsSync(PLATFORMS_OUT_DIR)) {
    fs.rmSync(PLATFORMS_OUT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(PLATFORMS_OUT_DIR, { recursive: true });

  const baseHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');

  // Platform 1: YouTube Playables (Certified v1)
  const ytDir = path.join(PLATFORMS_OUT_DIR, 'youtube-playables');
  copyDirRecursive(DIST_DIR, ytDir);
  // Ensure YouTube SDK script is in head
  let ytHtml = baseHtml;
  if (!ytHtml.includes('https://www.youtube.com/game_api/v1')) {
    ytHtml = ytHtml.replace('<head>', '<head>\n    <script src="https://www.youtube.com/game_api/v1"></script>');
  }
  fs.writeFileSync(path.join(ytDir, 'index.html'), ytHtml, 'utf8');
  fs.writeFileSync(
    path.join(ytDir, 'CSP_HEADERS.txt'),
    `default-src 'none'; script-src 'report-sample' 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.youtube.com/game_api/v0 https://www.youtube.com/game_api/v0/ https://www.youtube.com/game_api/v1 https://www.youtube.com/game_api/v1/; object-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data:; media-src 'self' blob:; font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' blob: data:; sandbox allow-pointer-lock allow-same-origin allow-scripts; base-uri 'self'; manifest-src 'self'; worker-src 'self' blob:`,
    'utf8'
  );
  console.log('  ✅ 1. YouTube Playables (dist/platforms/youtube-playables/)');

  // Platform 2: Facebook Instant Games
  const fbDir = path.join(PLATFORMS_OUT_DIR, 'facebook-instant');
  copyDirRecursive(DIST_DIR, fbDir);
  let fbHtml = baseHtml
    .replace('<script src="https://www.youtube.com/game_api/v1"></script>', '')
    .replace('<head>', '<head>\n    <script src="https://connect.facebook.net/en_US/fbinstant.7.1.js"></script>');
  fs.writeFileSync(path.join(fbDir, 'index.html'), fbHtml, 'utf8');
  fs.writeFileSync(
    path.join(fbDir, 'fbapp-config.json'),
    JSON.stringify(
      {
        instant_games: {
          platform_version: '7.1',
          orientation: 'PORTRAIT',
          navigation_menu_version: 'NAV_FLOATING',
          custom_update_templates: {},
        },
      },
      null,
      2
    ),
    'utf8'
  );
  console.log('  ✅ 2. Facebook Instant Games (dist/platforms/facebook-instant/)');

  // Platform 3: Poki
  const pokiDir = path.join(PLATFORMS_OUT_DIR, 'poki');
  copyDirRecursive(DIST_DIR, pokiDir);
  let pokiHtml = baseHtml
    .replace('<script src="https://www.youtube.com/game_api/v1"></script>', '')
    .replace('<head>', '<head>\n    <script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>');
  fs.writeFileSync(path.join(pokiDir, 'index.html'), pokiHtml, 'utf8');
  console.log('  ✅ 3. Poki (dist/platforms/poki/)');

  // Platform 4: CrazyGames
  const crazyDir = path.join(PLATFORMS_OUT_DIR, 'crazygames');
  copyDirRecursive(DIST_DIR, crazyDir);
  let crazyHtml = baseHtml
    .replace('<script src="https://www.youtube.com/game_api/v1"></script>', '')
    .replace('<head>', '<head>\n    <script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>');
  fs.writeFileSync(path.join(crazyDir, 'index.html'), crazyHtml, 'utf8');
  console.log('  ✅ 4. CrazyGames (dist/platforms/crazygames/)');

  // Platform 5: Yandex Games
  const yandexDir = path.join(PLATFORMS_OUT_DIR, 'yandex');
  copyDirRecursive(DIST_DIR, yandexDir);
  let yandexHtml = baseHtml
    .replace('<script src="https://www.youtube.com/game_api/v1"></script>', '')
    .replace('<head>', '<head>\n    <script src="https://yandex.ru/games/sdk/v2"></script>');
  fs.writeFileSync(path.join(yandexDir, 'index.html'), yandexHtml, 'utf8');
  console.log('  ✅ 5. Yandex Games (dist/platforms/yandex/)');

  // Platform 6: GameDistribution
  const gdDir = path.join(PLATFORMS_OUT_DIR, 'gamedistribution');
  copyDirRecursive(DIST_DIR, gdDir);
  let gdHtml = baseHtml
    .replace('<script src="https://www.youtube.com/game_api/v1"></script>', '')
    .replace(
      '<head>',
      `<head>\n    <script>window.GD_OPTIONS = { gameId: "falling-fingers", onEvent: function(event) {} };</script>\n    <script src="https://html5.api.gamedistribution.com/main.min.js"></script>`
    );
  fs.writeFileSync(path.join(gdDir, 'index.html'), gdHtml, 'utf8');
  console.log('  ✅ 6. GameDistribution (dist/platforms/gamedistribution/)');

  // Platform 7: Discord Activities
  const discordDir = path.join(PLATFORMS_OUT_DIR, 'discord');
  copyDirRecursive(DIST_DIR, discordDir);
  let discordHtml = baseHtml.replace('<script src="https://www.youtube.com/game_api/v1"></script>', '');
  fs.writeFileSync(path.join(discordDir, 'index.html'), discordHtml, 'utf8');
  fs.writeFileSync(
    path.join(discordDir, 'discord-activity.json'),
    JSON.stringify(
      {
        name: 'Falling Fingers',
        type: 'activity',
        handler_mode: 'embedded',
        supported_platforms: ['web', 'desktop', 'mobile'],
      },
      null,
      2
    ),
    'utf8'
  );
  console.log('  ✅ 7. Discord Activities (dist/platforms/discord/)');

  // Platform 8: JioGames
  const jioDir = path.join(PLATFORMS_OUT_DIR, 'jiogames');
  copyDirRecursive(DIST_DIR, jioDir);
  let jioHtml = baseHtml.replace('<script src="https://www.youtube.com/game_api/v1"></script>', '');
  fs.writeFileSync(path.join(jioDir, 'index.html'), jioHtml, 'utf8');
  console.log('  ✅ 8. JioGames (dist/platforms/jiogames/)');

  // Platform 9: Y8 / ID.net
  const y8Dir = path.join(PLATFORMS_OUT_DIR, 'y8');
  copyDirRecursive(DIST_DIR, y8Dir);
  let y8Html = baseHtml
    .replace('<script src="https://www.youtube.com/game_api/v1"></script>', '')
    .replace('<head>', '<head>\n    <script src="https://cdn.y8.com/api/sdk.js"></script>');
  fs.writeFileSync(path.join(y8Dir, 'index.html'), y8Html, 'utf8');
  console.log('  ✅ 9. Y8 / ID.net (dist/platforms/y8/)');

  // Platform 10: Lagged
  const laggedDir = path.join(PLATFORMS_OUT_DIR, 'lagged');
  copyDirRecursive(DIST_DIR, laggedDir);
  let laggedHtml = baseHtml
    .replace('<script src="https://www.youtube.com/game_api/v1"></script>', '')
    .replace('<head>', '<head>\n    <script src="https://lagged.com/api/v1/lagged.js"></script>');
  fs.writeFileSync(path.join(laggedDir, 'index.html'), laggedHtml, 'utf8');
  console.log('  ✅ 10. Lagged (dist/platforms/lagged/)');

  // Platform 11: Microsoft Store (PWA)
  const msDir = path.join(PLATFORMS_OUT_DIR, 'microsoft-store');
  copyDirRecursive(DIST_DIR, msDir);
  let msHtml = baseHtml
    .replace('<script src="https://www.youtube.com/game_api/v1"></script>', '')
    .replace('<head>', '<head>\n    <link rel="manifest" href="./manifest.webmanifest">');
  fs.writeFileSync(path.join(msDir, 'index.html'), msHtml, 'utf8');
  fs.writeFileSync(
    path.join(msDir, 'manifest.webmanifest'),
    JSON.stringify(
      {
        name: 'Falling Fingers',
        short_name: 'FallingFingers',
        description: 'A fast, tactile arcade game built with Apple Design precision.',
        start_url: './index.html',
        display: 'standalone',
        background_color: '#1d1d1f',
        theme_color: '#0066cc',
        icons: [
          { src: './favicon.ico', sizes: '64x64 32x32 24x24 16x16', type: 'image/x-icon' },
        ],
      },
      null,
      2
    ),
    'utf8'
  );
  fs.writeFileSync(
    path.join(msDir, 'sw.js'),
    `self.addEventListener('install', (e) => { e.waitUntil(caches.open('falling-fingers-v1').then((c) => c.addAll(['./', './index.html']))); });
self.addEventListener('fetch', (e) => { e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request))); });`,
    'utf8'
  );
  console.log('  ✅ 11. Microsoft Store PWA (dist/platforms/microsoft-store/)');

  // Platform 12: Huawei & Xiaomi Quick Games
  const qgDir = path.join(PLATFORMS_OUT_DIR, 'quickgame-huawei-xiaomi');
  copyDirRecursive(DIST_DIR, qgDir);
  let qgHtml = baseHtml.replace('<script src="https://www.youtube.com/game_api/v1"></script>', '');
  fs.writeFileSync(path.join(qgDir, 'index.html'), qgHtml, 'utf8');
  fs.writeFileSync(
    path.join(qgDir, 'manifest.json'),
    JSON.stringify(
      {
        package: 'com.fallingfingers.game',
        name: 'Falling Fingers',
        versionName: '1.0.0',
        versionCode: 1,
        minPlatformVersion: 1070,
        icon: '/favicon.ico',
        features: [{ name: 'system.prompt' }],
        display: {
          orientation: 'portrait',
          themeMode: 1,
        },
      },
      null,
      2
    ),
    'utf8'
  );
  console.log('  ✅ 12. Huawei & Xiaomi Quick Games (dist/platforms/quickgame-huawei-xiaomi/)');

  // Platform 13: MSN & Reddit Games
  const msnDir = path.join(PLATFORMS_OUT_DIR, 'msn-reddit');
  copyDirRecursive(DIST_DIR, msnDir);
  let msnHtml = baseHtml.replace('<script src="https://www.youtube.com/game_api/v1"></script>', '');
  fs.writeFileSync(path.join(msnDir, 'index.html'), msnHtml, 'utf8');
  console.log('  ✅ 13. MSN & Reddit Games (dist/platforms/msn-reddit/)');

  console.log('\n✨ All 13 standalone platform versions generated successfully in dist/platforms/!\n');
}

buildPlatforms();
