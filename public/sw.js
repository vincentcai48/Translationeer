// const staticCache = "staticCache-v1.1";
// const apiCache = "apiCache-v1.0";
// const dbCache = "dbCache-v1.0";
// const allStaticAssets = ["index.html", "fallback.html"];

// var limitCacheSize = (name, maxSize) => {
//   caches.open(name).then((cache) => {
//     cache.keys().then((keys) => {
//       if (keys.length > maxSize) {
//         cache.delete(keys[0]).then(limitCacheSize(name, maxSize));
//       }
//     });
//   });
// };

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(staticCache).then((cache) => cache.addAll(allStaticAssets))
//   );
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((keys) => {
//       return Promise.all(
//         keys
//           .filter(
//             (key) => key != staticCache && key != apiCache && key != dbCache
//           )
//           .map((key) => caches.delete(key))
//       );
//     })
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cacheRes) => {
//       return (
//         cacheRes ||
//         fetch(event.request).then((resAsset) => {
//           const isFirestore = resAsset.url.includes("firestore");
//           var correctCache = isFirestore ? dbCache : apiCache;
//           var maxSize = isFirestore ? 10 : 15;
//           return caches.open(correctCache).then((cache) => {
//             cache.put(event.request.url, resAsset.clone());
//             limitCacheSize(correctCache, maxSize);
//             return resAsset;
//           });
//         })
//       );
//     })
//   );
// });
