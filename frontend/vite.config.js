import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'NgopiKampus – Kafe Ramah Mahasiswa',
        short_name: 'NgopiKampus',
        description: 'Katalog kafe ramah mahasiswa di sekitar Undip Tembalang. Temukan tempat terbaik untuk belajar, skripsi, dan kerja kelompok.',
        theme_color: '#6f4e37',
        background_color: '#faf6f0',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'id',
        categories: ['education', 'food'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Cari Kafe',
            url: '/kafe',
            description: 'Lihat daftar kafe',
          },
          {
            name: 'Spot Finder',
            url: '/cari',
            description: 'Temukan kafe yang cocok',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // NetworkFirst untuk GET ke API
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api') ||
              (process.env.VITE_API_BASE_URL && url.href.startsWith(process.env.VITE_API_BASE_URL)),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400, // 24 jam
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // StaleWhileRevalidate untuk gambar eksternal
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  server: {
    port: 5173,
    host: '0.0.0.0', // izinkan perangkat satu Wi-Fi membuka dev server
  },
});
