console.log(`embedStats.mjs modules imported\n${Date()}`);
async function unzipURL(url="https://raw.githubusercontent.com/epiverse/pathembed/refs/heads/main/tcgaSlideEmbeddings.json.zip") {
    //const localForage = await import("https://esm.sh/localforage")
    const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default
    // xx = await (await import('./embedStats.mjs')).unzipURL()
    console.log(`unzipping from ${url}\nthis may take a few seconds, maybe a minute ...`)
    msg.value = `unzipping from ${url}\nthis may take a few seconds, maybe a minute ...`
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
// tsv = await (await import('https://epiverse.github.io/embedStats/embedStats.mjs')).masonMeta2tsv(['id','title'])
async function masonMeta2tsv(attrs=['id', 'title', 'abstract', 'year', 'date', 'journalTitle', 'authors', 'keywords'], url='https://raw.githubusercontent.com/epiverse/pubCloud/refs/heads/main/dceg_publications_title-abstract_gemini.json') {
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
                row += el.replace(/[\n\t]/g, '')
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

// simple vectors to tsv conversion
function vec2tsv(vec) {
    return vec.map(v => v.join('\t')).join('\n')
}
// simple tsv to vectors conversion
function tsv2vec(tsv) {
    return tsv.split(/\n/).map(x => parseFloat(x.split(/\t/)))
}
// load Demo vectors, default from TCGA reports
async function demoVectors(url='https://dl.dropboxusercontent.com/scl/fi/7x2o8900hw3psxaoql7uj/embeddings_9523.tsv?rlkey=pctxu60c39ygq71jw2yr3e06y&st=kd2tz766&dl=0') {
    return await embedStats.unzipURL(url)
}

//txt = await (await import('https://epiverse.github.io/embedStats/embedStats.mjs')).readTextFile()
async function readTextFile(fun=console.log) {
    const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default
    let loadFile = document.createElement('input')
    loadFile.type = 'file';
    loadFile.hidden = true;
    document.body.appendChild(loadFile);
    loadFile.onchange = evt => {
        let fr = new FileReader();
        fr.onload = function() {
            fun(fr.result)
            loadFile.parentElement.removeChild(loadFile)
            // cleanup
        }
        fr.readAsText(loadFile.files[0]);
    }
    loadFile.click()
}

async function loadZippedFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip';

    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        try {
            const buffer = await file.arrayBuffer();
            const zip = await JSZip.loadAsync(buffer);
            // Process the zip object here
            // Example: Loop through files in the zip
            zip.forEach( (relativePath, zipEntry) => {
                console.log(zipEntry.name);
                // Access content of each file using zipEntry.async('text') or zipEntry.async('arraybuffer')
            }
            );
        } catch (error) {
            throw new Error('Error loading zip file:',error);
        }
    }
    ;
    input.click();
}

// using native file api
async function extractFirstTextFromZipViaPicker() {
    // handles tsv, csv, text, txt, json 
    const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default
    // 1. Check for Native File System API support
    if (!window.showOpenFilePicker) {
        alert('Native File System API is not supported in this browser. Requires Chrome, Edge, Opera, or compatible browsers on a secure connection (HTTPS/localhost).');
    }

    try {
        // 3. Show the file picker, requesting a single .zip file
        const [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: 'ZIP Archives',
                accept: {
                    'application/zip': ['.zip']
                }
            }, ],
            multiple: false // Ensure only one file is selected
        });

        // 4. Get the File object from the handle
        const file = await fileHandle.getFile();
        // 5. Read the file content as an ArrayBuffer (needed by JSZip)
        console.log(`Reading file: ${file.name}`);
        const arrayBuffer = await file.arrayBuffer();
        // 6. Load the zip file using JSZip
        console.log('Loading zip content...');
        const zip = await JSZip.loadAsync(arrayBuffer);
        // 7. Find the first file ending in .txt (case-insensitive)
        let firstTextFileEntry = null;
        const filePromises = [];
        // To handle async operations within the loop if needed
        // JSZip's zip.file(/regex/) is efficient for finding matches
        //const textFileEntries = zip.file(/.+\.[cjnostvx]{3,4}$/i); // Find files ending in .txt, .tsv, .csv or .json
        const textFileEntries = zip.file(/.*/);
        // Find files ending in .txt, .tsv, .csv or .json

        for (const entry of textFileEntries) {
            if (!entry.dir) {
                // Make sure it's not a directory named something.txt/
                firstTextFileEntry = entry;
                console.log(`Found text file: ${entry.name}`);
                break;
                // Stop after finding the first one
            }
        }

        // 8. Extract content if a text file was found
        if (firstTextFileEntry) {
            console.log(`Extracting content from: ${firstTextFileEntry.name}...`);
            let textContent = await firstTextFileEntry.async('string');
            if (textContent.match(/^[\[\}]/)) {
                // if JSON
                textContent = JSON.parse(textContent)
            }
            console.log('Extraction successful.');
            return textContent;
        } else {
            console.log('No .txt file found within the zip archive.');
            return null;
            // Indicate that no suitable file was found
        }

    } catch (err) {
        // 9. Handle errors, specifically user cancellation
        if (err.name === 'AbortError') {
            // This error occurs if the user closes the file picker dialog
            console.log('File selection canceled by the user.');
            return null;
            // Return null to indicate cancellation, not an unexpected error
        } else {
            // Log and re-throw other errors
            console.error('Error during zip file processing:', err);
            throw new Error(`Failed to process zip file: ${err.message}`);
        }
    }
}

// creates tsv metadata text file wit
// convert docs into tsv metadata
// automatically checks for 'properties'
function docs2meta(docs, attrs) {
    if (docs[0].properties) {
        // if attributes stacked under properties
        let props = Object.keys(docs[0].properties)
        docs.forEach( (d, i) => {
            props.forEach( (p, j) => {
                docs[i][p] = d.properties[p]
            }
            )
        }
        )
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
            let el = docs[i][attrs[j]]
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
                row += el.replace(/[\n\t]/g, '')
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

//const localForage = (await import("https://esm.sh/localforage")).default
async function localDrive(cmd='localDrive', db, opts) {
    console.log(`localDrive running\n${Date()}`)
    const localforage = (await import("https://esm.sh/localforage")).default
    let localDrive = await localforage.createInstance({
      name: 'localDrive'
    })
    let uuid = crypto.randomUUID()
    //----------------------
    switch (cmd) {
    case 'localDrive':
        // initialization
        await localDrive.setItem(uuid,
                {
                   date:Date.now(),
                   cmd:cmd,
                   uuid:uuid,
                   opts:opts
                }
            )
        //debugger
        break;
    //----------------------
    case 'index_vectors':
            let vectors = await localforage.createInstance({name:'vectors'})
            let vectorSpecs = await localforage.createInstance({name:'vectorSpecs'})
        
        let specs = {
            uuid:uuid,
            n:db.length,
            m:db[0].length,
            opts:opts
        };
        await vectors.setItem(uuid,db);
        await vectorSpecs.setItem(uuid,specs);
        await localDrive.setItem(uuid,Date.now());
        //break;
    default:
        console.log(`command "${cmd}" not found`);
    }
    return 
}

export {unzipURL, saveFile, masonMeta2tsv, readTextFile, loadZippedFile, extractFirstTextFromZipViaPicker, docs2meta, vec2tsv, tsv2vec, demoVectors, localDrive}
