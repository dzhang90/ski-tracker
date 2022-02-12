
const token = 'keygzU0HAeKXxYTp2'; // private API key (do not use for public sites)
const id = 'appNUvms2uZ6Vwf8z';
var Airtable = require('airtable');

var days = [];
var skiCount = [];
var recordId = [];

function setupAirTable() {

    console.log("running first");

    // Set up Airtable
    Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: token
    });

    var base = Airtable.base(id);
    
    // Pull Airtable data into arrays
    base('Tracker').select({
        // Selecting the first 100 records in Grid view:
            maxRecords: 100,
            // pageSize: 7,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            
            records.forEach(function(record) {
              try {
                days.push(record.get('Days'));
                skiCount.push(record.get('Count'));
                recordId.push(record.id);
                daysLen++;
                console.log(recordId);
              } catch { return; }
              
                // document.write(record.get('Days') + ': ' + record.get('Notes'));
                // document.write('<br>');
            });
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
          
            fetchNextPage();
            
            populateVisualizationTable();    
        }, function done(err) {
            if (err) { console.error(err); return; }
    });
    // console.log(days);
}

////////////////////////////// charting below

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

var dataTable;

// Set a callback to run when the Google Visualization API is loaded.
// google.charts.setOnLoadCallback(setupAirTable);
google.charts.setOnLoadCallback(instantiateVisualizationTable);
google.charts.setOnLoadCallback(setupAirTable);
google.charts.setOnLoadCallback(setupButtons);
// google.charts.setOnLoadCallback(drawChart);
// google.charts.setOnLoadCallback(drawChart2);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.


function instantiateVisualizationTable () {
  dataTable = new google.visualization.DataTable();
  dataTable.addColumn('string', 'Days');
  dataTable.addColumn('number', 'Count');
}

function populateVisualizationTable () {
  for (let i=0; i<days.length; i++) {
    dataTable.addRows([
        [days[i], skiCount[i]]
    ]);
  }

  drawChart();
  drawChart2();
}

function updateVisualizationTable () {
  let limit = dataTable.getNumberOfRows();
  for (let i=0; i<limit; i++) {
    dataTable.removeRow(0);   
  }

  populateVisualizationTable();
}

function drawChart() {

  // Set chart options
  var options = {title:'Percentage of Ski Days per Day of the Week',
                //  width:400,
                //  height:300,
                 is3D:true};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('pieChart'));
  chart.draw(dataTable, options);
}


// Stacked Bar Chart
function drawChart2() {

  // Set chart options
  var options2 = {title:'Number of Ski Days per Day of the Week',
            //   width:400,
            //   height:300,
              is3D:true,
              isStacked:false
              };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.BarChart(document.getElementById('barChart'));
  chart.draw(dataTable, options2);
}

/////////////////////////////////////

// Click events

function setupButtons() {
  var buttonMon = document.getElementById("buttonMonday");
  var buttonTues = document.getElementById("buttonTuesday");
  var buttonWed = document.getElementById("buttonWednesday");
  var buttonThurs = document.getElementById("buttonThursday");
  var buttonFri = document.getElementById("buttonFriday");
  var buttonSat = document.getElementById("buttonSaturday");
  var buttonSun = document.getElementById("buttonSunday");

  var buttonMonD = document.getElementById("buttonMondayDown");
  var buttonTuesD = document.getElementById("buttonTuesdayDown");
  var buttonWedD = document.getElementById("buttonWednesdayDown");
  var buttonThursD = document.getElementById("buttonThursdayDown");
  var buttonFriD = document.getElementById("buttonFridayDown");
  var buttonSatD = document.getElementById("buttonSaturdayDown");
  var buttonSunD = document.getElementById("buttonSundayDown");

  // plus a day
  buttonMon.addEventListener("click", function () {
    updateTableUp(0);
  });

  buttonTues.addEventListener("click", function () {
    updateTableUp(1);
  });

  buttonWed.addEventListener("click", function () {
    updateTableUp(2);
  });
  
  buttonThurs.addEventListener("click", function () {
    updateTableUp(3);
  });
  
  buttonFri.addEventListener("click", function () {
    updateTableUp(4);
  });
  
  buttonSat.addEventListener("click", function () {
    updateTableUp(5);
  });
  
  buttonSun.addEventListener("click", function () {
    updateTableUp(6);
  });

  // minus a day
  buttonMonD.addEventListener("click", function () {
    updateTableDown(0);
  });

  buttonTuesD.addEventListener("click", function () {
    updateTableDown(1);
  });

  buttonWedD.addEventListener("click", function () {
    updateTableDown(2);
  });
  
  buttonThursD.addEventListener("click", function () {
    updateTableDown(3);
  });
  
  buttonFriD.addEventListener("click", function () {
    updateTableDown(4);
  });
  
  buttonSatD.addEventListener("click", function () {
    updateTableDown(5);
  });
  
  buttonSunD.addEventListener("click", function () {
    updateTableDown(6);
  });
}

function updateTableUp (e) {
  var base = Airtable.base(id);
    
  base('Tracker').update([
    {
      "id": recordId[e],
      "fields": {
        "Count": skiCount[e] + 1
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function(record) {
      // console.log(record.get('Days'));
    });
  });
  // console.log(skiCount[e]);
  skiCount[e]++;
  // console.log(skiCount[e]);
  updateVisualizationTable();

}

function updateTableDown (e) {
  var base = Airtable.base(id);
    
  base('Tracker').update([
    {
      "id": recordId[e],
      "fields": {
        "Count": skiCount[e] - 1
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function(record) {
      // console.log(record.get('Days'));
    });
  });
  // console.log(skiCount[e]);
  skiCount[e]--;
  // console.log(skiCount[e]);
  updateVisualizationTable();

}

// async function updateTable (e){
//     var base = Airtable.base(id);
//     let table = base.getTable("Table 1");
//     let query = await table.selectRecordsAsync();
//     // console.log(query.records[e].id);
//     return query.records[e].id;
// }
// Only works in modules



//object.addEventListener("click", myScript);