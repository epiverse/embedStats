console.log(`embedStats index.js initiatized at \n${Date()}`);

let embedAssembly = {}

async function doMsg(msgText='hello world :-) !', color="navy", msgDiv=document.querySelector('#msg')){
    // define assync delay
    msgDiv.style.color=color
    // console.log(Date())
    async function delay(ms=ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // add one letter at a setTimeout
    for(let i=0 ; i<msgText.length+1 ; i++){
        await delay(10)
        msgDiv.innerHTML=`> ${msgText.slice(0,i)}`
    }
}

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
            loadRemoteVectorsInput.value='https://raw.githubusercontent.com/epiverse/embedStats/refs/heads/main/vectorsTCGAreps.tsv.zip'
            //msg.innerHTML=`<p style="color:maroon">Cliking load again will load from the URL provided</p>`
            doMsg('Clicking again will load from the URL','darkred')
        }else{ // input is open, load URL
            //let vectors = await embedStats.loadZippedFile(loadRemoteVectorsInput.value)
            embedStats
            // check this is zipped
            if(loadRemoteVectorsInput.value.match(/\.zip$/g)){
                console.log(`unzipping remote vector file at ${loadRemoteVectorsInput.value}`)
                embedAssembly.vectors=await embedStats.unzipURL(loadRemoteVectorsInput.value)
                //debugger
            }
            /*
            let docs = await (await import('./embedStats.mjs')).unzipURL(loadRemoteVectorsInput.value)
            let vectors = docs.map(x=>x.embeddings)
            let vecTsv = embedStats.vec2tsv(vectors)
            */
            embedStats.fun_capacityDimension(embedAssembly)
        }
    }
    loadRemoteMeta.onclick=function(){
        loadRemoteMetaInput.hidden=!loadRemoteMetaInput.hidden
    }   
})()
