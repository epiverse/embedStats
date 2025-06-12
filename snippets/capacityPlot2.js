const Plotly = (await import('https://cdn.jsdelivr.net/npm/plotly.js-dist@3.0.1/+esm')).default;
const localforage = (await import("https://esm.sh/localforage")).default;
const cuts = await localforage.getItem('cuts');
async function capacityPlot(div) {
    /*
    let x = [...Array(131)].map((x,i)=>i/100)
    let y = x.map((xi,i)=>disCut(cDist,xi))
    */
    if (!document.getElementById('capacityPlotDiv')) {
        div = document.createElement('div')
        div.id = 'capacityPlotDiv'
        document.body.appendChild(div)
    } else {
        div = document.getElementById('capacityPlotDiv')
    }

    cuts.y = cuts.y.map(yi => yi - 9523)
    // to exclude diagonal identities
    let countTrace = {
        x: cuts.x,
        y: cuts.y,
        type: 'scatter',
        mode: 'lines',
        name: 'count',
        //yaxis: 'y1'
    }
    let layout = {
        autosize: false,
        width: 800,
        height: 800,
        title: 'Embedded Pathology Reports<br>(raw data)',
        //showlegend:true,
        xaxis: {
            type:'log',
            title: {
                text: 'Neighborhood Radius, r'
            },
            showgrid: true,
            gridcolor: '#ccc',
            gridwidth: 2,
        },
        
        yaxis: {
            showgrid: true,
            gridcolor: '#ccc',
            gridwidth: 2,
            type:'log',
            title: {
                text: 'Number of neighborhoods, N(r)'
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
    Plotly.newPlot(div, [countTrace], layout)
}
await capacityPlot()
