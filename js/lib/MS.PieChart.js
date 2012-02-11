Ext.ns("MS");
MS.PieChart = Ext.extend(Ext.chart.PieChart, {

    constructor: function(config) {
        this.currentId = 0;
        this.transactions = [];
        this.debts = 0.0;
        this.payments = 0.0;
        this.infoEl = null;
        this.income = 0.0;
		
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
                {
                    name: 'name', 
                    type: 'string'
                },

                {
                    name: 'amount', 
                    type: 'float'
                },
                ]
            })
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
	    
    //this.updateMonthStore(store);
    },
	
    updateMonthStore: function(store) {
        this.currentId = 0;
        this.debts = 0;
        this.income = 0.0;
        this.transactions = [];
        store.each(this._generateItems, this);
        this.updateInfoEl();
        this.store.loadData(this.transactions);
    },
	
    setInfoElement: function(el){
        this.infoEl = el;
    },
	
    updateInfoEl: function(){
        if(this.infoEl != null){
            var fin = this.income + this.debts;
            var htm = "<div class='stats'><div class='income-label'>Income: <span class='income value'>"+this.income+"</span></div>";
            htm += "<div class='debt-label' style=''>Debts: <span class='debts value'>"+this.debts+"</span></div>";
            htm += "<div class='debt-income'>"+fin+"</div></div>";
            this.infoEl.dom.innerHTML = htm;
        }
    },
	
    _generateItems: function(record){
        //Determine the value of each record 
        //for by month;
        //repeat,
        var amount = 0;
        var rpt = record.data.repeat_amount;
        var val = record.data.amount;
        var interval = 0;
        val = parseFloat(val);
		
        switch (record.data.repeat) {
            case "Semi-Monthly":
                interval = 24;
                break;
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
		
        if(val>0){            
            this.income = this.roundNumber(this.income + monthAmount,2);
            return;
        } else {
            this.debts = this.roundNumber(this.debts + monthAmount, 2);
        }
		
        var item = {
            name: record.data.name,
            amount: this.roundNumber(monthAmount, 2)
        }
        this.transactions.push(item);
		
    },
    
    roundNumber: function(num, dec) {
        if(dec == undefined){
            dec = 2;
        }
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
    }
	
});