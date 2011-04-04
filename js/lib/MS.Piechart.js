Ext.ns("MS");
MS.PieChart = Ext.extend(Ext.chart.PieChart, {

	constructor: function(config) {
		this.currentId = 0;
        this.transactions = [];
		
		var defConfig = {
			title: "Expenses per month",
			dataField: 'amount',
	        categoryField: 'name',
		 	extraStyle:
	        {
	            legend:
	            {
	                display: 'bottom',
	                padding: 5,
	                font:
	                {
	                    family: 'Tahoma',
	                    size: 13
	                }
	            }
	        }
		}
		
		Ext.apply(defConfig, config);
		
		var dataStore = defConfig.store;
		defConfig.store = new Ext.data.Store({
			reader: new Ext.data.JsonReader({
			    fields: [
					{name: 'name', type: 'string'},
					{name: 'amount', type: 'float'},
			    ]
			}),
		});
		
		Ext.apply(this,defConfig);
		
		MS.PieChart.superclass.constructor.apply(this,[defConfig]);
		
		this._bindStore(dataStore);
	},
	
	_bindStore: function(store) {
		
		if (store) {
	        store.on('datachanged', this.updateMonthStore, this);
	        store.on('add', this.updateMonthStore, this);
	        store.on('remove', this.updateMonthStore, this);
	        store.on('save', this.updateMonthStore, this);
	        store.on('update', this.updateMonthStore, this);
	    }
	    
	    this.updateMonthStore(store);
	},
	
	updateMonthStore: function(store) {
		this.currentId = 0;
        this.transactions = [];
        store.each(this._generateItems, this);
        this.store.loadData(this.transactions);
	},
	
	_generateItems: function(record){
		//Determine the value of each record 
		//for by month;
		//repeat,
		var amount = 0;
		var rpt = record.data.repeat_amount;
		var val = record.data.amount;
		var interval = 0;
		
		if(val > 0){
			return;
		}
		
		switch (record.data.repeat) {
			case "Monthly":
				interval = 12;
				break;
			case "Weekly":
				interval = 52;
				break;
			case "Yearly":
				interval = 1;
				break;
		}
		var monthAmount = (( interval / rpt ) * val ) /12;
		
		var item = {
			name: record.data.name,
			amount: Math.round(monthAmount)+0.00
		}
		this.transactions.push(item);
		
	},
	
	
	
});