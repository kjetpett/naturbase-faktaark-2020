var map;

require([
  "esri/layers/FeatureLayer",
  "esri/dijit/FeatureTable",
  "dojo/dom",
  "dojo/parser",
  "dojo/on",
  "dojo/ready",
], function (
  FeatureLayer, FeatureTable,
  dom, parser, on, ready
) {

  parser.parse();

  ready(function(){

    // Create the feature layer
    var myFeatureLayer = new FeatureLayer("https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/california_census_blocks/FeatureServer/0", {
      mode: FeatureLayer.MODE_ONDEMAND,
      outFields:  ["NAME","GEOID","MTFCC","ALAND","AWATER"],
      visible: true,
      id: "fLayer"
    });

    myTable = new FeatureTable({
      featureLayer : myFeatureLayer,
      showGridMenu: false,
      hiddenFields: ["FID","C_Seq","Street"]  // field that end-user can show, but is hidden on startup
    }, "myTableNode");

    console.log("myTable");
    on(myTable, "load", function(evt){
      console.log("The load event - ", evt);
    });


    myTable.startup();


   
  });
});