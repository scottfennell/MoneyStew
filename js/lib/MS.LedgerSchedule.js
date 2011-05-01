/**
 * This store, updates itself based on the contents
 * of another store and creates multiple items if neccassary
 * 
 * @param {Object} config
 */
Ext.ns("MS");
MS.LedgerSchedule = Ext.extend(Ext.data.GroupingStore, {
	
	startDate: null, 
	endDate: null,
	transactions: [],
	currentTotal: 0.0,
	startBalance: 0.0,
	
	
	constructor : function(config){
		this.startDate = new Date();
		this.endDate = this.startDate.add(Date.MONTH, 3);
		
		var defConfig = {
			reader: new Ext.data.JsonReader({
			    idProperty: 'seqId',
			    fields: [
					{name: 'seqId', type: 'int'},
					{name: 'month', type: 'string'},
					{name: 'couchId', type: 'string'},
					{name: 'date', type: 'date', dateFormat:'m/d/Y'},
					{name: 'name', type: 'string'},
					{name: 'note', type: 'string'},
					{name: 'disable', type: 'boolean'},
					{name: 'amount', type: 'float'},
					{name: 'total', type: 'float'}
			    ]
			}),
			sortInfo:	{field: 'date', direction: 'ASC'},
			groupField: 'month',
			
		}
		defConfig = Ext.apply(defConfig, config || {})
		Ext.apply(this, defConfig);
		
		if (this.pstore) {
	        this.pstore.on('datachanged', this.createDateStore, this);
	        this.pstore.on('add', this.createDateStore, this);
	        this.pstore.on('remove', this.createDateStore, this);
	        this.pstore.on('save', this.createDateStore, this);
	        this.pstore.on('update', this.createDateStore, this);
	    }
	    
	    MS.LedgerSchedule.superclass.constructor.apply(this, arguments);
	    this.on('update', this.updateDateStore, this);
	    //Fire this off, since the store should already be loaded... I think
	    this.createDateStore(this.pstore)
	},
	
	_generateDateItems: function(record){
		var interval = this._getInterval(record);
		if(record.data.repeat == "Semi-Monthly"){
			var extra = record.copy();
			Ext.data.Record.id(extra);
			extra.data.repeat = "Monthly";

			interval = {
				repeat: Date.MONTH,
				amount: 1
			}
			
			sd = Date.parseDate(record.data.start_date, "m/d/Y");
			sd = sd.add(Date.DAY,14);
			extra.data.start_date = sd.format('m/d/Y');
			this._generateDateItems(extra);
		}
		
		var record_start = record.data.start_date;
		//Convert a string date to a valid date
		if(!Ext.isDate(record_start)){
			record_start = Date.parseDate(record_start, "m/d/Y");
		}
		
		var rec_dates = this._adjustDateToStart(
			record_start, interval.repeat, interval.amount, this.startDate);
		
		if(rec_dates.between(this.startDate, this.endDate)){
			var count = 0
			while (rec_dates.between(this.startDate, this.endDate)) {
				if(count>10){
					console.log("Would have duplicated more than ten times, breaking", rec_dates, interval, this.startDate, this.endDate);
					break;
				}
	            this.currentTotal += record.data.amount;
	            var currObj = {
	                seqId: this.currentId,
	                month: rec_dates.format('Y-m-F'),
	                couchId: record.data.id,
	                date: rec_dates.format('m/d/Y'),
	                name: record.data.name,
					note: record.data.note || "",
	                disable: false,
	                amount: record.data.amount,
	                total: 0
	            }
	            this.transactions.push(currObj);
	            this.currentId++;
				if (interval.amount > 0) {
					rec_dates = rec_dates.add(interval.repeat, interval.amount);
				} else {
					//If the repeat amount is 0, then exit loop after first run
					break;
				}
				count++;
	        }
		}
	},
	
	getScheduleStore: function() {
		return this.pstore;
	},
	
	/**
	 * Loop date and add the interval until the date is within the current
	 * date range - not the best way to go about this, but the easiest
	 * @param {Date} date
	 * @param {String} repeat
	 * @param {Int}	amount
	 * @param {Date} startInterval
	 */
	_adjustDateToStart: function(date, repeat, amount, startInterval){
		var startDate = date.clone();
		var start_code = startDate.format('U')
		var start_i_code = startInterval.format('U')
		
		if(start_code < start_i_code && amount >0){
			var count = 0;
			while (date.between(startDate,startInterval)){
				date = date.add(repeat, amount);
			}
		}
		
		return date;
	},
	
	/**
	 * Compute the proper interval to be given to Date.add() to
	 * add an amount to a given date and let it calculate the 
	 * new date. 
	 * 
	 * @param {Record} record
	 */
	_getInterval: function(record){
		var interval = {
			repeat: Date.MONTH,
			amount: 1
		};
		
		if(record.data.repeat == "Weekly"){
			interval.repeat = Date.DAY;
			interval.amount = 7;
		} else if (record.data.repeate == "Daily") {
			interval.repeat = Date.DAY;
		} else if (record.data.repeat == "Yearly") {
			interval.repeat = Date.YEAR;
		} else if (record.data.repeat == "None") {
			interval.amount = 0;
		}
		
		if(record.data.repeat_amount && record.data.repeat_amount > 0){
			interval.amount *= record.data.repeat_amount	
		}
		
		return interval;
	},
	
	recalcDateStore : function(record){
        if (!record.data.disable) {
            this.currentTotal += record.data.amount;
            record.set('total', this.currentTotal);
        } else {
            record.set('total', this.currentTotal);
        }
    }, 
	
	createDateStore : function(store){
        this.currentId = 0;
        this.transactions = [];
        store.each(this._generateDateItems, this);
        
        this.loadData(this.transactions);
        this.updateDateStore();
    }, 
	
	updateDateStore : function(){
        this.removeListener('update', this.updateDateStore, this);
        this.currentTotal = this.startBalance;
        this.each(this.recalcDateStore, this);
        this.commitChanges();
        this.on('update', this.updateDateStore, this);
    },
    
    changeStartBalance : function(newBal){
        this.startBalance = newBal;
        this.updateDateStore();
    },
    
    updateStartDate : function(field, newDate, old){
        this.startDate = field.getValue();
        this.createDateStore(this.pstore);
    },
    
    updateEndDate : function(field, newDate, old){
        this.endDate = field.getValue();
        this.createDateStore(this.pstore);
    }
	
});