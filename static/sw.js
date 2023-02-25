console.info('Service worker')

//assets
const toCache = [
  '/dov-bear.gif',
  '/favicon.ico',
  '/offline.html',
  '/placeholder.png',
  '/polar-bear.png',
  '/styles.css',
  '/unplugged.png',
  '/manifest.json',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512.png',
  '/images/icons/icon-72x72.png',
  '/images/icons/icon-96x96.png',
  '/sw.js',
  '/reg_sw.js',
]

const assetCache = 'asset'
const contentCache = 'content'

//step 0 cache all static assets\
//broswer will tel teh even this the first time im installing
//take all the assets and save to the cache
//only trrigered once, cos installed alareay
//if you clerat the data then it will cache again
self.addEventListener('install', (event) => {
  console.info('Installing service worker')
  //install the asssets , wait till the promise resolve
  event.waitUntil(
    ///inside service worker reffers to the global cache from SW
    //if asset cache dont exit it will be created
    //add all the oitem inside to cache inside the assetCache
    caches.open(assetCache).then((cache) => cache.addAll(toCache)),
  )
})

//step 1 intercept the fetch event
//this event hold the req, and responds with something else
//fwd the req, if cannot then display offline page
self.addEventListener('fetch', (event) => {
  const req = event.request
  //check if the req is part of pur app asset
  //if theres is any resources thats inside teh asset, load from there
  //load from asset dont go to network
  if (toCache.find((v) => req.url.endsWith(v))) {
    return event.respondWith(
      caches.open(assetCache).then((cache) => {
        cache.match(req)
      })
    )
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        //we have the response
        //clone the response
        const copy = res.clone()
        //cache a copy of the response with the
        //request as the key
        event.waitUntil(
          caches.open(contentCache).then((cache) => cache.put(req, copy)),
        )
        //return the response to the browser
        return res
      })
      .catch((err) => {
        //network issue
        //check if iwe are loading our html, open our asset cache and find the offline page
        if (req.headers.get('Accept').includes('text/html')) {
          //check if we hv a a previous caache
          return (
            caches
              .open(contentCache)
              //attemp to match teh content with the req
              .then((cache) => cache.match(req))
              .then((res) => {
                if (!!res) return res
                return caches
                  .open(assetCache)
                  .then((cache) => cache.match('/offline.html'))
                //if resp is not null, match in cache
              })
          )
          // .then((cache) => cache.match('/offline.html'))
        }
        //otherwise u can get the page, load the other images
        //optherwise all other resource tyepe,
        //look it up in our asset cache
        return caches.open(assetCache).then((cache) => cache.match(req))
      }),
  )
})
