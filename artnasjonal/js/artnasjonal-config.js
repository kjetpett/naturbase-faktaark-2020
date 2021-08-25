var observasjonerTableURL = "https://testarcgis02.miljodirektoratet.no/arcgis/rest/services/faktaark/artnasjonal2/MapServer/11";
var punktLayerURL = "https://testarcgis02.miljodirektoratet.no/arcgis/rest/services/faktaark/artnasjonal2/MapServer/0";
var omrLayerURL = "https://testarcgis02.miljodirektoratet.no/arcgis/rest/services/faktaark/artnasjonal2/MapServer/1";
var basisKartUrl = 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBasis/MapServer';
var apiKey = "AAPK861135bc1c2345a1a7c3924b8e8529d69o1ebnK0M-FC6d5XRaylr4i2I6TSWYJi5Pvn590sC5kGdAufxmk61Ly1kxaswr2N"; // Settes i https://developers.arcgis.com/ item: 01c388f662674c66862c4697572bb9b3

const funnFeltdefinisjoner = [
    { navn: 'CollectedDate',        type: 'epochiso' },
    { navn: 'Behavior',             type: 'text'     },
    { navn: 'Notes',                type: 'text'     },
    { navn: 'Locality',             type: 'text'     },
    { navn: 'Count_',               type: 'int'      },            
    { navn: 'Sex',                  type: 'text'     },
    { navn: 'Habitat',              type: 'text'     },
    { navn: 'Collector',            type: 'text'     },
    { navn: 'BasisOfRecord',        type: 'text'     },
    { navn: 'IdentifiedBy',         type: 'text'     },
    { navn: 'DatetimeIdentified',   type: 'epochiso' },
    { navn: 'Institution',          type: 'text'     },
    { navn: 'Collection',           type: 'text'     },
    { navn: 'Id',                   type: 'text'     },
    { navn: 'ObsUrl',               type: 'url'      },
    { navn: 'DetailUrl',            type: 'url'      },
    { navn: 'ArtskartURL',          type: 'url'      }             
];

const feltDefinisjoner1 = [
    { navn: 'ArtNasjonalId',        type: 'text',   alias: 'ArtNasjonalId'             },
    { navn: 'VitenskapeligNavn',    type: 'text',   alias: 'Vitenskapelig navn'        },
    { navn: 'VitenskapeligNavnId',  type: 'text',   alias: 'Vitenskapelig navn Id'     },
    { navn: 'NorskNavn',            type: 'text',   alias: 'Norsk navn'                },
    { navn: 'Gruppe',               type: 'text',   alias: 'Artsgruppe'                },
    { navn: 'Aktivitet',            type: 'text',   alias: 'Aktivitet'                 },
    { navn: 'AntallObservasjoner',  type: 'int',    alias: 'Antall enkeltobservasjoner'},
    { navn: 'DatoFra',              type: 'epoch',  alias: 'Dato fra'                  },
    { navn: 'DatoTil',              type: 'epoch',  alias: 'Dato til'                  },
    { navn: 'Presisjon',            type: 'int',    alias: 'Presisjon (m)'             },
    { navn: 'Status',               type: 'text',   alias: 'Rødlistekategori'          },
    { navn: 'Kommune',              type: 'text',   alias: 'Kommune (kommunenummer)'   },
    { navn: 'Fylke',                type: 'text',   alias: 'Fylke'                     },
    { navn: 'SHAPE.STArea()',       type: 'starea', alias: 'Areal (m²)'                }
    // { navn: 'Krit_Kombinert',       type: 'text',   alias: 'Utvalgskriterier'          }
];

const kriterierFeltdefinisjoner = [
    { navn: 'Krit_Ansvarsart',      forklaring: 'Norge har mer enn 25% av artens europeiske bestand',                                                                   alias: 'Ansvarsart'},
    { navn: 'Krit_TruetArt',        forklaring: 'Kategoriene Kritisk truet (CR), Sterkt truet (EN) og Sårbar (VU) i Norsk rødliste for arter, Norge (Artsdatabanken)',  alias: 'Truet art'},
    { navn: 'Krit_AndreSpesHensyn', forklaring: 'Andre arter av nasjonal forvaltningsinteresse, utvalgt av Miljødirektoratet',                                          alias: 'Annen spesielt hensynskrevende art'},
    { navn: 'Krit_SpesOkologisk',   forklaring: 'Former eller underarter av arter av nasjonal forvaltningsinteresse som ikke vurderes i rødlisten',                     alias: 'Spesiell økologisk form'},
    { navn: 'Krit_PrioritertArt',   forklaring: 'Prioritert art i medhold av naturmangfoldloven',                                                                       alias: 'Prioritert art'},
    { navn: 'Krit_FredetArt',       forklaring: 'fredet i medhold av naturvernloven',                                                                                   alias: 'Fredet art'},
    { navn: 'Krit_NarTruetArt',     forklaring: 'Kategorien Nær truet (NT) i Norsk rødliste for arter, Norge (Artsdatabanken)',                                         alias: 'Nær truet art'},
    { navn: 'Krit_FremmedArt',      forklaring: 'Kategoriene Svært høy risiko (SE) og Høy risiko (HI) i Fremmedartslista (Artsdatabanken)',                             alias: 'Fremmed art'}
];
