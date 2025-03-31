console.log(`embedStats index.js initiatized at \n${Date()}`);

//const JSZip = await import('https://esm.sh/jszip@3.10.1').default

(async function() {
    // load dependencies
    const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default
    // ...
    loadLocal.onclick = function() {
        console.log('JSZip',JSZip)
    }
})()
