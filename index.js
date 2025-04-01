console.log(`embedStats index.js initiatized at \n${Date()}`);

//const JSZip = await import('https://esm.sh/jszip@3.10.1').default

(async function() { // keeping interactions within annonymous async function :-P
    
    // load dependencies
    const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default
    
    // ...
    loadLocal.onclick = function() {
        console.log('Load local file',JSZip)
    }
})()
