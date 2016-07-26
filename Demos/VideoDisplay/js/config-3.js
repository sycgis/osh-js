function init() {

    //--------------------------------------------------------------//
    //--------------------- Creates dataSources --------------------//
    //--------------------------------------------------------------//

    //--Android Phone Video
    var androidPhoneGpsDataSource = new OSH.DataReceiver.LatLonAlt("android-GPS", {
        protocol: "ws",
        service: "SOS",
        endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
        offeringID: "urn:android:device:060693280a28e015-sos",
        observedProperty: "http://sensorml.com/ont/swe/property/Location",
        startTime: "2015-02-16T07:58:00Z",
        endTime: "2015-02-16T08:09:00Z",
        replaySpeed: "1"
    });

    var androidPhoneOrientationDataSource = new OSH.DataReceiver.OrientationQuaternion("android-Orientation", {
        protocol: "ws",
        service: "SOS",
        endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
        offeringID: "urn:android:device:060693280a28e015-sos",
        observedProperty: "http://sensorml.com/ont/swe/property/OrientationQuaternion",
        startTime: "2015-02-16T07:58:00Z",
        endTime: "2015-02-16T08:09:00Z",
        replaySpeed: "1"
    });

    var androidPhoneVideoDataSource = new OSH.DataReceiver.VideoMjpeg("android-Video", {
        protocol: "ws",
        service: "SOS",
        endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
        offeringID: "urn:android:device:060693280a28e015-sos",
        observedProperty: "http://sensorml.com/ont/swe/property/VideoFrame",
        startTime: "2015-02-16T07:58:00Z",
        endTime: "2015-02-16T08:09:00Z",
        replaySpeed: "1"
    });

    var weatherDataSource = new OSH.DataReceiver.Chart("weather", {
        protocol: "ws",
        service: "SOS",
        endpointUrl: "sensiasoft.net:8181/sensorhub/sos",
        offeringID: "urn:mysos:offering03",
        observedProperty: "http://sensorml.com/ont/swe/property/Weather",
        startTime: "now",
        endTime: "2055-01-01Z"
    });

    var taskingVideoDataSource = new OSH.DataSender.Tasking("video-tasking", {
        protocol: "http",
        service: "SPS",
        version: "2.0",
        endpointUrl: "ENDPOINT_URL",
        offeringID: "OFFERING_ID"
    });

    //-----------------------------------------------------------//
    //--------------------- Creates menus -----------------------//
    //-----------------------------------------------------------//

    var circularContextMenuId = "menu-"+OSH.Utils.randomUUID();
    var stackContextMenuId = "menu-"+OSH.Utils.randomUUID();
    var androidMenuGroupId = "menu-"+OSH.Utils.randomUUID();

    //-----------------------------------------------------------//
    //--------------------- Creates entities --------------------//
    //-----------------------------------------------------------//

    var androidEntity = {
        id : "entity-"+OSH.Utils.randomUUID(),
        name: "Android Phone",
        dataSources: [androidPhoneGpsDataSource, androidPhoneOrientationDataSource,androidPhoneVideoDataSource,weatherDataSource]
    };

    //--------------------------------------------------------//
    //--------------------- Creates views --------------------//
    //--------------------------------------------------------//

    // Video 1 View
    var videoView = new OSH.UI.MjpegView(null, {
        dataSourceId: androidPhoneVideoDataSource.getId(),
        entityId : androidEntity.id,
        css: "video",
        cssSelected: "video-selected",
        name: "Android Video"
    });

    // Video 2 View
    var videoView2 = new OSH.UI.MjpegView(null, {
        dataSourceId: androidPhoneVideoDataSource.getId(),
        entityId : androidEntity.id,
        css: "video",
        cssSelected: "video-selected",
        name: "Android Video 2"
    });

    // Chart View
    var windSpeedChartView = new OSH.UI.Nvd3CurveChartView(null,
        [{
            styler: new OSH.UI.Styler.Curve({
                valuesFunc: {
                    dataSourceIds: [weatherDataSource.getId()],
                    handler: function (rec, timeStamp) {
                        return {
                            x: timeStamp,
                            y: parseFloat(rec[2])
                        };
                    }
                }
            })
        }],
        {
            name: "WindSpeed chart",
            yLabel: 'Wind Speed (m/s)',
            xLabel: 'Time',
            css:"chart-view",
            cssSelected: "video-selected"
        }
    );

    var entityTreeView = new OSH.UI.EntityTreeView(null,
            [{
                entity : androidEntity,
                path: "Sensors/Toulouse",
                treeIcon : "images/android_icon.png",
                contextMenuId: stackContextMenuId
            }],
        {
            css: "tree-container"
        }
    );

    var pointMarker = new OSH.UI.Styler.PointMarker({
        location : {
            x : 1.42376557,
            y : 43.61758626,
            z : 100
        },
        locationFunc : {
            dataSourceIds : [androidPhoneGpsDataSource.getId()],
            handler : function(rec) {
                return {
                    x : rec.lon,
                    y : rec.lat,
                    z : rec.alt
                };
            }
        },
        orientationFunc : {
            dataSourceIds : [androidPhoneOrientationDataSource.getId()],
            handler : function(rec) {
                return {
                    heading : rec.heading
                };
            }
        },
        icon : 'images/cameralook.png',
        iconFunc : {
            dataSourceIds: [androidPhoneGpsDataSource.getId()],
            handler : function(rec,timeStamp,options) {
                if(options.selected) {
                    return 'images/cameralook-selected.png'
                } else {
                    return 'images/cameralook.png';
                };
            }
        }
    });

    var leafletMapView = new OSH.UI.LeafletView(null,
        [{
            styler :  pointMarker,
            contextMenuId: circularContextMenuId,
            name : "Android Phone GPS",
            entityId : androidEntity.id
        },
            {
                styler : new OSH.UI.Styler.Polyline({
                    locationFunc : {
                        dataSourceIds : [androidPhoneGpsDataSource.getId()],
                        handler : function(rec) {
                            return {
                                x : rec.lon,
                                y : rec.lat,
                                z : rec.alt
                            };
                        }
                    },
                    color : 'rgba(0,0,255,0.5)',
                    weight : 10,
                    opacity : .5,
                    smoothFactor : 1,
                    maxPoints : 200
                }),
                name : "Android Phone GPS Path",
                entityId : androidEntity.id
            }]
    );

    var cesiumMapView = new OSH.UI.CesiumView(null,
        [{
            styler :  pointMarker,
            contextMenuId: circularContextMenuId,
            name : "Android Phone GPS",
            entityId : androidEntity.id
        },
            {
                styler : new OSH.UI.Styler.Polyline({
                    locationFunc : {
                        dataSourceIds : [androidPhoneGpsDataSource.getId()],
                        handler : function(rec) {
                            return {
                                x : rec.lon,
                                y : rec.lat,
                                z : rec.alt
                            };
                        }
                    },
                    color : 'rgba(0,0,255,0.5)',
                    weight : 10,
                    opacity : .5,
                    smoothFactor : 1,
                    maxPoints : 200
                }),
                name : "Android Phone GPS Path",
                entityId : androidEntity.id
            }]
    );

    var mapView = new OSH.UI.LeafletView("main-container",
        [{
            styler :  pointMarker,
            contextMenuId: circularContextMenuId,
            name : "Android Phone GPS",
            entityId : androidEntity.id
        },
        {
            styler : new OSH.UI.Styler.Polyline({
                locationFunc : {
                    dataSourceIds : [androidPhoneGpsDataSource.getId()],
                    handler : function(rec) {
                        return {
                            x : rec.lon,
                            y : rec.lat,
                            z : rec.alt
                        };
                    }
                },
                color : 'rgba(0,0,255,0.5)',
                weight : 10,
                opacity : .5,
                smoothFactor : 1,
                maxPoints : 200
            }),
            name : "Android Phone GPS Path",
            entityId : androidEntity.id
        }]
    );

    /*var taskingView = new OSH.UI.TaskingView("tasking-container",{
        dataSourceId : ""
    });*/

    // creates Dialog Views
    var videoDialog         = createDialog("dialog-main-container",videoView,"Android Video 1",true);
    var videoDialog2        = createDialog("dialog-main-container",videoView2,"Android Video 2",false);
    var chartDialog         = createDialog("dialog-main-container",windSpeedChartView,"Chart Weather",true);
    var leafletMapDialog         = createDialog("dialog-main-container",leafletMapView,"Leaflet 2D",true);
    var cesiumMapDialog         = createDialog("dialog-main-container",cesiumMapView,"Cesium 3D",true);
    var entityTreeDialog    = new OSH.UI.DialogView(document.body, entityTreeView,{
        css: "tree-dialog",
        name: "Entities",
        show:true,
        draggable:true,
        dockable: false,
        closeable: false
    });

    //-----------------------------------------------------------//
    //----------------- Creates Contextual Menus------------------//
    //-----------------------------------------------------------//

    var menuItems = [{
        name: "Android Video",
        viewId: videoDialog.getId(),
        css: "fa fa-video-camera"
    },{
        name: "Same Android Video",
        viewId: videoDialog2.getId(),
        css: "fa fa-video-camera"
    },{
        name: "Weather chart",
        viewId: chartDialog.getId(),
        css: "fa fa-bar-chart"
    },{
        name: "Leaflet 2D",
        viewId: leafletMapDialog.getId(),
        css: "fa fa-map"
    },{
        name: "Cesium 3D",
        viewId: cesiumMapDialog.getId(),
        css: "fa fa-globe"
    },{
        name: "Tasking",
        viewId: "",
        css: "fa fa-arrows"
    }];

    var contextCircularMenu = new OSH.UI.ContextMenu.CircularMenu({id : circularContextMenuId,groupId: androidMenuGroupId,items : menuItems});
    var contextStackMenu = new OSH.UI.ContextMenu.StackMenu({id : stackContextMenuId,groupId: androidMenuGroupId,items : menuItems});

    var rangeSlider = new OSH.UI.RangeSlider("rangeSlider",{
        startTime: "2015-02-16T07:58:00Z",
        endTime: "2015-02-16T08:09:00Z"
    });

    //---------------------------------------------------------------//
    //--------------------- Creates DataProvider --------------------//
    //---------------------------------------------------------------//

    var dataProviderController = new OSH.DataReceiver.DataReceiverController({
        bufferingTime : 5*1000,
        synchronizedTime : true
    });

    dataProviderController.addEntity(androidEntity);
    dataProviderController.addDataSource(weatherDataSource);
    //---------------------------------------------------------------//
    //---------------------------- Starts ---------------------------//
    //---------------------------------------------------------------//

    // starts streaming
    dataProviderController.connectAll();
}

function createDialog(containerDivId,view, title,defaultShow) {
    return new OSH.UI.DialogView(containerDivId, view,{
        draggable: false,
        css: "dialog",
        name: title,
        show:false,
        dockable: true,
        closeable: true,
        canDisconnect : true,
        swapId: "main-container"
    });
}
