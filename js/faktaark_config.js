/* exported basisKartUrl */
var basisKartUrl = 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBasis/MapServer';

/* exported dokumentUrl */
var dokumentUrl = 'https://felles.naturbase.no/api/dokument?objektID=';

/* ArcGIS Server for faktaarktjenester */
// var ServerUrl = 'https://arcgis03.miljodirektoratet.no/arcgis/rest/services/';
var ServerUrl = 'https://testarcgis02.miljodirektoratet.no/arcgis/rest/services/';

/* exported temaKonfigArray */
var temaKonfigArray = [{
    temaKode: 'FS',
    temaNavn: 'Statlig sikra friluftslivsområde',
    temaIdFelt: 'friluftId',
    temaMapserverUrl: ServerUrl + 'faktaark/friluftsliv_statlig_sikra/MapServer/',
    temaLayerId: {omr: 0, pkt: null, linje: null},
    overskriftFelt: ['omraadeNavn'], 
    felt: ['friluftId', 'driftstilsynAnsvarlig', 'omraadeBeskrivelse', 'omraadeVerdi', 'bruksfrekvens', 'brukergrupper', 'offentligKommunikasjon','SHAPE.STArea()'],
    relatedTables: [{
        relatedTableName: 'SikraFO_Kommune',                    
        tableId: 12,
        relatedTableAlias: 'Kommuner',
        felt: ['kommuneNavn', 'kommune']
    }, {
        relatedTableName: 'SikraFO_Forvaltningsplan',           
        tableId: 11,
        relatedTableAlias: 'Forvaltningsplan',
        felt: ['annet', 'atkomst', 'bygninger', 'egnetBruk', 'kulturminner', 'naturgrunnlag', 'sammendrag', 'tilrettelegging']
    }, {
        relatedTableName: 'SikraFO_OmrEgnethet',                
        tableId: 13,
        relatedTableAlias: 'Egnethet',
        felt: ['omraadeEgnethet']
    }, {
        relatedTableName: 'SikraFO_TilgjengelighetsGr',         
        tableId: 14,
        relatedTableAlias: 'Tilgjengelighet funksjonshemmede',
        felt: ['tilgjenglighetsGruppe', 'tilgjengeligFunksjon']
    }, {
        relatedTableName: 'SikraFO_Tilretteleggingstiltak',     
        tableId: 15,
        relatedTableAlias: 'Tilretteleggingstiltak',
        felt: ['tilretteleggingstiltak']
    }, {
        relatedTableName: 'SikraFO_SikraEiendom',               
        tableId: 17,
        relatedTableAlias: 'Sikra Eiendommer (GNr/BNr (år))',
        felt: ['gaardsnr', 'bruksnr','sikringsAar']
    }]
}, {
    temaKode: 'VV',
    temaNavn: 'Verneområde',
    temaIdFelt: 'naturvernId',
    temaMapserverUrl: ServerUrl + 'faktaark/vern/MapServer/',
    temaLayerId: {omr: 0, pkt: null, linje: null},
    overskriftFelt: ['navn', 'verneform'],
    felt: ['naturvernId','offisieltNavn','verneplan','vernedato','revisjon','foerstegangVernet','verneforskrift','iucn','beskrivelseGenerell',
        'beskrivelseVerneformaal','beskrivelseNaturfagligKvalitet','beskrivelsePaavirkning','beskrivelseTiltak','forvaltningsmyndighet',
        'forvaltningsmyndighetType','planbehov','forvaltningsplan','forvaltningsplanDato','skjoetselplan','skjoetselplanDato',
        'SHAPE.STArea()','landareal','sjoeareal','majorEcosystemType','marineAreaPercentage','truetVurdering','tiltaksbehov','overvaakningsbehov'],
    relatedTables: [{
        relatedTableName: 'Naturvern_Kommune',            
        tableId: 11,
        relatedTableAlias: 'Kommuner',
        felt: ['kommuneNavn', 'kommune']
    }
    // , {
    //     relatedTableName: 'Naturvern_Nettverk',            
    //     tableId: 12,
    //     relatedTableAlias: 'Nettverk',
    //     felt: ['nettverkNavn', 'nettverkId']
    // }
    ,{
        relatedTableName: 'Naturvern_Oppsyn',              
        tableId: 13,
        relatedTableAlias: 'Oppsyn',
        felt: ['link']
    }, {
        relatedTableName: 'Naturvern_ForvMyndURL',              
        tableId: 14,
        relatedTableAlias: 'Forvaltningsmyndighet URL',
        felt: ['forvaltningsmyndighetURL']
    }, {
        relatedTableName: 'Naturvern_Kilder',              
        tableId: 10,
        relatedTableAlias: 'Kilder',
        felt: ['aar','kildeType','link', 'navn', 'tittel']
    }]    
}, {
    temaKode: 'VP',
    temaNavn: 'Foreslått Verneområde',
    temaIdFelt: 'foreslattVernId',
    temaMapserverUrl: ServerUrl + 'faktaark/vern/MapServer/',
    temaLayerId: {omr: 1, pkt: null, linje: null},
    overskriftFelt: ['navn'], 
    felt: ['foreslattVernId', 'verneform', 'verneplan', 'beskrivelse', 'SHAPE.STArea()'],
    relatedTables: [{
        relatedTableName: 'ForeslattNaturvern_Kommune',            
        tableId: 16,
        relatedTableAlias: 'Kommuner',
        felt: ['kommuneNavn', 'kommune']
    }, {
        relatedTableName: 'ForeslattNaturvern_Kilder',             
        tableId: 15,
        relatedTableAlias: 'Kilder',
        felt: ['aar','kildeType','link', 'navn', 'tittel']
    }]
}, {
    temaKode: 'VR',
    temaNavn: 'Vern restriksjonsområde',
    temaIdFelt: 'vernRestriksjonId',
    temaMapserverUrl: ServerUrl + 'faktaark/vern/MapServer/',
    temaLayerId: {omr: 3, pkt: null, linje: null},
    overskriftFelt: ['navn', 'verneform'],
    felt: ['vernRestriksjonId', 'naturvernId', 'likGeometriVernOmr', 'andreVRiVerneomr'],
    relatedTables: [{
        relatedTableName: 'VernRestriksjon_Restriksjon',             
        tableId: 19,
        relatedTableAlias: 'Restriksjoner',
        felt: ['restriksjonstype','fraDag','fraMaaned', 'tilDag', 'tilMaaned', 'merknad']
    }]
}, {
    temaKode: 'VM',
    temaNavn: 'Vern Ramsar område',
    temaMapserverUrl: ServerUrl + 'faktaark/vern/MapServer/',
    temaIdFelt: 'ramsarId',
    temaLayerId: {omr: 2, pkt: null, linje: null},
    overskriftFelt: ['norskNavn'],
    felt: ['ramsarId', 'engelskNavn', 'omraadeBeskrivelse', 'siteNumber', 'RamsarSIS_Url', 'truetArtikkel32', 'truetArtikkel32Beskrivelse'],
    relatedTables: [{
        relatedTableName: 'Ramsar_Kommune',            
        tableId: 18,
        relatedTableAlias: 'Kommuner',
        felt: ['kommuneNavn', 'kommune']
    }, {
        relatedTableName: 'Ramsar_Kilder',             
        tableId: 17,
        relatedTableAlias: 'Kilder',
        felt: ['aar','kildeType','link', 'navn', 'tittel']
    }]
}, {
    temaKode: 'FK',
    temaNavn: 'Kartlagt friluftslivsområde',
    temaIdFelt: 'kartlagtFOID',
    temaMapserverUrl: ServerUrl + 'faktaark/friluftsliv_kartlagt/MapServer/',
    temaLayerId: {omr: 0, pkt: null, linje: null},
    overskriftFelt: ['omraadenavn'],
    felt: ['kartlagtFOID', 'omraadetype', 'omraadeverdi', 'kommune', 'kommuneNavn', 'omraadebeskrivelse', 'kartleggingsaar', 'brukerfrekvens', 'regionaleOgNasjonaleBrukere', 
        'friluftOpphav', 'opplevelseskvaliteter', 'symbolverdi', 'lydMiljoe',
        'funksjon', 'egnethet', 'tilrettelegging', 'kunnskapsverdier', 'inngrep', 'potensiellBruk', 'tilgjengelighet', 'stoey', 'utstrekning', 'SHAPE.STArea()'],
    relatedTables: []
}, {
    temaKode: 'KF',
    temaNavn: 'Verdifulle kulturlandskap',
    temaIdFelt: 'kulturlandskapId',
    temaMapserverUrl: ServerUrl + 'faktaark/kulturlandskap_verdifulle/MapServer/',
    temaLayerId: {omr: 0, pkt: null, linje: null},
    overskriftFelt: ['navn'],
    felt: ['kulturlandskapId', 'kulturminneVerdi', 'biologiskMangfoldVerdi', 'verdi', 'bruksgrad', 'registreringsdato', 'beskrivelse', 
        'beskrivelseBeliggenhet', 'beskrivelseTilstand', 'beskrivelseNaturtyper', 'beskrivelseKulturhistorie', 
        // 'utvalgtKulturlandskap', 'nasjonaltVerdifulltOmraade1994', 'nasjonaltVerdifulltOmraade2018', 'tilskuddsberettiget', 
        'SHAPE.STArea()', 'noeyaktighetsklasse'],
    relatedTables: [{
        relatedTableName: 'Kulturlandskap_Kommune',                 
        tableId: 13,
        relatedTableAlias: 'Kommuner',
        felt: ['kommuneNavn', 'kommune']
    },{
        relatedTableName: 'Kulturlandskap_Kilder',                  
        tableId: 12,
        relatedTableAlias: 'Kilder',
        felt: ['aar', 'kildeType', 'link', 'navn', 'tittel']
    },{
        relatedTableName: 'Kulturlandskap_SpesForvStatus',            
        tableId: 11,
        relatedTableAlias: 'Spesiell forvaltningsstatus',
        felt: ['spesiellForvaltningsstatus']
    }]
}, {
    temaKode: 'KU',
    temaNavn: 'Utvalgte kulturlandskap',
    temaIdFelt: 'utvKulturlandskapId',
    temaMapserverUrl: ServerUrl + 'faktaark/kulturlandskap_utvalgte/MapServer/',
    temaLayerId: {omr: 0, pkt: null, linje: null},
    overskriftFelt: ['navn'],
    felt: ['utvKulturlandskapId', 'jordbruksregion', 'landskapsregion', 'beskrivelseLandbruksdirUrl', 'historiskeBilderUrl', 'SHAPE.STArea()','noeyaktighetsklasse'],
    relatedTables: [{
        relatedTableName: 'UtvKulturlandskap_Kommune',                 
        tableId: 11,
        relatedTableAlias: 'Kommuner',
        felt: ['kommuneNavn','kommune']
    }, {
        relatedTableName: 'UtvKulturlandskap_Kilder',                  
        tableId: 12,
        relatedTableAlias: 'Kilder',
        felt: ['aar', 'kildeType', 'link', 'navn', 'tittel']
    }]
}, {
    temaKode: 'BV',
    temaNavn: 'Villreinområder',
    temaIdFelt: 'villreinId',
    temaMapserverUrl: ServerUrl + 'faktaark/villrein/MapServer/',
    temaLayerId: {omr: 1, pkt: null, linje: 0},
    overskriftFelt: ['omraadenavn'],
    felt: ['villreinId', 'registreringsdato', 'nasjonalt_villreinomraade', 'funksjon', 'funksjonsperiode', 'europeisk_villreinregion',
            'bmverdi', 'villreinnemdId', 'noeyaktighetsklasse', 'villreinomraadeId', 'finner', 'opphav'],
    relatedTables: []
}, {
    temaKode: 'BN',
    temaNavn: 'Naturtyper',
    temaIdFelt: 'naturtypeId',
    temaMapserverUrl: ServerUrl + 'faktaark/naturtyper/MapServer/',
    temaLayerId: {omr: 0, pkt: null, linje: null},
    overskriftFelt: ['omraadenavn'],
    felt: ['naturtypeId', 'naturtype', 'utforming', 'verdi', 'utvalgtNaturtype', 'registreringsDato', 'hevdstatus',
        'forvaltningsplan', 'forvaltningsavtale', 'forvaltningsavtaleInngaatt', 'forvaltningsavtaleUtloeper', 'verdiBegrunnelse',
        'innledning', 'beliggenhetOgNaturgrunnlag', 'naturtyperOgUtforminger','artsmangfold', 'paavirkning', 'fremmedeArter', 
        'raadOmSkjoetselOgHensyn', 'landskap', 'SHAPE.STArea()'],
    relatedTables: [{
        relatedTableName: 'Naturtype_Kommune',                 
        tableId: 11,
        relatedTableAlias: 'Kommuner',
        felt: ['kommune','kommuneNavn']
    }, {
        relatedTableName: 'Naturtype_Kilder',                  
        tableId: 12,
        relatedTableAlias: 'Kilder',
        felt: ['aar', 'kildeType', 'link', 'navn', 'tittel']
    }]
}, {
    temaKode: 'BM',
    temaNavn: 'Marine naturtyper',
    temaIdFelt: 'marinNaturtypeId',
    temaMapserverUrl: ServerUrl + 'faktaark/naturtyper/MapServer/',
    temaLayerId: {omr: 1, pkt: null, linje: null},
    overskriftFelt: ['omraadenavn'],    
    felt: ['marinNaturtypeId', 'naturtype', 'utforming', 'verdi', 'registreringsDato', 'noeyaktighetsklasse', 'verdiBegrunnelse',
        'innledning', 'beliggenhetOgNaturgrunnlag', 'artsmangfold', 'paavirkning', 'fremmedeArter', 'raadOmSkjoetselOgHensyn', 
        'landskap', 'SHAPE.STArea()'],
    relatedTables: [{
        relatedTableName: 'MarinNaturtype_Kommune',                 
        tableId: 21,
        relatedTableAlias: 'Kommuner',
        felt: ['kommune','kommuneNavn']
    }, {
        relatedTableName: 'MarinNaturtype_Kilder',
        tableId: 22,
        relatedTableAlias: 'Kilder',
        felt: ['aar', 'kildeType', 'link', 'navn', 'tittel']
    }]
}, {
    // Ny tjeneste for BA
    temaKode: 'BA',
    temaNavn: 'Funksjonsområde for arter',
    temaIdFelt: 'artFunksjonId',
    temaMapserverUrl: ServerUrl + 'faktaark/artfunksjon/MapServer/',
    temaLayerId: {omr: 0, pkt: null, linje: null},
    overskriftFelt: ['omraadeNavn'],
    felt: ['artFunksjonId', 'totalAreal', 'noeyaktighetsklasse'],
    relatedTables: [{
        relatedTableName: 'ArtFunksjon_Omrade_egenskaper',                 
        tableId: 14,
        relatedTableAlias: 'Område beskrivelse',
        felt: ['omraadeBeskrivelse']
    },{
        relatedTableName: 'ArtFunksjon_Kommune',                 
        tableId: 11,
        relatedTableAlias: 'Kommuner',
        felt: ['kommune','kommuneNavn']
    },{
        relatedTableName: 'ArtFunksjon_Kilder',                  
        tableId: 13,
        relatedTableAlias: 'Kilder',
        felt: ['Kildetype', 'Link', 'Navn', 'Tittel']
    },{
        relatedTableName: 'ArtFunksjon_Forekomst',                  
        tableId: 12,
        relatedTableAlias: 'Artsforekomster',
        felt: ['norskNavn', 'vitenskapeligNavn', 'vitenskapeligNavnId', 'funksjon', 'registreringsDato', 'verdi',
            'prioritertArt','bern','bonn','roedlisteStatus','aarstid']
    }]
}, 
    // {
    //     // gammel NB3 BA
    //     temaKode: 'BA',
    //     temaNavn: 'Funksjonsområde for arter',
    //     temaIdFelt: 'IID',
    //     temaMapserverUrl: ServerUrl + 'faktaark/temp_bn_ba_fk/MapServer/',
    //     temaLayerId: {omr: 2, pkt: 3, linje: 4},
    //     overskriftFelt: ['Omradenavn'],
    //     felt: ['IID', 'Omradebeskrivelse', 'Totalareal'],
    //     relatedTables: [{
    //         relatedTableName: 'Kommuner_BN_BA_FK',                 
    //         tableId: 12,
    //         relatedTableAlias: 'Kommuner',
    //         felt: ['Kommune','NAVN']
    //     },{
    //         relatedTableName: 'BA_Kilder',                  
    //         tableId: 13,
    //         relatedTableAlias: 'Kilder',
    //         felt: ['Ar', 'Kildetype', 'Link', 'Navn', 'Tittel']
    //     },{
    //         relatedTableName: 'BA_ArtFunksjon',                  
    //         tableId: 14,
    //         relatedTableAlias: 'Arter',
    //         felt: ['NorskNavn', 'VitenskapeligNavn', 'FunksjonBeskrivelse', 'Registreringdato', 'Verdi',
    //             'VerdiBeskrivelse','PrioritertArt','Bern','Bonn','Rodlistestatus','ArstidBeskrivelse','StedkvalitetBeskrivelse']
    //     }]
    // }, 
{
    temaKode: 'MS',
    temaNavn: 'Snøscooterløyper',
    temaIdFelt: 'snoescooterloeyperID',
    temaMapserverUrl: ServerUrl + 'faktaark/motorferdsel/MapServer/',
    temaLayerId: {omr: null, pkt: null, linje: 0},
    overskriftFelt: ['navn'],
    felt: ['snoescooterloeyperID', 'navn', 'merking', 'loeypetype', 'loeypestatus', 'forskrift', 'aapnesDato', 'stengesDato',
    'aapnesKlokka', 'stengesKlokka', 'vedtaksmyndighet', 'vedlikeholdsansvarlig', 'vedtaksdato', 'fartsgrense', 'ruteFoelger', 'rastingTillat',
    'rasteAvstand', 'loeypebredde', 'midlertidigStengt', 'midlertidigStengtAarsak', 'datafangstdato', 'noeyaktighet', 'informasjon', 'SHAPE.STLength()'],
    relatedTables: [{
        relatedTableName: 'snoescooter_Kommune',                  
        tableId: 11,
        relatedTableAlias: 'Kommuner',
        felt: ['kommune', 'kommuneNavn']
    }]
}];