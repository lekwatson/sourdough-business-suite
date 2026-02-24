const CACHE_NAME = 'sourdough-v3'; // เปลี่ยนเวอร์ชันเพื่อล้าง Cache เก่า
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// ติดตั้งและเก็บ Cache ไฟล์พื้นฐาน
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// ดึงข้อมูล: เน้นดึงจาก Network ก่อน ถ้าไม่มีค่อยใช้ Cache (Network First Strategy)
// วิธีนี้จะช่วยให้คุณอัปเดตโค้ดแล้วเห็นผลทันทีหากมีเน็ต
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});

// ล้าง Cache รุ่นเก่าออกไป
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
    return self.clients.claim();
});
