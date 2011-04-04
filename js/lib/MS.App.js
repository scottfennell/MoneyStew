Ext.ns("MS");
MS.App = Ext.extend(Ext.util.Observable, {
    
    windowDefault: {
        width: 400,
        height: 300,
        layout: 'fit',
        title: 'Window'
    },
	
    //active windows
    windows: {},
    tabid: 0,
    
    constructor: function(config){
        Ext.apply(this, config || {});
        MS.App.superclass.constructor.apply(this, arguments);
		this.start();
    },
    
    start: function(){
		Ext.QuickTips.init();
        //this.viewport = new Ext.Viewport(MS.viewport);
        this.viewport = new MS.viewport();
        this.viewport.on('nav', this.dispatch, this);	
		this.ledgerStore = new MS.LedgerStore();
        this.ledgerStore.load();
        this.initModules();
        this.dispatchAction('Ledger', 'ledgerPanel');
		this.viewport.addChart(this.ledgerStore);
    },
    
    initModules: function(){
    
        this.Ledger = new MS.Ledger({
            parent: this,
            store: this.ledgerStore
        });
		
        //this.Schema = new MS.Schema({parent:this});
    },
    dispatchAction: function(module, action){
		console.log("dispatch",module, action);
        if (this[module] && this[module][action]) {
            this[module][action]();
        } else {
            this.log("Module or action not defined");
        }
    },
	
    dispatch: function(node){
        this.dispatchAction(node.module, node.action)
    },
	
    log: function(){
        console.log(arguments);
    },
	
    addTab: function(panel){
        this.log(panel);
        var id = "Tab-" + this.tabid;
        this.tabid++;
        if (panel.id) {
            id = panel.id;
        }
        else {
            panel.id = id;
        }
        this.viewport.tabPanel.add(panel);
        this.viewport.tabPanel.setActiveTab(id);
    },
    
    addWindow: function(panel, id){
        var config = Ext.apply(this.windowDefault, panel);
        this.windows[id] = new Ext.Window(config);
        this.windows[id].show();
        return this.windows[id];
    }
    
});
