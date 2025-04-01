console.log('embedStats.mjs modules');

const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default

async function unzipURL(url="https://raw.githubusercontent.com/epiverse/pathembed/refs/heads/main/tcgaSlideEmbeddings.json.zip"){
    // xx = await (await import('./embedStats.mjs')).unzipURL()
    console.log(`unzipping from ${url}\nthis may take a few seconds, maybe a minute ...`)
    let response = await fetch(url)
    let data = await response.arrayBuffer()
    let zip = await JSZip.loadAsync(data);
    let filename=Object.entries(zip.files)[0][0]
    let file = zip.file(filename)
    let content = JSON.parse(await file.async('string'))
    console.log(`... ${content.length} embedded vectors loaded and unzipped`)
    return await content
}

export{
    unzipURL
}