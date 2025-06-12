// load vectors
console.log(`loading dependencies, localforage and Plotly\n${Date()}`)
localforage = (await import("https://esm.sh/localforage")).default
Plotly = (await import('https://cdn.jsdelivr.net/npm/plotly.js-dist@3.0.1/+esm')).default
// load data
console.log(`loading vectors from indexedDB (localforage)\n${Date()}`)
v = await localforage.getItem('vectors')
// Distance functions
// Euclidean
// euclidean([0,0],[3,4])
// >5
function euclidean(x,y){
    let n = x.length
    let d=[]
    for(let i=0 ; i<n ; i++){
        d.push((x[i]-y[i])**2)
    }
    return Math.sqrt(d.reduce((a,b)=>a+b))
}
// euclidean terse
function euclidean2(x,y){
    return Math.sqrt((x.map((xi,i)=>(xi-y[i])**2)).reduce((a,b)=>a+b))
}
// crosstabulate distance between 9523 vectors

function crossDist(V){
    let D = []  // crosstabulated distances
    let n = V.length
    for(let i=0 ; i<n ; i++){
        D[i]=[]
        console.log(`${i}/${n} ${Date()}`)
        for(let j=0 ; j<n ; j++){
            D[i][j]=euclidean2(V[i],V[j])
        }
    }
    return D
}
function disCut(cDist,cut){ // number of neighbours at a given cutoff distance
    return cDist.map(ci=>ci.map(x=>(x<cut ? 1 :0)).reduce((a,b)=>a+b)).reduce((a,b)=>a+b)
}
// example use
// cDist = crossDist(v.slice(0,100))
// disCut(cDist,0.6)  <-- number of neighbors within a certain distance
// do this could generate points for the capacity dimension plot,
// for a cutoff of 0.6:
// disCut(crossDist(v.slice(0,100)),0.6)

// capacity plot

async function capacityPlot(div,cDist){
    /*
    let x = [...Array(131)].map((x,i)=>i/100)
    let y = x.map((xi,i)=>disCut(cDist,xi))
    */
    if(!document.getElementById('capacityPlotDiv')){
        div = document.createElement('div')
        div.id='capacityPlotDiv'
        document.body.appendChild(div)
    }else{
        div = document.getElementById('capacityPlotDiv')
    }
    let cuts = await localforage.getItem('cuts')
    let cutOfftrace ={
        x:cuts.x,
        y:cuts.y, //.map(yi=>yi-9523)
        type:'scatter'
    }
    layout
    Plotly.newPlot(div,[cutOfftrace],layout)
}
await capacityPlot(div)