/**
 * Pre defined JsonStore that pulls data from the server
 * @author stillboy
 */
Ext.ns("MS");
MS.LedgerStore = Ext.extend(Ext.data.Store,{

	constructor: function(config){

		
		var proxy = new MS.GAEHttpProxy({
		    url: "/ledger/json"
		});
		
		// Typical JsonReader.  Notice additional meta-data params for defining the core attributes of your json-response
		var reader = new MS.JsonReader({
		    	totalProperty: 'total',
		    	idProperty: 'id',
		    	root: 'data',
		    	messageProperty: 'message'  // <-- New "messageProperty" meta-data
			}, [
				{name:	"id"},
				{name: 	"name"},
				{name:	"start_date", mapping:"start_date", type:"date", dateFormat:"Y-m-d"},
				{name:	"repeat"},//Monthly, Daily, Yearly, Weekly
				{name:	"repeat_amount"}, //Every repeat amount repeat
				{name:	"amount"},
				{name:	"type", mapping:"type"},
				{name:	"note"}
			]
		);
		
		// The new DataWriter component.
		var writer = new Ext.data.JsonWriter({
		    encode: false,   // <-- don't return encoded JSON -- causes Ext.Ajax#request to send data using jsonData config rather than HTTP params
		    writeAllFields :true,
			encodeDelete: false
		});
				// Typical Store collecting the Proxy, Reader and Writer together.
		var defConfig = {
		    id: 'LedgerStore',
		    restful: true,     // <-- This Store is RESTful
		    proxy: proxy,
		    reader: reader,
		    writer: writer,    // <-- plug a DataWriter into the store just as you would a Reader
		    listeners: {
				load:function(store,records,options){
					console.log("loaded rec",records);
				},
				exception:function(){
					console.log("Some exception",arguments)
				}
			}
		};
		
		var cfg = Ext.apply(defConfig,config||{});
		Ext.apply(this,cfg);
		MS.LedgerStore.superclass.constructor.apply(this,[cfg]);
	}, 
	
	save: function(){
		MS.LedgerStore.superclass.save.apply(this,arguments);
	},
	
	commitChanges: function(){
		MS.LedgerStore.superclass.commitChanges.apply(this,arguments);
	}
	
});

MS.JsonReader = Ext.extend(Ext.data.JsonReader,{
	readResponse: function(action, response){
		return MS.JsonReader.superclass.readResponse.apply(this,arguments);
	}
})

// Special HttpProxy that sends no body on DELETE requests
MS.GAEHttpProxy = Ext.extend(Ext.data.HttpProxy, {
	doRequest: function(action, rs, params, reader, cb, scope, arg) {
	    if(this.api[action]['method'].toLowerCase() == "delete") {
	        delete params.jsonData;
	    }
	
	    MS.GAEHttpProxy.superclass.doRequest.call(this, action, rs, params, reader, cb, scope, arg);
	}
});