// TODO: fiks casesensitivt id parameter
var egenskapTabellRows = [];
var spesialTabeller = '';
var tableRow;
var map;
var temaId;
try {
    temaId = getURLParameter('id').toUpperCase();
}
catch (err) {
    //var temaId = 'VV00003273';
    temaId = '';
    console.log(err);
}

// Parameter viskart = 0 eller manglende parameter setter visKart = 1
var visKart = getURLParameter('viskart');
if (!visKart) {
    visKart = 1;
}

var deferredGeoSjekkQueries = []; // queries til alle tilgjengelig typer geometri per tema 
var deferredTableQueries = [];
if (!temaId) {
    // temaId = 'FS00001012';
    // temaId = 'FS00000199'; // div vedlegg
    // temaId = 'FS00000264'; // Forvaltnginsplan, PDF og TIF
    // temaId = 'FS00000265'; // dokument med publiseres = null
    // temaId = 'FS00002301';
    // temaId = 'FS00000315';
    // temaId = 'FK00000001';
    // temaId = 'BN00000838'; // m bruksmåte, vedlegg, vegetasjonstype
    // temaId = 'BN00001297'; // flere vegetasjonstyper, kilder
    // temaId = 'BM00107266'; // flere tillegg (ugyldige naturtyper (?))
    // temaId = 'BM00079585'; // kilder, tillegg, vegetasjonstyper
    // temaId = 'BN00014369'; // påvirkningsfaktor, tillegg
    // temaId = 'BM00079585'; // flere vegetasjonstyper
    // temaId = 'BN00001679'; // Omr
    // temaId = 'BN00000810'; // Pkt
    // temaId = 'BA00036683'; // Omr
    // temaId = 'BA00002479'; // Omr m Bern / Bonn / Rdliste
    // temaId = 'BA00037322'; // Linje
    // temaId = 'BA00029904'; // Pkt
    // temaId = 'BA00040225'; // MultiPkt
    // temaId = 'BA00011039';
    // temaId = 'KF00000002';
    // temaId = 'KF00000024'; 
    // temaId = 'KF00000194'; // PDF 
    // temaId = 'KF00000235';
    // temaId = 'KU00000001';
    // temaId = 'VV00001870'; // med vedlegg og satte DokTyper
    // temaId = 'VV00001850'; // med vedlegg
    // temaId = 'VV00000001'; // med vedlegg
    // temaId = 'VV00000521'; // test verneform DOM verdi
    // temaId = 'VV00001588'; // Uten verneform
    // temaId = 'VV00002491'; // med DOC og PDF
    // temaId = 'VP00000011'; // med kilder
    // temaId = 'VP00000365';
    // temaId = 'BV00000002'; // omr
    // temaId = 'BV00000666'; // lin
    // temaId = 'VM00072079'; // Ramsar m kommuneinfo og kilder
    // temaId = 'VR00000001'; // Restriksjonomr m kommuneinfo og kilder
    // temaId = 'MS00000001'; // Motoferdsel, snøscootrløyper
    // temaId = 'MS00000048' ; // Feil avrundting lengde på linjer
}
var temaKode = temaId.substr(0, 2).toUpperCase();
var temaKonfig = $.grep(temaKonfigArray, function (e) {
    return e.temaKode == temaKode;
})[0]; // Plukk Konfig som matcher temaKode (FS/FK/KF/KU/VV/VP/VR/VM)

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

        // Hent oversikt over tilhørende dokumenter / vedlegg
        $.ajax({
            'url': dokumentUrl + temaId,
            'type': 'GET',
            'data': {
                format: 'json'
            },
            'error': function (request, error) {
                console.log('Vedlegg status: ' + JSON.stringify(request) + ' Error: ' + JSON.stringify(error));
            },
            'success': function (data) {
                if (data.dokumenter) {
                    var bilde;

                    for (var i = 0; i < data.dokumenter.length; i++) {
                        bilde = false;
                        var dok = data.dokumenter[i];

                        var tmpRow = '';
                        tmpRow += '<div class="row"><div class="col-md-1"></div><div class="col-md-3 centerImg">';
                        if (dok.mimeType == 'PDF' || dok.mimeType == 'TIF' || dok.mimeType == 'DOC' || dok.mimeType == 'DOCX' || dok.mimeType == 'XLS' || dok.mimeType == 'XLSX') {
                            tmpRow += '<a href="' + dok.url + '" target="_blank"><img class="img-responsive img-fluid" src="./img/' + dok.mimeType.toLowerCase() + '.png" alt="ikon" width="70px" /></a></div>';
                        }
                        if (dok.mimeType == 'JPG' || dok.mimeType == 'JPEG' || dok.mimeType == 'PNG' || dok.mimeType == 'GIF') {
                            tmpRow += '<a href="' + dok.url + '"  target="_blank"><img class="img-responsive img-fluid" src="' + dok.url + '" alt="bilde"/></a></div>';
                            bilde = true;
                        }
                        tmpRow += '<div class="col-md-7"><table class="table table-condensed"><tbody>';
                        if (dok.tittel) {
                            tmpRow += '<tr><td width="150px">Tittel:</td><td>' + dok.tittel + '</td></tr>';
                        }
                        if (dok.fotografForfatter) {
                            tmpRow += '<tr><td>Fotograf/Forfatter:</td><td>' + dok.fotografForfatter + '</td></tr>';
                        }
                        if (dok.beskrivelse) {
                            tmpRow += '<tr><td>Beskrivelse:</td><td>' + dok.beskrivelse + '</td></tr>';
                        }
                        if (dok.dokumentType) {
                            tmpRow += '<tr><td>Type:</td><td>' + dok.dokumentType + '</td></tr>';
                        }
                        tmpRow += '</tbody></table>';
                        tmpRow += '</div><div class="col-md-1"></div></div><br/>';

                        if (dok.publiseres == null || dok.publiseres == true) {
                            if (dok.dokumentType != null && dok.dokumentType != '') {
                                // Spesielt klassifiserte vedlegg
                                $('#DokumentContainer').append(tmpRow);
                            } else {
                                if (bilde) {
                                    // bildeTable.append(tmpTable);
                                    $('#BildeContainer').append(tmpRow);
                                } else {
                                    // vedleggTable.append(tmpTable);
                                    $('#VedleggContainer').append(tmpRow);
                                }
                            }
                        }
                    }
                    $('#vedleggheadingDiv').text('Vedlegg og dokumenter');
                }
            }
        });

        if (temaKonfig) {
            $('#temaNavnDiv').text(temaKonfig.temaNavn);
            // --- Hele Norge
            // var mapExtent = new Extent({
            //     'xmin': 157611,
            //     'ymin': 6228100,
            //     'xmax': 487737,
            //     'ymax': 8148325,
            //     'spatialReference': {
            //         'wkid': 25833
            //     }
            // });
            // Lite utsnitt, unngår at Mapserver Export henter data for hele Norge v oppstart
            var mapExtent = new Extent({
                'xmin': 200000,
                'ymin': 7000000,
                'xmax': 200001,
                'ymax': 7000001,
                'spatialReference': {
                    'wkid': 25833
                }
            });

            map = new Map('map', {
                extent: mapExtent,
                navigationMode: 'css-transforms',
                logo: false
            });

            if (visKart == 0) {
                $('.map').hide();
            }

            var tiledLayer = new ArcGISTiledMapServiceLayer(basisKartUrl, {
                id: 'bakgrunnskart',
                showAttribution: true,
                format: 'jpeg',
                fadeOnZoom: true
            });

            // Lager deferredGeoSjekkQueries som går gjennom inntil 3 featurServices (pkt, linje, omr) for å finne ut hvilket
            // av dem som har egenskapene vi behøver.
            // Lager deretter symbol og renderer som matcher geometri og henter geometri. 

            var geoSjekkQuery = new Query();
            // geoSjekkQuery.where = "1=1";
            geoSjekkQuery.where = temaKonfig.temaIdFelt + '=\'' + temaId + '\'';
            geoSjekkQuery.outFields = ["*"];

            if (temaKonfig.temaLayerId.omr != null) {
                var omrGeoSjekkFL = new FeatureLayer(temaKonfig.temaMapserverUrl + temaKonfig.temaLayerId.omr, {
                    id: 'omr',
                    outFields: ['*'],
                    mode: FeatureLayer.MODE_SNAPSHOT
                    ,maxAllowableOffset: 4
                    // ,featureReduction: { type: "selection" }
                    // definitionExpression: temaKonfig.temaIdFelt + '=\'' + temaId + '\''
                });
                deferredGeoSjekkQueries.push(omrGeoSjekkFL.queryFeatures(geoSjekkQuery));
            }
            if (temaKonfig.temaLayerId.linje != null) {
                var linjeGeoSjekkFL = new FeatureLayer(temaKonfig.temaMapserverUrl + temaKonfig.temaLayerId.linje, {
                    id: 'linje',
                    outFields: ['*'],
                    mode: FeatureLayer.MODE_SNAPSHOT
                    // definitionExpression: temaKonfig.temaIdFelt + '=\'' + temaId + '\''
                });
                deferredGeoSjekkQueries.push(linjeGeoSjekkFL.queryFeatures(geoSjekkQuery));
            }
            if (temaKonfig.temaLayerId.pkt != null) {
                var pktGeoSjekkFL = new FeatureLayer(temaKonfig.temaMapserverUrl + temaKonfig.temaLayerId.pkt, {
                    id: 'pkt',
                    outFields: ['*'],
                    mode: FeatureLayer.MODE_SNAPSHOT
                    // definitionExpression: temaKonfig.temaIdFelt + '=\'' + temaId + '\''
                });
                deferredGeoSjekkQueries.push(pktGeoSjekkFL.queryFeatures(geoSjekkQuery));
            }

            var featureLayer = null;

            // Når sjekk av pkt/linje/omr featurelayers er klar
            // endret fra .then til .always for å kunne håndtere queries som feiler
            all(deferredGeoSjekkQueries).always(
                function (queryResults) {
                    if (queryResults.length > 0) {
                        console.log('deferredGeoSjekkQueries for geometri gjennomført. Antall layers som har svart: ' + queryResults.length);
                    } else {
                        console.log('FEIL! Output fra queries i deferredGeoSjekkQueries for geometri: ' + queryResults);
                    }
                    var temaLayerId = null;
                    var temaLayerSymbol = null;
                    for (var i = 0; i < queryResults.length; i++) // antall layers vi har fått svar fra
                    {
                        if (queryResults[i].features.length > 0) // antall features per layer
                        {
                            // Sjekker LayerId som ble sendt med Queryene og plukker riktig layerId (int) fra temaKonfig - setter også riktig symbolisering
                            switch (queryResults[i].features[0].getLayer().id) {
                                case 'omr':
                                    temaLayerId = temaKonfig.temaLayerId.omr;
                                    temaLayerSymbol = new SimpleFillSymbol(
                                        SimpleFillSymbol.STYLE_SOLID,
                                        new SimpleLineSymbol(
                                            SimpleLineSymbol.STYLE_SOLID,
                                            new Color([0, 0, 0]),
                                            2),
                                        new Color([0, 255, 0, 0.25])
                                    );
                                    break;
                                case 'linje':
                                    temaLayerId = temaKonfig.temaLayerId.linje;
                                    temaLayerSymbol = new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color([0, 200, 0]),
                                        5
                                    );
                                    break;
                                case 'pkt':
                                    temaLayerId = temaKonfig.temaLayerId.pkt;
                                    temaLayerSymbol = new SimpleMarkerSymbol(
                                        SimpleMarkerSymbol.STYLE_SQUARE,
                                        10,
                                        new SimpleLineSymbol(
                                            SimpleLineSymbol.STYLE_SOLID,
                                            new Color([0, 0, 0]),
                                            1
                                        ),
                                        new Color([0, 255, 0, 0.25])
                                    );
                                    break;
                            }
                        }
                    }
                    if (temaLayerId != null) {
                        // Legg temaLayer, dynamisk kart og bakgrunnskart til kartet
                        var featureLayer = addLayersToMap(temaLayerId, temaLayerSymbol);
                    } else {
                        $('#feilDiv').html("Feil: Finner ikke informasjon om objekt med id: " + temaId);
                        $('#feilContainer').show();
                        console.log("Problemer med å legge layers til kartet. Kanskje er det ingen features som matcher " + temaId);
                    }
                }
            );

            map.on('layers-add-result', function (addedLayers) {
                if (addedLayers.layers.length == 3) {
                    console.log('Bakgrunnskart, dynamicMapLayer og featureLayer added!');
                }
                $('#map').show();
                var query = new Query();
                query.where = temaKonfig.temaIdFelt + '=\'' + temaId + '\'';
                geoSjekkQuery.outFields = ["*"];

                featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (features) {
                    if (features.length > 0) {
                        // TODO Håndter manglende geometri (geometry.type finnes ikke)
                        if (features[0].geometry.type == 'multipoint') {
                            if (features[0].geometry.points.length < 2) {
                                var x = features[0].geometry.points[0][0];
                                var y = features[0].geometry.points[0][1];
                                var punkt = new Point(x, y, new SpatialReference({
                                    wkid: 25833
                                }));
                                map.centerAndZoom(punkt, 11);
                            } else // multipunkt med 2 eller flere punkter
                            {
                                map.setExtent(features[0].geometry.getExtent().expand(4.0))
                            }
                        } else if (features[0].geometry.type == 'point') {
                            map.centerAndZoom(features[0].geometry, 11);
                        }
                        // linje, polygon
                        else {
                            map.setExtent(features[0].geometry.getExtent().expand(2.0));
                        }
                    }

                    $('#utskriftsDatoDiv').text('Utskriftsdato: ' + locale.format(new Date(), {
                        selector: 'date',
                        formatLength: 'short'
                    }));

                    var featureAttributes = features[0].attributes;
                    if (temaKonfig.overskriftFelt != null && temaKonfig.overskriftFelt != '') {
                        var overskrift = featureAttributes[temaKonfig.overskriftFelt[0]];
                        for (var i = 1; i < temaKonfig.overskriftFelt.length; i++) {
                            try {
                                var feltVerdi = getDomainCodedValue(features[0].getLayer(), temaKonfig.overskriftFelt[i], featureAttributes[temaKonfig.overskriftFelt[i]]);
                                if (feltVerdi) {
                                    overskrift += ' ' + feltVerdi;
                                }
                                else {
                                    overskrift += ' ' + featureAttributes[temaKonfig.overskriftFelt[i]];
                                }
                            } catch (e) {
                                console.log('mangler verneformverdi' + e);
                            }
                        }
                        $('#overskriftDiv').text(overskrift);
                    }

                    var feltAlias = '';
                    var feltDatatype = '';
                    var feltNavn = '';

                    // List ut feltnavn og feltverdi for hvert felt i hovedfeature
                    // Felles for alle datasett
                    for (var i = 0; i < temaKonfig.felt.length; i++) {
                        feltAlias = '';
                        var value = featureAttributes[temaKonfig.felt[i]];
                        feltNavn = temaKonfig.felt[i];

                        if (value == null) {
                            value = '';
                        }
                        console.log('Hovedtabell ' + temaKonfig.felt[i] + ': ' + value.toString().substr(0, 50));

                        for (var j = 0; j < features[0].getLayer().fields.length; j++) {
                            if (features[0].getLayer().fields[j].name == temaKonfig.felt[i]) {
                                feltAlias = features[0].getLayer().fields[j].alias;
                                feltDatatype = features[0].getLayer().fields[j].type;
                                break;
                            }
                        }
                        
                        if (temaKode == 'VR' && feltNavn == 'naturvernId') {
                            tmpValue = '<a href="' + location.origin + '?id=' + value + '" target="_blank">' + value + '</a>';
                            value = tmpValue;
                        }

                        if (temaKode == 'VR' && feltNavn == 'andreVRiVerneomr') {
                            feltAlias = 'Andre restriksjonsområder i samme verneområde'
                            if (value) {
                                var vrArr = value.split(',');
                                value = '';

                                for (var v = 0; v < vrArr.length; v++) {
                                    value += '<a href="' + location.origin + '?id=' + vrArr[v] + '" target="_blank">' + vrArr[v] + '</a>';
                                    if (v < vrArr.length - 1) {
                                        value += ', ';
                                    }
                                }
                            }
                            else {
                                value = 'Nei';
                            }
                        }

                        // URL?
                        if (value.toString().substring(0, 4).toLowerCase() == 'http') {
                            value = '<a href="' + value + '" target="_blank">' + value + '</a>'
                        }

                        // Formattering av tall som ikke er ESRI Geometrydatatyper
                        if (feltDatatype == 'esriFieldTypeDouble' && value != null && feltNavn != 'SHAPE.STArea()' && feltNavn != 'SHAPE.STLength()') {
                            value = value.toLocaleString('no-NB');
                        }

                        // Datoformattering
                        if (feltDatatype == 'esriFieldTypeDate' && value != '') {
                            try {
                                value = locale.format(new Date(value), {
                                    selector: 'date',
                                    formatLength: 'short'
                                });
                            } catch (e) {
                                console.log('Problem med dataoformattering: ' + e.toString());
                            }
                        }

                        // Beregn areal for områder
                        if (feltNavn == 'SHAPE.STArea()' && feltDatatype == 'esriFieldTypeDouble' && value != null) {
                            feltAlias = 'Areal fra kartobjekt (daa)';
                            value = (value / 1000);
                            value = parseFloat(parseFloat(Math.round(value * 10) / 10).toFixed(1)).toLocaleString('no-NB', {
                                minimumFractionDigits: 1
                            });
                        }

                        // Beregn lengde for linjer
                        if (feltNavn == 'SHAPE.STLength()' && feltDatatype == 'esriFieldTypeDouble' && value != null) {
                            feltAlias = 'Beregnet lengde (m)';
                            value = parseFloat(Math.round(value * 10) / 10).toLocaleString('no-NB', {
                                minimumFractionDigits: 1
                            });
                        }

                        var codedValueDomain = features[0].getLayer().getDomain(temaKonfig.felt[i], featureAttributes);
                        var codedValue = null;
                        if (codedValueDomain) {
                            for (var k = 0; k < codedValueDomain.codedValues.length; k++) {
                                if (value == codedValueDomain.codedValues[k].code) {
                                    codedValue = codedValueDomain.codedValues[k].name;
                                    break;
                                }
                            }
                        }
                        if (value == '') {
                            value = "-";
                        }

                        if (feltNavn == temaKonfig.temaIdFelt) {
                            feltNavn = 'ID';
                            feltAlias = 'ID';
                        }

                        if (feltAlias != '') {
                            addEgenskapTabellRow(feltAlias, codedValue, value);
                        } else {
                            console.log(">>> finner ikke felt: " + temaKonfig.felt[i]);
                        }
                    }

                    // Sjekk om data skal leses fra related Tables?
                    if (temaKonfig.relatedTables.length > 0) {
                        // bygger opp en array med RelationshipQueries for å holde kontroll på rekkefølgen de sendes og mottas
                        for (var i = 0; i < temaKonfig.relatedTables.length; i++) {
                            var featureLayerURL = temaKonfig.temaMapserverUrl + temaKonfig.relatedTables[i].tableId;
                            var featureLayer = new FeatureLayer(featureLayerURL, {
                                id: 'featureLayer',
                                outFields: ['*'],
                                mode: FeatureLayer.MODE_SNAPSHOT,
                                definitionExpression: temaKonfig.temaIdFelt + '=\'' + temaId + '\''
                            });
                            var tableQuery = new Query({
                                where: temaKonfig.temaIdFelt + '=\'' + temaId + '\''
                            });
                            deferredTableQueries.push(featureLayer.selectFeatures(tableQuery, FeatureLayer.SELECTION_NEW));
                        }

                        all(deferredTableQueries).then(
                            function (queryResults) {
                                // i: QueryResult - en array per featureLayer (array of FeatureArrays fra deferredTableQueries)
                                for (var i = 0; i < queryResults.length; i++) {
                                    // bygger opp relatedTableObj som inneholder (vaskede) verdier fra related Tables
                                    var relatedTableObj = {
                                        temaKode: temaKonfig.temaKode,
                                        tabellNavn: temaKonfig.relatedTables[i].relatedTableName,
                                        tabellAlias: temaKonfig.relatedTables[i].relatedTableAlias,
                                        tabellFelt: temaKonfig.relatedTables[i].felt,
                                        features: []
                                    };
                                    var featureLayer;

                                    if (queryResults[i][0]) {
                                        featureLayer = queryResults[i][0].getLayer();
                                    }
                                    // j: Feature per FeatureArray
                                    for (var j = 0; j < queryResults[i].length; j++) {
                                        var feature = {};
                                        console.log('>> ' + featureLayer.name + '(' + j + '): ');
                                        // console.log (temaKonfig.relatedTables[i].relatedTableName);
                                        // Gå gjennom alle felt per feature
                                        for (var k = 0; k < temaKonfig.relatedTables[i].felt.length; k++) {
                                            var felt = temaKonfig.relatedTables[i].felt[k];
                                            var verdi = queryResults[i][j].attributes[felt];
                                            var alias = getFeltAlias(featureLayer, felt);
                                            var domainVerdi = getDomainCodedValue(featureLayer, felt, verdi);

                                            try {
                                                console.log('  felt: ' + felt + ' / alias: ' + alias + ' / verdi: ' + verdi.toString().substr(0, 20) + ' / domainVerdi: ' + domainVerdi);
                                            } catch (e) {
                                                console.log(' felt: ' + felt + ' (ugyldig verdi ' + e.message + ')');
                                                verdi = '';
                                            }

                                            if (verdi === null) {
                                                verdi = '';
                                            }

                                            if (domainVerdi) {
                                                verdi = domainVerdi;
                                            }
                                            if (verdi.toString().substring(0, 4).toLowerCase() == 'http') {
                                                verdi = '<a href="' + verdi + '" target="_blank">' + verdi + '</a>'
                                            }
                                            if (verdi != null) {
                                                feature[felt] = verdi;
                                            }
                                            //var domainCodeList = featureLayer.getDomain(temaKonfig.relatedTables[i].felt[k]);
                                        }
                                        relatedTableObj.features.push(feature);
                                    }
                                    if (relatedTableObj) {
                                        addRelatedTableObjToDOM(relatedTableObj);
                                    }
                                }
                                if (egenskapTabellRows.length > 0) {
                                    dom.byId('egenskapTabellBodyDiv').innerHTML += egenskapTabellRows.join('');
                                }
                                if (spesialTabeller.length > 0) {
                                    dom.byId('spesialTabellerBodyDiv').innerHTML = spesialTabeller;
                                }
                                // Hvis VV - hent estriksjonsområder
                                if (temaKonfig.temaKode == 'VV') {
                                    hentVernRestriksjoner();
                                }
                            }
                        );
                    } else {
                        // KUN Hvis tjenesten ikke har related tables viser vi egenskapstabellen nå. Nødvendig å vente ellers i tilfelle data
                        // fra related tables har data som skal inn i egenskapstabellen.
                        if (egenskapTabellRows.length > 0) {
                            dom.byId('egenskapTabellBodyDiv').innerHTML = egenskapTabellRows.join('');
                        }
                    }
                });
            });
        }

        // TODO: Lang.hitch
        function konverterDato(dato, myLocale) {
            if (dato) {
                return (myLocale.format(new Date(dato), {
                    selector: 'date',
                    formatLength: 'short'
                }));
            } else {
                return ('');
            }
        }

        // Tar imot relatedTableObj og avgjør hva som skal utføres basert på temaKode + tabellNavn 
        //  Alle related tables må legges til med en case her (husk å legge til FagsystemKode først i case-strengen)
        function addRelatedTableObjToDOM(relatedTableObj) {
            var i;
            var alias = relatedTableObj.tabellAlias;
            var value = '';
            var valueSammenslaattArray = [];
            switch (relatedTableObj.temaKode + '_' + relatedTableObj.tabellNavn) {
                // For related tables med to felt - felt 0 skal vises, felt 1 vises om det har innhold (i parantes) kommaseparert f.eks. "test a (test 1), test b"
                case 'BN_Naturtype_Vegetasjonstype':
                case 'BN_Naturtype_Paavirkingsfaktor':
                case 'BN_Naturtype_Tillegg':
                case 'BM_MarinNaturtype_Vegetasjonstype':
                case 'BM_MarinNaturtype_Paavirkingsfaktor':
                case 'BM_MarinNaturtype_Tillegg':
                    for (var i = 0; i < relatedTableObj.features.length; i++) {
                        var valueSammenslaattString = '';
                        var felt0 = relatedTableObj.features[i][relatedTableObj.tabellFelt[0]];
                        var felt1 = relatedTableObj.features[i][relatedTableObj.tabellFelt[1]];
                        valueSammenslaattString = felt0;
                        if (felt1) {
                            valueSammenslaattString += ' (' + relatedTableObj.tabellFelt[1] + ': ' + felt1 + ')';
                        }
                        //if (i < relatedTableObj.features.length-1) { valueSammenslaattString += '<br/>';}
                        valueSammenslaattArray.push(valueSammenslaattString);
                    }
                    if (valueSammenslaattArray.length > 0) {
                        addEgenskapTabellMultilineRow(alias, valueSammenslaattArray);
                    }
                    break;
                case 'BA_ArtFunksjon_Forekomst':
                    for (var i = 0; i < relatedTableObj.features.length; i++) {
                        var NorskNavn = relatedTableObj.features[i].norskNavn;
                        var VitenskapeligNavn = relatedTableObj.features[i].vitenskapeligNavn;
                        var PrioritertArt = relatedTableObj.features[i].prioritertArt;
                        var Rodlistestatus = relatedTableObj.features[i].roedlisteStatus;
                        var FunksjonBeskrivelse = relatedTableObj.features[i].funksjon;
                        var Verdi = relatedTableObj.features[i].verdi;
                        var Bern = relatedTableObj.features[i].bern;
                        var Bonn = relatedTableObj.features[i].bonn;
                        var Registreringsdato = konverterDato(relatedTableObj.features[i].registreringsDato, locale);

                        // var Registreringdato = locale.format(new Date(null), { selector: 'date', formatLength: 'short' });
                        var artString = 'Artsgruppe (norsk navn): ' + NorskNavn + ' (' + VitenskapeligNavn + ')' + '<br/>';
                        artString += 'Prioritert art: ' + PrioritertArt + '<br/>';
                        artString += 'Rødlistestatus: ' + Rodlistestatus + '<br/>';
                        artString += 'Funksjon: ' + FunksjonBeskrivelse + '<br/>';
                        artString += 'Verdi: ' + Verdi + '<br/>';
                        if (Bern) {
                            artString += 'Bern: ' + Bern + '<br/>';
                        }
                        if (Bonn) {
                            artString += 'Bonn: ' + Bonn + '<br/>';
                        }
                        artString += 'Registreringsdato: ' + Registreringsdato + '<br/>';

                        valueSammenslaattArray.push(artString);
                    }
                    if (valueSammenslaattArray.length > 0) {
                        addEgenskapTabellMultilineRow(alias, valueSammenslaattArray);
                    }
                    break;
                case 'FS_SikraFO_SikraEiendom':
                    var tmpSikringsAar;
                    for (var i = 0; i < relatedTableObj.features.length; i++) {
                        if (relatedTableObj.features[i][relatedTableObj.tabellFelt[2]] != null) {
                            tmpSikringsAar = ' (' + relatedTableObj.features[i][relatedTableObj.tabellFelt[2]] + ')';
                        } else {
                            tmpSikringsAar = '';
                        }
                        value += relatedTableObj.features[i][relatedTableObj.tabellFelt[0]] +
                            '/' + relatedTableObj.features[i][relatedTableObj.tabellFelt[1]] +
                            tmpSikringsAar + ', ';
                    }
                    value = value.slice(0, -2);
                    addEgenskapTabellRow(alias, null, value);
                    break;
                // slår sammen verdier til kommaseparert streng for related tables med bare et verdifelt
                case 'FS_SikraFO_Tilretteleggingstiltak':
                case 'FS_SikraFO_OmrEgnethet':
                case 'KF_Kulturlandskap_SpesForvStatus':
                case 'BN_Naturtype_Bruk':
                case 'BM_MarinNaturtype_Bruk':
                    var valueSammenslaatt = '';
                    for (var i = 0; i < relatedTableObj.features.length; i++) {
                        value = relatedTableObj.features[i][relatedTableObj.tabellFelt[0]];
                        valueSammenslaatt += value + ', ';
                    }
                    valueSammenslaatt = valueSammenslaatt.slice(0, -2);
                    if (valueSammenslaatt.length > 0) {
                        addEgenskapTabellRow(alias, null, valueSammenslaatt);
                    } else {
                        addEgenskapTabellRow(alias, null, '-');
                    }
                    break;
                case 'FS_SikraFO_TilgjengelighetsGr':
                    for (var i = 0; i < relatedTableObj.features.length; i++) {
                        var valueGruppe = relatedTableObj.features[i][relatedTableObj.tabellFelt[0]];
                        var valueFunksjon = relatedTableObj.features[i][relatedTableObj.tabellFelt[1]];
                        valueSammenslaattArray.push('Gruppe: ' + valueGruppe + ' / ' + 'Funksjon: ' + valueFunksjon);
                    }
                    addEgenskapTabellMultilineRow(alias, valueSammenslaattArray);
                    break;
                case 'KF_Kulturlandskap_Kilder':
                case 'KU_UtvKulturlandskap_Kilder':
                case 'VV_Naturvern_Kilder':
                case 'VP_ForeslattNaturvern_Kilder':
                case 'BN_Naturtype_Kilder':
                case 'BM_MarinNaturtype_Kilder':
                case 'VM_Ramsar_Kilder':
                case 'BA_ArtFunksjon_Kilder':
                    for (var i = 0; i < relatedTableObj.features.length; i++) {
                        var aar = relatedTableObj.features[i].aar;
                        var navn = relatedTableObj.features[i].navn;
                        var tittel = relatedTableObj.features[i].tittel;
                        var link = relatedTableObj.features[i].link;
                        var valueSammenslaattString = navn;
                        if (aar) {
                            valueSammenslaattString += ' ' + aar + '. ';
                        }
                        if (tittel) {
                            valueSammenslaattString += ' ' + tittel;
                        }
                        if (link) {
                            valueSammenslaattString += ' ' + link;
                        }
                        if (valueSammenslaattString) {
                            valueSammenslaattArray.push(valueSammenslaattString);
                        }
                    }
                    if (valueSammenslaattArray.length > 0) {
                        addEgenskapTabellMultilineRow(alias, valueSammenslaattArray);
                    }
                    break;
                case 'FS_SikraFO_Forvaltningsplan':
                    var forvPlanList = {};
                    var forvaltningsplanFinnes = false;

                    if (relatedTableObj.features.length > 0) {
                        for (var i = 0; i < relatedTableObj.tabellFelt.length; i++) {
                            value = relatedTableObj.features[0][relatedTableObj.tabellFelt[i]];
                            var key = relatedTableObj.tabellFelt[i];
                            if (value) {
                                forvPlanList[key] = value;
                                forvaltningsplanFinnes = true;
                            }
                        }
                    }
                    if (forvaltningsplanFinnes) {
                        addListToSpesialTabell(alias, forvPlanList);
                    }
                    break;
                // Kommaseparert rad for related tables med 2 felt: "felt1-verdi1 (felt2-verdi1), felt1-verdi2 (felt2-verdi2)"
                case 'VV_Naturvern_Kommune':
                case 'KF_Kulturlandskap_Kommune':
                case 'KU_UtvKulturlandskap_Kommune':
                case 'FS_SikraFO_Kommune':
                case 'VP_ForeslattNaturvern_Kommune':
                case 'VM_Ramsar_Kommune':
                case 'FK_Kommuner_BN_BA_FK':
                case 'BN_Kommuner_BN_BA_FK':
                case 'BN_Naturtype_Kommune':
                case 'BM_MarinNaturtype_Kommune':
                case 'BA_Kommuner_BN_BA_FK':
                case 'BA_ArtFunksjon_Kommune':
                case 'VV_Naturvern_Nettverk':
                case 'MS_snoescooter_Kommune':
                    //case 'BA_ArtFunksjon_Omrade_egenskaper':
                    value = '';
                    for (var i = 0; i < relatedTableObj.features.length; i++) {
                        value += relatedTableObj.features[i][relatedTableObj.tabellFelt[0]] + ' (' + relatedTableObj.features[i][relatedTableObj.tabellFelt[1]] + '), ';
                    }
                    value = value.slice(0, -2);
                    addEgenskapTabellRow(alias, null, value);
                    break;
                // Et felt per rad
                case 'VV_Naturvern_Oppsyn':
                case 'VV_Naturvern_ForvMyndURL':
                case 'BA_ArtFunksjon_Omrade_egenskaper':
                    value = '';
                    for (var i = 0; i < relatedTableObj.features.length; i++) {
                        value = relatedTableObj.features[i][relatedTableObj.tabellFelt[0]];
                        valueSammenslaattArray.push(value);
                    }
                    if (valueSammenslaattArray.length > 0) {
                        addEgenskapTabellMultilineRow(alias, valueSammenslaattArray);
                    }
                    break;
                case 'VR_VernRestriksjon_Restriksjon':
                    for (var i = 0; i < relatedTableObj.features.length; i++) {
                        var vr = relatedTableObj.features[i];
                        var periode;
                        if (vr.fraDag && vr.fraMaaned && vr.tilDag && vr.tilMaaned) {
                            periode = '(' + vr.fraDag + '.' + vr.fraMaaned + '-' + vr.tilDag + '.' + vr.tilMaaned + ')';
                        }
                        else {
                            periode = '(tidsrom er ikke angitt)';
                        }
                        valueSammenslaattArray.push(vr.restriksjonstype + ' ' + periode + ' ' + vr.merknad);
                    }
                    if (valueSammenslaattArray.length > 0) {
                        addEgenskapTabellMultilineRow(alias, valueSammenslaattArray);
                    }
                    break;
                default:
                    console.log('>> FEIL: finner ingen håndtering av related table: ' + (relatedTableObj.temaKode + '_' + relatedTableObj.tabellNavn));
            }
            return (null);
        }

        // alias = navn på overskrift
        // forvPlanList = Object med key/value som skal vises rad for rad:
        //      egenskap1: verdi1
        //      egenskap2: verdi2 ... (osv)
        // Returnerer en ferdig tabell som legges inn i 'spesialTabellerBodyDiv'
        // NB! tar ikke imot array av objekt. 
        function addListToSpesialTabell(alias, forvPlanList) {
            spesialTabeller += '<span class="headingMedium">' + alias + '</span><br><br>';

            var tableRow = '<table class="table table-condensed"><thead></thead><tbody>';
            for (var i = 0; i < Object.keys(forvPlanList).length; i++) {
                tableRow += '<tr>';
                var key = Object.keys(forvPlanList)[i];

                tableRow += '<td style="width: 20%"><b>' + capitalize(key) + '</b></td>';
                var value;
                if (forvPlanList[key] != null) {
                    value = forvPlanList[key];
                } else {
                    value = '-';
                }
                tableRow += '<td style="width: 80%">' + value + '</td>';
                tableRow += '</tr>';
            }
            tableRow += '</tbody></table></td></tr>';
            spesialTabeller += tableRow;
        }

        // temaLayerID = id til korrekt Geometri layer (pkt, omr eller linje)
        // temaLayerSymbol = Symbolisering som matcher geometri
        function addLayersToMap(temaLayerID, temaLayerSymbol) {
            var omrRenderer = new SimpleRenderer(temaLayerSymbol);

            // Filtrer vekk unødvendige features TODO: Endre statisk layerdefinisjon
            var featureLayerURL = temaKonfig.temaMapserverUrl + temaLayerID;
            var infoTemplate = new InfoTemplate({
                title: temaKonfig.temaNavn,
                content: 'id:  ${' + temaKonfig.temaIdFelt + '}'
            });

            featureLayer = new FeatureLayer(featureLayerURL, {
                id: 'featureLayer',
                outFields: ['*'],
                mode: FeatureLayer.MODE_SNAPSHOT,
                showAttribution: true,
                definitionExpression: temaKonfig.temaIdFelt + '=\'' + temaId + '\'',
                infoTemplate: infoTemplate
                ,maxAllowableOffset: 4
            });
            featureLayer.setRenderer(omrRenderer);

            // Legg til DynamicMap med de layerne som er definert temaKonfig
            var dynamicMapImageParameters = new ImageParameters();
            dynamicMapImageParameters.layerIds = [];
            dynamicMapImageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            dynamicMapImageParameters.format = 'png24';
            if (temaKonfig.temaLayerId.omr != null) {
                dynamicMapImageParameters.layerIds.push(temaKonfig.temaLayerId.omr);
            }
            if (temaKonfig.temaLayerId.pkt != null) {
                dynamicMapImageParameters.layerIds.push(temaKonfig.temaLayerId.pkt);
            }
            if (temaKonfig.temaLayerId.linje != null) {
                dynamicMapImageParameters.layerIds.push(temaKonfig.temaLayerId.linje);
            }

            var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer(temaKonfig.temaMapserverUrl, {
                id: 'dynamicMapServiceLayer',
                imageParameters: dynamicMapImageParameters,
                opacity: 0.40
            });

            //featureLayer.setDefinitionExpression("friluftId='FS00002301'");
            map.addLayers([tiledLayer, featureLayer, dynamicMapServiceLayer]);
            return (featureLayer);
        }

        // Brukes for å hente VR informasjon til VV faktaark (kalles kun når temaKode = 'VV')
        // Kaller først VR-geometrilayer for å finne hvilke VR som tilhører det aktuelle Verneområdet (VV)
        // Kaller deretter layer for tabell restriksjoner for å finne alle enkeltrestriksjoner
        // Funksjonen etter at alt annet er lagt til i egenskapstabellen i faktaarket
        function hentVernRestriksjoner() {
            var temaKonfigVR = $.grep(temaKonfigArray, function (e) {
                return e.temaKode == 'VR';
            })[0];
            var temaKonfigVR_restriksjon = $.grep(temaKonfigVR.relatedTables, function (e) {
                return e.relatedTableName == 'VernRestriksjon_Restriksjon';
            })[0];

            // Finner VR Områder som har naturvernId = temaId
            var featureLayerURL = temaKonfigVR.temaMapserverUrl + temaKonfigVR.temaLayerId.omr;
            featureLayer = new FeatureLayer(featureLayerURL, {
                id: 'featureLayer',
                outFields: ['*'],
                mode: FeatureLayer.MODE_SNAPSHOT,
                definitionExpression: 'naturvernId=\'' + temaId + '\''
            });
            var tableQuery = new Query({
                where: 'naturvernId=\'' + temaId + '\'',
                outFields: ['*']
            });

            // Kjør query mot VR Område layer (hovedtabell)
            featureLayer.queryFeatures(tableQuery).then(function (result) {
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
                // Query(s) mot hvert enkelt VR område
                all(deferredQueriesVRRestriksjoner).then(
                    function (deferredResultsVR) {
                      var vrRestriksjonerArr = [];
                        if (deferredResultsVR[0]) {
                            var domainCodeList = deferredResultsVR[0].features[0].getLayer().getDomain('restriksjonstype');
                        }
                        for (var i = 0; i < deferredResultsVR.length; i++) {
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
                                });
                            }
                        }
                        // console.log(vrRestriksjonerArr);
                        if (vrRestriksjonerArr.length > 0) {
                            addVRTableRow('Restriksjonsområder', vrRestriksjonerArr);
                        }
                    }
                );   
            });
       }

        function addVRTableRow(alias, vernRestriksjonerArray) {
            var tableRow = '<tr><td><b>' + alias + '</b></td><td>';
            for (var i = 0; i < vernRestriksjonerArray.length; i++) {
                var id = vernRestriksjonerArray[i].id;
                if (i > 0) {
                    tableRow += '<br>';
                } 
                if (vrResultArr[i].likGeometriVernOmr == 1) {
                    var sonetekst = ' (hele verneområdet)';
                }
                else if (vrResultArr[i].likGeometriVernOmr == 0) {
                    var sonetekst = ' (sone)'
                }
                else {
                    var sonetekst = ' (sone)'
                }
                tableRow +=(id + sonetekst + ' <a href="' + location.origin + '?id=' + id + '" target="_blank">Faktaark</a>:<br>');
                for (var j = 0; j < vernRestriksjonerArray[i].restriksjoner.length; j ++) {
                    var vr = vernRestriksjonerArray[i].restriksjoner[j];
                    var periode;
                    if (vr.fraDag && vr.fraMaaned && vr.tilDag && vr.tilMaaned) {
                        periode = '(' + vr.fraDag + '.' + vr.fraMaaned + '-' + vr.tilDag + '.' + vr.tilMaaned + ')';
                    }
                    else {
                        periode = '(tidsrom er ikke angitt)';
                    }
                    tableRow += vr.restriksjon + ' ' + periode + ' ' + (vr.merknad || '');
                    if (j < vernRestriksjonerArray[i].restriksjoner.length-1) {
                        tableRow += '<br>';
                    }
                }
                tableRow += '<br>';
           }
            tableRow += '</td></tr>';
            $(tableRow).appendTo("#egenskapTabellBodyDiv")
        }
    }
);

