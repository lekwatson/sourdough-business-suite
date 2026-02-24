const CACHE_NAME = 'sourdough-suite-v15';
const ASSETS_TO_CACHE = [
  './',
  './index.html', // ตรวจสอบว่าไฟล์หลักของคุณชื่อนี้หรือไม่
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/vue@3/dist/vue.global.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Lato:wght@400;700;900&family=Noto+Sans+Thai:wght@400;700&display=swap'
];

// ติดตั้ง Service Worker และเก็บ Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ลบ Cache เก่าเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
                  .map((name) => caches.delete(name))
      );
    })
  );
});

// กลยุทธ์การดึงข้อมูล: Network First, Fallback to Cache
// เพื่อให้มั่นใจว่าจะได้ข้อมูลล่าสุดเสมอถ้ามีเน็ต แต่ถ้าไม่มีก็ยังใช้งานได้
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
