console.log(`embedStats index.js initiatized at \n${Date()}`);


(async function() { // keeping interactions within annonymous async function :-P
    
    // load dependencies
    const JSZip = await import('https://esm.sh/jszip@3.10.1').default
    const embedStats = await import('./embedStats.mjs')
    
    // setting the stage
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    await delay(1000)
    loadRemoteVectorsInput.hidden=true
    loadRemoteMetaInput.hidden=true
    
    // set onclick open/close url input
    loadRemoteVectors.onclick=async function(){
        // loadRemoteVectorsInput.hidden=!loadRemoteVectorsInput.hidden
        if(loadRemoteVectorsInput.hidden){ // input is close, open it
            loadRemoteVectorsInput.hidden=false
            loadRemoteVectorsInput.value='https://raw.githubusercontent.com/epiverse/pathembed/refs/heads/main/tcgaPathReports.json.zip'
        }else{ // input is open, load URL
            //let vectors = await embedStats.loadZippedFile(loadRemoteVectorsInput.value)
            let docs = await (await import('./embedStats.mjs')).unzipURL(loadRemoteVectorsInput.value)
            let vectors = docs.map(x=>x.embeddings).map(x=>x.join('\t'))
            debugger
        }
    }
    loadRemoteMeta.onclick=function(){
        loadRemoteMetaInput.hidden=!loadRemoteMetaInput.hidden
    }

    
})()
