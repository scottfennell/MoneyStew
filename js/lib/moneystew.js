
Ext.ns("MS.app");
MS.APP = Ext.extend(Ext.util.Observable, {

    schema : {
        fields: [
                {name: '_id'},  // I'd love to get rid of this as well
                {name: '_rev'},  // ditto
                {name: 'location'},
                {name: 'address'},
                {name: 'latitude',  type: 'float'},
                {name: 'longitude', type: 'float'}
        ],
        grid:[
            {header: 'Location', width: 200, sortable: true, dataIndex: 'location'},
            //{header: 'Address', renderer: Ext.util.Format.usMoney, dataIndex: 'address'},
            {header: 'Address', dataIndex: 'address'},
            {header: 'Lat', dataIndex: 'latitude'},
            {header: 'Lon', dataIndex: 'longitude'},
        ]
    },

    ledgerschema : {
        fields: [
                {name: '_id'},  // I'd love to get rid of this as well
                {name: '_rev'},  // ditto
                {name: 'amount', type:"float"},
                {name: 'day'},
                {name: 'name'},
		{name: 'repeat'},
		{name: 'type'},
        ]

    },

    
    windowDefault: {
        width:  400,
        height: 300,
        layout: 'fit',
        title: 'Window'
    },
    //active windows
    windows: {},
    tabid: 0,

    constructor : function(config){
        Ext.apply(this, config || {});
        MS.APP.superclass.constructor.apply(this,arguments);
        Ext.onReady(this.start, this);        
    },

    start : function(){
        //this.viewport = new Ext.Viewport(MS.viewport);
        this.viewport = new MS.viewport();
        this.viewport.on('nav',this.dispatch, this);
        this.store = new Ext.ux.data.CouchStore({
            db:    'moneystew',
            view:  'moneystew/all',
            fields:this.schema.fields
        });
        this.store.load({});
	this.ledgerStore = new Ext.ux.data.CouchStore({
            db:    'moneystew',
            view:  'moneystew/ledger',
            fields:this.ledgerschema.fields
        });
	this.ledgerStore.load({});
        this.initModules();
	this.dispatchAction('Ledger', 'ledgerPanel');
    },

    initModules: function(){

        this.Ledger = new MS.Ledger({
	    parent: this,
	    store:  this.ledgerStore
	});
	//this.Schema = new MS.Schema({parent:this});
    },
    dispatchAction: function(module,action){
	if(this[module] && this[module][action]){
            this[module][action]();
        }else{
            this.log("Module or action not defined");
        }
    },
    dispatch: function(node){
        this.dispatchAction(node.module, node.action)
    },
    log : function(){
        console.log(arguments);
    },
    addTab: function(panel){
        this.log(panel);
	var id = "Tab-"+this.tabid;
	this.tabid++;
	if(panel.id){
	    id = panel.id;
	}else{
	    panel.id = id;
	}
        this.viewport.tabPanel.add(panel);
	this.viewport.tabPanel.setActiveTab(id);
    },

    addWindow: function(panel, id){
        var config = Ext.apply(this.windowDefault,panel);
        this.windows[id] = new Ext.Window(config);
        this.windows[id].show();
	return this.windows[id];
    }

});
MS.app = new MS.APP();





        