var temaKonfigVR;

require([
    'esri/Color',
    'esri/geometry/Extent',
    'esri/geometry/Point',
    'esri/InfoTemplate',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/FeatureLayer',
    'esri/layers/ImageParameters',
    'esri/layers/LayerInfo',
    'esri/map',
    'esri/renderers/SimpleRenderer',
    'esri/SpatialReference',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/tasks/FindTask',
    'esri/tasks/FindParameters',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/tasks/RelationshipQuery',
    'esri/request',
    'dojo/_base/lang',
    'dojo/date/locale',
    'dojo/dom',
    'dojo/parser',
    'dojo/promise/all',
    'dojo/domReady!'
],
    function (
        Color,
        Extent,
        Point,
        InfoTemplate,
        ArcGISDynamicMapServiceLayer,
        ArcGISTiledMapServiceLayer,
        FeatureLayer,
        ImageParameters,
        LayerInfo,
        Map,
        SimpleRenderer,
        SpatialReference,
        SimpleFillSymbol,
        SimpleLineSymbol,
        SimpleMarkerSymbol,
        FindTask,
        FindParameters,
        Query,
        QueryTask,
        RelationshipQuery,
        esriRequest,
        lang,
        locale,
        dom,
        parser,
        all
    ) {
        parser.parse();
        var temaId = 'VV00001872';

        var temaKonfigVR = $.grep(temaKonfigArray, function (e) {
            return e.temaKode == 'VR';
        })[0];
        var temaKonfigVR_restriksjon = $.grep(temaKonfigVR.relatedTables, function (e) {
            return e.relatedTableName == 'VernRestriksjon_Restriksjon';
        })[0];

        var featureLayerURL = temaKonfigVR.temaMapserverUrl + temaKonfigVR.temaLayerId.omr;
        // Finner VR Områder som har naturvernId = temaId
        featureLayer = new FeatureLayer(featureLayerURL, {
            id: 'featureLayer',
            outFields: ['*'],
            mode: FeatureLayer.MODE_SNAPSHOT,
            definitionExpression: 'naturvernId=\'' + temaId + '\'',
            maxAllowableOffset: 4,
            returnGeometry: false
        });
        // var featureLayerURL = temaKonfig.temaMapserverUrl + temaKonfig.temaLayerId.omr;
        var tableQuery = new Query({
            where: 'naturvernId=\'' + temaId + '\'',
            outFields: ['*'],
            returnGeometry: false
        });

        featureLayer.queryFeatures(tableQuery).then(function (result) {
            // console.log(
            //     getDomainCodedValue(result.features[0].getLayer(),
            //         'likGeometriVernOmr',
            //         result.features[0].attributes.likGeometriVernOmr)
            // );
            deferredQueriesVRRestriksjoner = [];
            vrResultArr = [];
            var featureLayerURL = temaKonfigVR.temaMapserverUrl + temaKonfigVR_restriksjon.tableId;
            for (var i = 0; i < result.features.length; i++) {
                vrResultArr.push({
                    likGeometriVernOmr: result.features[i].attributes.likGeometriVernOmr,
                    vernRestriksjonId: result.features[i].attributes.vernRestriksjonId
                });
                vrID = result.features[i].attributes.vernRestriksjonId;
                featureLayer = new FeatureLayer(featureLayerURL, {
                    id: 'featureLayer',
                    outFields: ['*'],
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    definitionExpression: temaKonfigVR.temaIdFelt + '=\'' + vrID + '\''
                });
                var tableQuery = new Query({
                    where: temaKonfigVR.temaIdFelt + '=\'' + vrID + '\'',
                    outFields: ['*']
                });
                deferredQueriesVRRestriksjoner.push(featureLayer.queryFeatures(tableQuery));
            }
            all(deferredQueriesVRRestriksjoner).then(
                function (deferredResultsVR) {
                  var vrRestriksjonerArr = [];
                    if (deferredResultsVR[0].features[0]) {
                        var domainCodeList = deferredResultsVR[0].features[0].getLayer().getDomain('restriksjonstype');
                        // deferredResultsVR[i].features[0].getLayer();
                    }
                    for (var i = 0; i < deferredResultsVR.length; i++) {
                        // var featureLayer;
                        // if (deferredResultsVR[i].features[0]) {
                        //     featureLayer = deferredResultsVR[i].features[0].getLayer();
                        // }
                        featureAttributes = deferredResultsVR[i].features[0].attributes;
                        vrRestriksjonerArr.push({
                            id: featureAttributes.vernRestriksjonId,
                            heleomr: vrResultArr[i].likGeometriVernOmr,
                            restriksjoner: []
                        });
                        // var domainCodeList = featureLayer.getDomain('restriksjonstype');
                        for (var j = 0; j < deferredResultsVR[i].features.length; j++) {
                            featureAttributes = deferredResultsVR[i].features[j].attributes;
                            console.log(featureAttributes.OBJECTID + ' ' + i + ':' + j + featureAttributes.restriksjonstype + ' ' + getDomainCodedValue(null, 'restriksjonstype', featureAttributes.restriksjonstype, domainCodeList));
                            vrRestriksjonerArr[i].restriksjoner.push({
                                OBJECTID: featureAttributes.OBJECTID,
                                restriksjon: getDomainCodedValue(null, 'restriksjonstype', featureAttributes.restriksjonstype, domainCodeList),
                                fraDag: featureAttributes.fraDag,
                                fraMaaned: featureAttributes.fraMaaned,
                                tilDag: featureAttributes.tilDag,
                                tilMaaned: featureAttributes.tilMaaned,
                                merknad: featureAttributes.merknad
                            })
                        }
                    }
                    console.log(vrRestriksjonerArr);
                    // if (vrRestriksjonerArr.length > 0) {
                    //     addVRTableRow('Restriksjonsområder', vrRestriksjonerArr);
                    // }
                }
            );
        });

        // myQueryTask = new QueryTask (featureLayerURL);
        // myQueryTask.execute(tableQuery, function (vrFeatures) {
        //     console.log(vrFeatures);
        // });

    }
);

// Hvis domainCodeList mangler MÅ det være med et featureLayer
function getDomainCodedValue(featureLayer, felt, verdi, domainCodeList) {
    if (!domainCodeList) {
        var domainCodeList = featureLayer.getDomain(felt);
    }
    if (domainCodeList) {
        for (var i = 0; i < domainCodeList.codedValues.length; i++) {
            if (domainCodeList.codedValues[i].code == verdi) {
                return (domainCodeList.codedValues[i].name);
            }
        }
    }
    return (null);
}