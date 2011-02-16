/**
 * Pre defined JsonStore
 * @author stillboy
 */
Ext.ns("MS");
MS.LedgerStore = Ext.extend(Ext.data.JsonStore,{

	constructor: function(config){
		var defConfig = {
			url: "/ledger/json",
			fields: [
				{name:	"id"},
				{name: 	"name"},
				{name:	"amount"},
				{name:	"start_date"},
				{name:	"repeat"},//Monthly, Daily, Yearly, Weekly
				{name:	"repeat_amount"}, //Every repeat amount repeat
			]
		}
		var cfg = Ext.apply(defConfig,config||{});
		Ext.apply(this,cfg);
		MS.LedgerStore.superclass.constructor.apply(this,[cfg]);
	}
	
});

