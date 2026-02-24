// เปลี่ยนชื่อเวอร์ชันทุกครั้งที่มีการแก้ไขโค้ด เพื่อบังคับอัปเดต Browser
const CACHE_NAME = 'sourdough-v2';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// ติดตั้งและเก็บ Cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting(); // บังคับให้เริ่มทำงานทันที
});

// จัดการการดึงข้อมูล
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // คืนค่าจาก Cache ถ้ามี หรือไปโหลดจาก Network
            return response || fetch(event.request).catch(() => {
                // ถ้า Offline และหาไฟล์ไม่เจอ ให้ส่งหน้าหลักไป
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

// ลบ Cache เก่า
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim(); // ควบคุมหน้าเว็บทันที
});
