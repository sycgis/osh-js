OSH.UI.View = Class.create({
    initialize: function (divId, viewItems,options) {
        this.dataSources = [];
        // list of stylers
        this.stylers = [];
        this.contextMenus = [];
        this.viewItems = [];
        this.names = {};
        this.stylerToObj = {};
        this.stylerIdToStyler = {};
        this.lastRec = {};
        this.selectedDataSources = [];
        this.selectedEntities = [];
        this.dataSources = [];

        this.divId = divId;
        this.id = "view-" + OSH.Utils.randomUUID();

        this.dataSourceId = -1;
        // sets dataSourceId
        if(typeof(options) != "undefined" && typeof(options.dataSourceId) != "undefined") {
            this.dataSourceId = options.dataSourceId;
        }

        if(typeof(options) != "undefined" && typeof(options.entityId) != "undefined") {
            this.entityId = options.entityId;
        }
        this.css = "";

        this.cssSelected = "";

        if(typeof(options) != "undefined" && typeof(options.css) != "undefined") {
            this.css = options.css;
        }

        if(typeof(options) != "undefined" && typeof(options.cssSelected) != "undefined") {
            this.cssSelected = options.cssSelected;
        }

        // inits the view before adding the viewItem
        this.init(viewItems,options);
    },

    init:function(viewItems,options) {
        var div = document.getElementById(this.divId);
        if (this.divId == null || div == "undefined" || div == null) {
            var hiddenDiv = document.createElement("div");
            hiddenDiv.style.display = "none";

            document.body.appendChild(hiddenDiv);

            var elementDiv = document.createElement("div");
            elementDiv.setAttribute("id", this.id);
            hiddenDiv.appendChild(elementDiv);
            this.divId = this.id;
        }

        this.beforeAddingItems(options);

        if (typeof (viewItems) != "undefined") {
            for (var i =0;i < viewItems.length;i++) {
                this.addViewItem(viewItems[i]);
            }
        }

        if(typeof (options) != "undefined") {
            if(typeof (options.show) != "undefined") {
                document.getElementById(this.divId).style.display = (options.show)? "block": "none";
            }
        }
        this.handleEvents();

        // observes the event associated to the dataSourceId
        if(typeof(options) != "undefined" && typeof(options.dataSourceId) != "undefined") {
            OSH.EventManager.observe(OSH.EventManager.EVENT.DATA+"-"+options.dataSourceId, function (event) {
                this.setData(options.dataSourceId, event.data);
            }.bind(this));
        }
    },

    beforeAddingItems: function (options) {

    },

    getId: function () {
        return this.id;
    },

    getDivId: function () {
        return this.divId;
    },

    selectDataView: function (dataSourceIds) {
    },

    setData: function(dataSourceId,data) {},

    show: function(properties) {
    },

    shows: function(properties) {
    },
    /**
     * Add viewItem to the view
     */
    addViewItem: function (viewItem) {
        this.viewItems.push(viewItem);
        if (viewItem.hasOwnProperty("styler")) {
            var styler = viewItem.styler;
            this.stylers.push(styler);
            if (viewItem.hasOwnProperty("name")) {
                this.names[styler.getId()] = viewItem.name;
            }
            styler.init(this);
            styler.viewItem = viewItem;
            this.stylerIdToStyler[styler.id] = styler;
        }
        if (viewItem.hasOwnProperty("contextmenu")) {
            this.contextMenus.push(viewItem.contextmenu);
        }
        //for(var dataSourceId in styler.dataSourceToStylerMap) {
        var ds = styler.getDataSourcesIds();
        for(var i =0; i < ds.length;i++) {
            var dataSourceId = ds[i];
            // observes the data come in
            var self = this;
            (function(frozenDataSourceId) { // use a close here to no share the dataSourceId variable
                OSH.EventManager.observe(OSH.EventManager.EVENT.DATA + "-" + frozenDataSourceId, function (event) {
                    var selected = false;
                    // we check only dataSource when the selected entity is not set
                    if (typeof self.selectedEntity == "undefined") {
                        selected = (self.selectedDataSources.indexOf(frozenDataSourceId) > -1);
                    }
                    selected = selected || ((typeof self.selectedEntity != "undefined") && viewItem.entityId == self.selectedEntity);
                    // update the whole corresponding datasources list

                    //TODO: maybe done into the styler?
                    styler.setData(frozenDataSourceId, event.data, self, {
                        selected: selected
                    });
                    self.lastRec[frozenDataSourceId] = event.data;
                });
            })(dataSourceId); //passing the variable to freeze, creating a new closure
        }
    },

    handleEvents: function() {
        // observes the selected event
        OSH.EventManager.observe(OSH.EventManager.EVENT.SELECT_VIEW,function(event){
            this.selectDataView(event.dataSourcesIds,event.entityId);
        }.bind(this));

        // observes the SHOW event
        OSH.EventManager.observe(OSH.EventManager.EVENT.SHOW_VIEW,function(event){
            this.show(event);
        }.bind(this));
    },

    /**
     * Should be called after receiving osh:SELECT_VIEW event
     * @param $super
     * @param dataSourcesIds
     * @param entitiesIds
     */
    selectDataView: function (dataSourcesIds,entityId) {
        if(typeof this.dataSources != "undefined") {
            this.selectedDataSources = dataSourcesIds;
            // set the selected entity even if it is undefined
            // this is handled by the setData function
            this.selectedEntity = entityId;
            for (var j = 0; j < this.dataSources.length; j++) {
                this.setData(this.dataSources[j], this.lastRec[this.dataSources[j]]);
            }
        }
    }
});
