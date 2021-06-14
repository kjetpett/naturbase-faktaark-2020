require([
    "esri/config",
    "esri/geometry/Extent",
    // "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/Map",
    "esri/tasks/support/Query",
    "esri/tasks/QueryTask",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/geometry/SpatialReference",
    "esri/layers/TileLayer",
    "esri/views/MapView"],
    function (
        esriConfig,
        Extent,
        // FeatureLayer,
        GraphicsLayer,
        Map,
        Query,
        QueryTask,
        SimpleMarkerSymbol,
        SpatialReference,
        TileLayer,
        MapView) {
        esriConfig.apiKey = "AAPK861135bc1c2345a1a7c3924b8e8529d69o1ebnK0M-FC6d5XRaylr4i2I6TSWYJi5Pvn590sC5kGdAufxmk61Ly1kxaswr2N";
        /* exported basisKartUrl */
        var basisKartUrl = 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBasis/MapServer';

        var mapExtent = new Extent({
            'xmin': 200000,
            'ymin': 7000000,
            'xmax': 250000,
            'ymax': 7100000,
            'spatialReference': { 'wkid': 25833 }
        });

        const punktSymbol = {
            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
            style: "circle",
            color: [128, 255, 128],
            size: "11px",  // pixels
            outline: {  // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: 1  // points
            }
        };

        const omrSymbol = {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            color: [128, 255, 128, 0.8],
            outline: {
                // autocasts as new SimpleLineSymbol()
                color: [0, 0, 0],
                width: 1
            }
        };

        var tiledLayer = new TileLayer(basisKartUrl, {
            id: 'bakgrunnskart',
            showAttribution: true,
            format: 'jpeg',
            fadeOnZoom: true
        });

        var temaId = '9.545184_63.418554_3859'; // punkt
        // var temaId = '6.583852_58.097869_3531'; // omr
        // Create graphics layer and symbol to use for displaying the results of query
        var geometriGraphicsLayer = new GraphicsLayer();
        var observasjonerTableURL = "https://testarcgis02.miljodirektoratet.no/arcgis/rest/services/faktaark/artnasjonal/MapServer/2";
        var punktLayerURL = "https://testarcgis02.miljodirektoratet.no/arcgis/rest/services/faktaark/artnasjonal/MapServer/0";
        var omrLayerURL = "https://testarcgis02.miljodirektoratet.no/arcgis/rest/services/faktaark/artnasjonal/MapServer/1";

        var geometriQuery = new Query();
        geometriQuery.where = 'ArtNasjonalId =\'' + temaId + '\'';
        geometriQuery.outFields = ["*"];
        geometriQuery.returnGeometry = true;
        geometriQuery.outSpatialReference = { wkid: 25833 };

        var observasjonQuery = new Query();
        observasjonQuery.where = 'ArtNasjonalId =\'' + temaId + '\'';
        observasjonQuery.outFields = ["*"];
        observasjonQuery.returnGeometry = false;

        var punktQueryTask = new QueryTask({
            url: punktLayerURL
        });

        var omrQueryTask = new QueryTask({
            url: omrLayerURL
        });

        var observasjonQueryTask = new QueryTask({
            url: observasjonerTableURL
        })

        punktQueryTask.execute(geometriQuery).then(function (results) {
            if (results.features.length > 0) {
                featureTilSkjerm(results.features[0].attributes);
                var punktExtent = new Extent({
                    'xmin': results.features[0].geometry.x - 2000,
                    'ymin': results.features[0].geometry.y - 2000,
                    'xmax': results.features[0].geometry.x + 2000,
                    'ymax': results.features[0].geometry.y + 2000,
                    'spatialReference': { 'wkid': 25833 }
                });
                view.extent = punktExtent;
                results.features[0].symbol = punktSymbol;
                geometriGraphicsLayer.addMany(results.features);
                console.log(results.features);
            }
        });

        omrQueryTask.execute(geometriQuery).then(function (results) {
            if (results.features.length > 0) {
                let omr = {
                    type: "polygon", // autocasts as new Polygon()
                    rings: results.features[0].geometry.rings
                };
                view.extent = results.features[0].geometry.extent;
                results.features[0].symbol = omrSymbol;
                geometriGraphicsLayer.addMany(results.features);
                console.log(results.features);
            }
        });

        observasjonQueryTask.execute(observasjonQuery).then(function (results) {
            var columns = [];
            for (i = 0; i < funnFeltdefinisjoner.length; i++ ) {
                columns.push(funnFeltdefinisjoner[i].navn);
            }
            var data = [];
            for (i = 0; i < results.features.length; i++) {
                datarow = [];
                attributes = results.features[i].attributes;
                for (j = 0; j < columns.length; j++) {
                    attributevalue = attributes[columns[j]];
                    attributevalue = formatterData(attributevalue, funnFeltdefinisjoner[j].type);
                    datarow.push(attributevalue);
                }
                data.push(datarow);
            }

            new gridjs.Grid({
                columns: columns,
                // resizable: true,
                style: {
                    table: {
                        'white-space': 'nowrap'
                    },
                    td: { 
                        'padding': '0.5em'                        
                    },                    
                    th: { 
                        'padding': '0.5em'                   
                    }
                },
                pagination: {
                    limit: 10
                },
                search: true,
                data: data,
                resizable: false,
                // sort: true,
                language: {
                    'search': {
                      'placeholder': '🔍 Søkefilter...'
                    },
                    'pagination': {
                      'previous': 'forrige',
                      'next': 'neste',
                      'showing': 'Viser',
                      'results': () => 'rader',    
                      'of': 'av',
                      'to': 'til'
                    },
                    sort: {
                        sortAsc: 'Sorter stigende',
                        sortDesc: 'Sorter synkende',
                    },
                }
            }).render(document.getElementById("wrapper"));
            // console.log(results);
            // if (results.features.length > 0) {
            // }
        });

        // const punktLayer = new FeatureLayer({
        //     url: punktLayerURL,
        //     definitionExpression: 'ID =\'' + temaId + '\'',
        //     outFields: ["*"]
        // });

        // const kommTable = new FeatureLayer({
        //     url: kommTable,
        //     outFields: ["*"],
        //     // definitionExpression: 'ID =\'' + temaId + '\''
        // });

        // punktLayer.queryFeatures(finnObjektkQuery);

        const map = new Map({
            layers: [tiledLayer, geometriGraphicsLayer]
        });

        const view = new MapView({
            map: map,
            container: "map",
            constraints: {
                snapToZoom: false
            },
            spatialReference: {
                wkid: 25833
            },
            extent: mapExtent
        });

        map.allLayers.on("change", function (event) {
            console.log("Layer added: ", event.added);
            console.log("Layer removed: ", event.removed);
            console.log("Layer moved: ", event.moved);
        });

        function featureTilSkjerm(featureAttributes) {
            console.log(feltDefinisjoner1);
            for (i = 0; i < feltDefinisjoner1.length; i++) {
                var value = formatterData(featureAttributes[feltDefinisjoner1[i].navn], feltDefinisjoner1[i].type);
                $("#innhold1").append(`<div class="row"><div class="col-sm-4"><b>${feltDefinisjoner1[i].navn}:</b></div><div class="col-sm-8">${value}</div></div>`);
            }
            for (i = 0; i < kriterierFeltdefinisjoner.length; i++) {
                var value = formatterData(featureAttributes[kriterierFeltdefinisjoner[i].navn], 'kriterie');
                $("#kriterierTablebody").append(`<tr><td>${kriterierFeltdefinisjoner[i].alias}</td><td style="text-align: center;">${value}</td></tr>`);
            }
        }
    });

