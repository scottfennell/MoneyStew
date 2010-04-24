MS.LedgerForm = function(config){
    Ext.apply(this,config||{});
    this.addEvents({
	'save':true
    });
    
    this.autoWidth = true;
    this.frame = true;
    this.border = true;
    this.items = [
	    {
		xtype:	'hidden',
		name:	'type',
		value:	'Ledger'
	    },{
		xtype:	'textfield',
		name:	'name',
		fieldLabel: 'Name'
	    },{
		xtype:	'numberfield',
		name:	'amount',
		fieldLabel: 'Amount'
	    },{//http://thelampposts.blogspot.com/2008/04/creating-basic-select-box-in-extjs.html
		xtype:'combo',
		name: 'repeat',
		editable: false,
		disableKeyFilter: true,
		forceSelection: true,
		emptyText: '--select one--',
		triggerAction: 'all',
		mode: 'local',
		store: new Ext.data.ArrayStore({
		    fields: ['value', 'text'],
		    data : [['Monthly', 'Monthly'], ['Weekly', 'Weekly']]
		}),
		valueField: 'value',
		displayField: 'text',
		hiddenName: 'repeat'
	    },{
		xtype:	'numberfield',
		name:	'day',
		fieldLabel: 'Day of Week/Month'
	    }

	];
    this.submitForm = function(b,e){
	var form = this.getForm();
	var data = this.form.getValues();		
	if(this.record){
	    Ext.apply(this.record.data, data);
	    this.record.markDirty();
	    this.record.commit();
	}
	this.fireEvent('save',data);
    };
    
    this.buttons = [
	{
	    text:"Save",
	    listeners:{
		click:{
		    fn:this.submitForm,
		    scope:this
		}
	    }
	}
    ];
    
    MS.LedgerForm.superclass.constructor.apply(this,arguments);

    if(this.record){
	this.getForm().setValues(this.record.data);
    }
}

Ext.extend(MS.LedgerForm, Ext.form.FormPanel);