// Legg til rad i hovedtabell for egenskaper
function addEgenskapTabellRow(alias, codedValue, value) {
    if (alias != "") // Legger ikke til rad om det ikke finnes et feltnavn
    {
        tableRow = '<tr><td><b>' + alias + '</b></td><td>';
        if (codedValue) {
            tableRow += codedValue;
        } else {
            tableRow += value;
        }
        tableRow += '</td></tr>';
        egenskapTabellRows.push(tableRow);
    }
}

// legg til rad som har flere verdier i verdifelt, skilt med <br/>
function addEgenskapTabellMultilineRow(alias, valueArray) {
    tableRow = '<tr><td><b>' + alias + '</b></td><td>';
    for (var i = 0; i < valueArray.length; i++) {
        tableRow += valueArray[i] + '<br/>';
    }
    tableRow = tableRow.slice(0, -5);
    tableRow += '</td></tr>';
    egenskapTabellRows.push(tableRow);
}

function getFeltAlias(featureLayer, felt) {
    for (var i = 0; i < featureLayer.fields.length; i++) {
        if (featureLayer.fields[i].name == felt) {
            return (featureLayer.fields[i].alias);
        }
    }
    return (null);
}

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

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search.toLowerCase()) || [, ''])[1].replace(/\+/g, '%20')) || null;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function convertDate(dato) {
    if (dato) {
        return (locale.format(new Date(date), {
            selector: 'date',
            formatLength: 'short'
        }));
    } else {
        return ('');
    }
}