const feltDefinisjoner1 = [
    { navn: "ArtNasjonalId",        type: "text"    },
    { navn: "VitenskapeligNavn",    type: "text"    },
    { navn: "VitenskapeligNavnId",  type: "text"    },
    { navn: "NorskNavn",            type: "text"    },
    { navn: "Gruppe",               type: "text"    },
    { navn: "Aktivitet",            type: "text"    },
    { navn: "AntallObservasjoner",  type: "int"     },
    { navn: "DatoFra",              type: "epoch"   },
    { navn: "DatoTil",              type: "epoch"   },
    { navn: "Presisjon",            type: "int"     },
    { navn: "Kommune",              type: "text"    },
    { navn: "Status",               type: "text"    },
    { navn: "Fylke",                type: "text"    },
    { navn: "Krit_Kombinert",       type: "text"    }
];

/*
    ArtNasjonalId: 11.709189_60.040337_5957
    VitenskapeligNavn: Dytiscus latissimus
    NorskNavn: Kjempevannkalv
    Kommune: Nes (3034)
Krit_Ansvarsart: null
Krit_TruetArt: null
Krit_AndreSpesHensyn: null
Krit_SpesOkologisk: null
Krit_PrioritertArt: null
Krit_FredetArt: 1
Krit_NarTruetArt: null
Krit_FremmedArt: null
Krit_Kombinert: fredete arter
    Gruppe: insekter
    VitenskapeligNavnId: 5957
    Status: LC
    Faktaark: https://artnasjonal-faktaark.naturbase.no?id=11.709189_60.040337_5957
    AntallObservasjoner: 1
    DatoFra: 1058572800000
    DatoTil: 1058572800000
    Aktivitet: forflytting
    Presisjon: 5
    Fylke: Viken
    TaxonId: 5848
*/

const funnFeltdefinisjoner = [
    { navn: "CollectedDate",        type: "epoch"   },
    { navn: "Behavior",             type: "text"    },
    { navn: "Notes",                type: "text"    },
    { navn: "Locality",             type: "text"    },
    { navn: "Count_",               type: "int"     },
    { navn: "Sex",                  type: "text"    },
    { navn: "Collector",            type: "text"    },
    { navn: "BasisOfRecord",        type: "text"    },
    { navn: "IdentifiedBy",         type: "text"    },
    { navn: "DatetimeIdentified",   type: "epoch"   },
    { navn: "Id",                   type: "text"    },
    { navn: "Institution",          type: "text"    },
    { navn: "Collection",           type: "text"    }
];

const kriterierFeltdefinisjoner = [
    { navn: "Krit_Ansvarsart",      alias: "Ansvarsat"},
    { navn: "Krit_TruetArt",        alias: "Truet art"},
    { navn: "Krit_AndreSpesHensyn", alias: "Annen spesielt hensynskrevende art"},
    { navn: "Krit_SpesOkologisk",   alias: "Spesiell økologisk form"},
    { navn: "Krit_PrioritertArt",   alias: "Prioritert art"},
    { navn: "Krit_FredetArt",       alias: "Fredet art"},
    { navn: "Krit_NarTruetArt",     alias: "Nær truet art"},
    { navn: "Krit_FremmedArt",      alias: "Fremmed art"}
];

/*
    ObsUrl      (artsobs url)
    DetailUrl   (artsobs url)
    PropertyUrls
    ThumbImgUrls
*/
function formatterData (data, definisjon) {
    if (data == 1 && definisjon == "kriterie") {
        data = "x";
    }
    else if (data) {
        if (definisjon == "epoch") {
            data = new Date(data).toISOString().substring(0, 10); // returner dato
        }
    }
    else {
        data = ''; // tom data -> tom streng
    }
    return(data);

}
// var myDate = new Date(1601528702*1000);
// console.log(myDate.toLocaleDateString();
