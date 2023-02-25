//Register service worker

//check if service worker is suporrted
if("serviceWorker" in navigator){
//returns a promise
// try {
//     const reg = await navigator.serviceWorker.register("./sw.js")
//     if (reg){console.info("service worker reg", reg)}
// } catch (error) {
//     console.info("fail to register service worker", error)
// }
navigator.serviceWorker.register("./sw.js")
.then(reg=>{
    console.info("service worker reg", reg)
}).catch(err=>{
    console.info("fail to register service worker", err)
})
   
}else{//check the browser
    console.info("Service worker is not supoorted")
}