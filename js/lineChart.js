//Graph CSV data using chart.js

async function getData(){
    const response = await fetch('data/results-data.csv');
    const data = await response.text(); //CSV --> Text File

    const xTime = []; //x-axis label = time values
     //y-axis label = water values
    const yCFWater = [];            //Central Fan
    const yFBWater = [];            //Fan & Branches
    const yControlWater = [];       //Control
    const yCFBWater = [];           //Central Fan + Bag
    const yFBBWater = [];           //Fan & Branches + Bag

    const table = data.split('\n').slice(1);    //Split by line and remove the 0th row

    table.forEach(row => {              //Operate on each row
        const columns = row.split(','); //Split each row into columns
        const time = columns[0];       //Assign time value
        xTime.push(time);              //Push year value into xTime array

        const cfWater = columns[1];          //Water collection value
        yCFWater.push(cfWater);              //Push water value into yCFWater array

        const fbWater = columns[2];          //Water collection value
        yFBWater.push(fbWater);              //Push water value into yFBWater array

        const controlWater = columns[3];          //Water collection value
        yControlWater.push(controlWater);              //Push water value into yControlWater array

        const cfbWater = columns[4];          //Water collection value
        yCFBWater.push(cfbWater);              //Push water value into yCFBWater array

        const fbbWater = columns[5];          //Water collection value
        yFBBWater.push(fbbWater);              //Push water value into yFBBWater array
  
    });

    return {xTime, yCFWater, yFBWater, yControlWater, yCFBWater, yFBBWater};
}

async function createChart(){
    const data = await getData();        //createChart() will await getData()
    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.xTime,
            datasets: [{
                label: `Central Fan Design`,
                data: data.yCFWater,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 1
            },
            {
                label: `Fan & Branches Design`,
                data: data.yFBWater,
                backgroundColor: 'rgba(255, 128, 0, 0.2)',
                borderColor: 'rgba(255, 128, 0, 1)',
                borderWidth: 1
            },
            {
                label: `Control Design`,
                data: data.yControlWater,
                backgroundColor: 'rgba(255, 255, 0, 0.2)',
                borderColor: 'rgba(255, 255, 0, 1)',
                borderWidth: 1
            },
            {
                label: `Central Fan + Bag Design`,
                data: data.yCFBWater,
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                borderColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 1
            },
            {
                label: `Fan & Branches + Bag Design`,
                data: data.yFBBWater,
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                borderColor: 'rgba(0, 0, 255, 1)',
                borderWidth: 1
            },]
        },
        
        options: {
            responsive: true,                   // Re-size based on screen size
            scales: {                           // x & y axes display options
                x: {
                    title: {
                        display: true,
                        text: 'Time (Day - AM/PM)',
                        font: {
                            size: 20
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: `Water Collected (mL)`,
                        font: {
                            size: 20
                        },
                    }
                }
            },
            plugins: {                          // title and legend display options
                title: {
                    display: true,
                    text: `Device Transpired Water Collection Over Time`,
                    font: {
                        size: 24
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}


createChart();