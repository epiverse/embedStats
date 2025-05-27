console.log(`embedStats index.js initiatized at \n${Date()}`);


(async function() { // keeping interactions within annonymous async function :-P
    
    // load dependencies
    const JSZip = await import('https://esm.sh/jszip@3.10.1').default
    //const embedStats = await import('./embedStats.mjs')
    const embedStats = await import('https://epiverse.github.io/embedStats/embedStats.mjs')
    
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
            msg.innerHTML=`<p style="color:maroon">Cliking again will load from the URL provided</p>`
        }else{ // input is open, load URL
            //let vectors = await embedStats.loadZippedFile(loadRemoteVectorsInput.value)
            embedStats
            let docs = await (await import('./embedStats.mjs')).unzipURL(loadRemoteVectorsInput.value)
            let vectors = docs.map(x=>x.embeddings)
            let vecTsv = embedStats.vec2tsv(vectors)
            debugger
        }
    }
    loadRemoteMeta.onclick=function(){
        loadRemoteMetaInput.hidden=!loadRemoteMetaInput.hidden
    }

    
})()
