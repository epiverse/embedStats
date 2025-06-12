const Plotly = (await import('https://cdn.jsdelivr.net/npm/plotly.js-dist@3.0.1/+esm')).default;
const localforage = (await import("https://esm.sh/localforage")).default;
const cuts = await localforage.getItem('cuts');
async function capacityPlot(div) {
    //const Plotly = (await import('https://cdn.jsdelivr.net/npm/plotly.js-dist@3.0.1/+esm')).default;
    //const cuts = await localforage.getItem('cuts');
    //const localforage = (await import("https://esm.sh/localforage")).default;
    /*
    let x = [...Array(1301)].map((x,i)=>i/1000)
    let y = x.map((xi,i)=>disCut(cDist,xi))
    */
    if (!document.getElementById('capacityPlotDiv')) {
        div = document.createElement('div')
        div.id = 'capacityPlotDiv'
        document.body.appendChild(div)
    } else {
        div = document.getElementById('capacityPlotDiv')
    }

    cuts.y=cuts.y.map(yi=>yi-9523) // to exclude diagonal identities
    let countTrace = {
        x: cuts.x,
        y: cuts.y,
        type: 'scatter',
        mode: 'lines',
        name: 'count',
        //yaxis: 'y1'
    }
    let ratioTrace = {
        //yaxis:'y2',
        name:'ratio',
        type:'scatter',
        mode:'lines',
        x: cuts.x,
        //y: cuts.y
        y: cuts.y.map((yi,i)=>(Math.log(yi)/(-Math.log(cuts.x[i])))),
    }
    let layout = {
        title:'Embedded Pathology Reports<br>(raw data)',
        //showlegend:true,
        xaxis: {
            title: {
                text: 'Neighborhood Radius (Euclidean)'
            },
        },
        yaxis: {
            //side:'right',
            title: {
                text: 'Number of neighborhoods'
            },
        },
        /*
        yaxis2: {
            side:'right',
            title:{
                text:'ratio limit'
            },
        }
        */
    }
    Plotly.newPlot(div, [countTrace,ratioTrace], layout)
}
await capacityPlot()
