var temaId;
try {
    temaId = getURLParameter('id').toUpperCase();
}
catch (err) {
    var temaId =  '9.545184_63.418554_3859'; // punkt
    // temaId = '';
    console.log(err);
}

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
        esriConfig.apiKey = apiKey;
        /* exported basisKartUrl */
        

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

        // var temaId = '9.545184_63.418554_3859'; // punkt
        // var temaId = '6.583852_58.097869_3531'; // omr
        // Create graphics layer and symbol to use for displaying the results of query
        var geometriGraphicsLayer = new GraphicsLayer();
        // var observasjonerTableURL = "https://testarcgis02.miljodirektoratet.no/arcgis/rest/services/faktaark/artnasjonal/MapServer/2";
        // var punktLayerURL = "https://testarcgis02.miljodirektoratet.no/arcgis/rest/services/faktaark/artnasjonal/MapServer/0";
        // var omrLayerURL = "https://testarcgis02.miljodirektoratet.no/arcgis/rest/services/faktaark/artnasjonal/MapServer/1";

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
                featureTilSkjerm(results.features[0].attributes);
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
            for (i = 0; i < funnFeltdefinisjoner.length; i++) {
                if (funnFeltdefinisjoner[i].sortering == false) {
                    columns.push(
                        {
                            name: funnFeltdefinisjoner[i].alias,
                            sort: {
                                enabled: false
                            }
                        });
                }
                else {
                    columns.push(funnFeltdefinisjoner[i].alias);
                }
            }
            var data = [];
            for (i = 0; i < results.features.length; i++) {
                datarow = [];
                attributes = results.features[i].attributes;
                for (j = 0; j < funnFeltdefinisjoner.length; j++) {
                    attributevalue = attributes[funnFeltdefinisjoner[j].navn];
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
                sort: {
                    multiColumn: false
                },
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

        $('#utskriftsDatoDiv').text(new Date().toLocaleDateString());

        function featureTilSkjerm(featureAttributes) {
            console.log(feltDefinisjoner1);
            for (i = 0; i < feltDefinisjoner1.length; i++) {
                var value = formatterData(featureAttributes[feltDefinisjoner1[i].navn], feltDefinisjoner1[i].type);
                $("#innhold1").append(`<div class="row"><div class="col-sm-4"><b>${feltDefinisjoner1[i].alias}:</b></div><div class="col-sm-8">${value}</div></div>`);
            }
            for (i = 0; i < kriterierFeltdefinisjoner.length; i++) {
                var value = formatterData(featureAttributes[kriterierFeltdefinisjoner[i].navn], 'kriterie');
                $("#kriterierTablebody").append(`<tr><td>${kriterierFeltdefinisjoner[i].alias}</td><<td>${kriterierFeltdefinisjoner[i].forklaring}</td><td style="text-align: center; vertical-align:middle;">${value}</td></tr>`);
            }
        }
    });

const feltDefinisjoner1 = [
    { navn: "ArtNasjonalId",        type: "text",   alias: "ArtNasjonalId"             },
    { navn: "VitenskapeligNavn",    type: "text",   alias: "Vitenskapelig navn"        },
    { navn: "VitenskapeligNavnId",  type: "text",   alias: "Vitenskapelig navn Id"     },
    { navn: "NorskNavn",            type: "text",   alias: "Norsk navn"                },
    { navn: "Gruppe",               type: "text",   alias: "Artsgruppe"                },
    { navn: "Aktivitet",            type: "text",   alias: "Aktivitet"                 },
    { navn: "AntallObservasjoner",  type: "int",    alias: "Antall enkeltobservasjoner"},
    { navn: "DatoFra",              type: "epoch",  alias: "Dato fra"                  },
    { navn: "DatoTil",              type: "epoch",  alias: "Dato til"                  },
    { navn: "Presisjon",            type: "int",    alias: "Presisjon (m)"             },
    { navn: "Status",               type: "text",   alias: "Rødlistekategori"          },
    { navn: "Kommune",              type: "text",   alias: "Kommune (kommunenummer)"   },
    { navn: "Fylke",                type: "text",   alias: "Fylke"                     },
    { navn: "Krit_Kombinert",       type: "text",   alias: "Utvalgskriterier"          }
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
Forvaltningskategori
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
    { navn: "CollectedDate",        type: "epoch",      alias: "Dato funnet"        },
    { navn: "Behavior",             type: "text",       alias: "Aktivtet"           },
    { navn: "Notes",                type: "text",       alias: "Notater"            },
    { navn: "Locality",             type: "text",       alias: "Lokalitet"          },
    { navn: "Count_",               type: "int",        alias: "Antall",            },            
    { navn: "Sex",                  type: "text",       alias: "Kjønn"              },
    { navn: "Habitat",              type: "text",       alias: "Habitat"            },
    { navn: "Collector",            type: "text",       alias: "Finner"             },
    { navn: "BasisOfRecord",        type: "text",       alias: "Type funn"          },
    { navn: "IdentifiedBy",         type: "text",       alias: "Valideringsstatus"  },
    { navn: "DatetimeIdentified",   type: "epoch",      alias: "Artsbestemt av"     },
    { navn: "Institution",          type: "text",       alias: "Institusjon"        },
    { navn: "Collection",           type: "text",       alias: "Samling/database"   },
    { navn: "Id",                   type: "text",       alias: "Id"                 },
    { navn: "ObsUrl",               type: "url",        alias: "Observation URL"    },
    { navn: "DetailUrl",            type: "url",        alias: "Details URL"        }             
];

const kriterierFeltdefinisjoner = [
    { navn: "Krit_Ansvarsart",      forklaring: "Norge har mer enn 25% av artens europeiske bestand",                                                                   alias: "Ansvarsart"},
    { navn: "Krit_TruetArt",        forklaring: "Kategoriene Kritisk truet (CR), Sterkt truet (EN) og Sårbar (VU) i Norsk rødliste for arter, Norge (Artsdatabanken)",  alias: "Truet art"},
    { navn: "Krit_AndreSpesHensyn", forklaring: "Andre arter av nasjonal forvaltningsinteresse, utvalgt av Miljødirektoratet",                                          alias: "Annen spesielt hensynskrevende art"},
    { navn: "Krit_SpesOkologisk",   forklaring: "Former eller underarter av arter av nasjonal forvaltningsinteresse som ikke vurderes i rødlisten",                     alias: "Spesiell økologisk form"},
    { navn: "Krit_PrioritertArt",   forklaring: "Prioritert art i medhold av naturmangfoldloven",                                                                       alias: "Prioritert art"},
    { navn: "Krit_FredetArt",       forklaring: "fredet i medhold av naturvernloven",                                                                                   alias: "Fredet art"},
    { navn: "Krit_NarTruetArt",     forklaring: "Kategorien Nær truet (NT) i Norsk rødliste for arter, Norge (Artsdatabanken)",                                         alias: "Nær truet art"},
    { navn: "Krit_FremmedArt",      forklaring: "Kategoriene Svært høy risiko (SE) og Høy risiko (HI) i Fremmedartslista (Artsdatabanken)",                             alias: "Fremmed art"}
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
            // data = new Date(data).toISOString().substring(0, 10); // returner dato
            data = new Date(data).toLocaleDateString();
        }
    }
    else {
        data = ''; // tom data -> tom streng
    }
    return(data);

}
// var myDate = new Date(1601528702*1000);
// console.log(myDate.toLocaleDateString();
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search.toLowerCase()) || [, ''])[1].replace(/\+/g, '%20')) || null;
}