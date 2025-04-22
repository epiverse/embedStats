console.log('embedStats.mjs modules');

async function unzipURL(url="https://raw.githubusercontent.com/epiverse/pathembed/refs/heads/main/tcgaSlideEmbeddings.json.zip") {
    const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default
    // xx = await (await import('./embedStats.mjs')).unzipURL()
    console.log(`unzipping from ${url}\nthis may take a few seconds, maybe a minute ...`)
    let response = await fetch(url)
    let data = await response.arrayBuffer()
    let zip = await JSZip.loadAsync(data);
    let filename = Object.entries(zip.files)[0][0]
    let file = zip.file(filename)
    let content = await file.async('string')
    if (content.match(/^[\[\{]/)) {
        // text content starts with '[' or '{'
        content = await JSON.parse(content)
        console.log('JSON text detected, ... parsed:')
    }
    return content
    console.log(`... ${content.length} embedded vectors loaded and unzipped`)
}

function saveFile(txt=':-)', fileName="hello.txt") {
    var bb = new Blob([txt]);
    var url = URL.createObjectURL(bb);
    var a = document.createElement('a')
    a.hidden = true
    document.body.appendChild(a)
    a.href = url;
    a.download = fileName;
    a.click()
    a.parentElement.removeChild(a)
    // cleanup
    return a
}

// convert mason format into tsv format

async function mason2tsv(attrs=['id', 'title', 'abstract', 'year', 'date', 'journalTitle', 'authors', 'keywords'], url='https://raw.githubusercontent.com/epiverse/pubCloud/refs/heads/main/dceg_publications_title-abstract_gemini.json') {
    // tsv = await (await import('https://epiverse.github.io/embedStats/embedStats.mjs')).mason2tsv(['id','title'])
    let docs
    if (typeof (url) == 'string') {
        docs = await (await fetch(url)).json()
    } else {
        docs = url
    }
    let tsv = attrs.join('\t')
    // table header
    let n = docs.length
    let m = attrs.length
    for (let i = 0; i < n; i++) {
        let row
        for (let j = 0; j < m; j++) {
            if (j == 0) {
                row = '\n'
            } else {
                row += '\t'
            }
            let el = docs[i].properties[attrs[j]]
            switch (typeof (el)) {
            case 'undefined':
                row += 'undefined';
                break;
            case 'object':
                if (attrs[j] == 'authors') {
                    row += el.map(x => x.name).join(',')
                } else if (attrs[j] == 'keywords') {
                    row += el.join(',')
                }
                break;
                case 'string':
                row+=el.replace(/[\n\t]/g,'')
                break;
                default:
                console.error('element type not recognized')
                break;
            }
        }
        tsv += row
    }
    return tsv
}

export {unzipURL, saveFile, mason2tsv}
