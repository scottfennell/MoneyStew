/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


MS.LedgerSchedule = function(config){
    Ext.apply(this,config||{})
    this.startDate = new Date();
    this.endDate = this.startDate.add(Date.MONTH,1);
    this.transactions = [];
    this.currentTotal = 0.0;
    this.startBalance = 0.0;
    
    this.reader = new Ext.data.JsonReader({
	    idProperty: 'seqId',
	    fields: [
		{name: 'seqId', type: 'int'},
		{name: 'month', type: 'string'},
		{name: 'couchId', type: 'string'},
		{name: 'date', type: 'date', dateFormat:'m/d/Y'},
		{name: 'name', type: 'string'},
		{name: 'disable', type: 'boolean'},
		{name: 'amount', type: 'float'},
		{name: 'total', type: 'float'}
	    ]
	});
    this.sortInfo = {field: 'date', direction: 'ASC'};
    this.groupField = 'month';
    this.generateDateItems = function(record){	
	var repeater = Date.MONTH;
	var recDay = this.startDate.clone();
	if(record.data.repeat == 'Weekly'){
	    repeater = Date.WEEK;
	    var weekday = recDay.getDay();
	    if(weekday<=record.data.day){
		var addDays = record.data.day - weekday;
		recDay = recDay.add(Date.DAY,addDays);
	    }else{
		recDay = recDay.add(Date.DAY,(weekday+record.data.day)%6);
	    }
	}else{
	    recDay.setDate(record.data.day);
	}

	if(!recDay.between(this.startDate,this.endDate)){
	    recDay = recDay.add(repeater, 1);
	}

	while(recDay.between(this.startDate,this.endDate)){
	    this.currentTotal += record.data.amount;
	    var currObj = {
		seqId:	this.currentId,
		month:	recDay.format('Y-m-F'),
		couchId:record.data._id,
		date:	recDay.format('m/d/Y'),
		name:	record.data.name,
		disable:false,
		amount:	record.data.amount,
		total:	0
	    }
	    this.transactions.push(currObj);
	    this.currentId++;
	    recDay = recDay.add(repeater,1);
	}
    }

    this.recalcDateStore = function(record){
	if(!record.data.disable){
	    this.currentTotal += record.data.amount;
	    record.set('total',this.currentTotal);
	}else{
	    record.set('total',this.currentTotal);
	}
    },

    this.createDateStore = function(store){		
	this.currentId = 0;
	this.transactions = [];
	store.each(this.generateDateItems,this);

	this.loadData(this.transactions);
	this.updateDateStore();
    },

    this.updateDateStore = function(){	
	this.removeListener('update',this.updateDateStore, this);
	this.currentTotal = this.startBalance;
	this.each(this.recalcDateStore,this);
	this.commitChanges();
	this.on('update',this.updateDateStore, this);
	
    }

    this.changeStartBalance = function(newBal){
	this.startBalance = newBal;
	this.updateDateStore();
    }

    this.updateStartDate = function(field,newDate,old){
	this.startDate = field.getValue();
	this.createDateStore(this.pstore);
    }

    this.updateEndDate = function(field,newDate,old){
	this.endDate = field.getValue();
	this.createDateStore(this.pstore);
    }

    if(this.pstore){	
	this.pstore.on('datachanged', this.createDateStore, this);
	this.pstore.on('add', this.createDateStore, this);
	this.pstore.on('remove', this.createDateStore, this);
	this.pstore.on('save', this.createDateStore, this);
	this.pstore.on('update', this.createDateStore, this);	
    }
    
    MS.LedgerSchedule.superclass.constructor.apply(this,arguments);
    this.on('update',this.updateDateStore, this);
    //Fire this off, since the store should already be loaded... I think
    this.createDateStore(this.pstore)
}
Ext.extend(MS.LedgerSchedule,Ext.data.GroupingStore);