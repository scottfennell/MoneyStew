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
			xtype:	'textfield',
			name:	'name',
			fieldLabel: 'Name'
	    },{
			xtype:	'datefield',
			name:	'start_date',
			fieldLabel: 'Start Date'
		},{
			xtype: 'numberfield',
			name:	'repeat_amount',
			fieldLabel: 'Repeat'
	    },{//http://thelampposts.blogspot.com/2008/04/creating-basic-select-box-in-extjs.html
			xtype:'combo',
			name: 'repeat',
			fieldLabel: "Every",
			editable: false,
			disableKeyFilter: true,
			forceSelection: true,
			emptyText: '--select one--',
			triggerAction: 'all',
			mode: 'local',
			store: new Ext.data.ArrayStore({
			    fields: ['value', 'text'],
			    data : [
					['Monthly', 'Monthly'], 
					['Weekly', 'Weekly'], 
					['Yearly', 'Yearly'], 
					['None','None']
				]
			}),
			value: "Monthly",
			valueField: 'value',
			displayField: 'text',
	    },{//http://thelampposts.blogspot.com/2008/04/creating-basic-select-box-in-extjs.html
			xtype:'combo',
			name: 'type',
			fieldLabel: "Type",
			editable: false,
			forceSelection: true,
			triggerAction: 'all',
			mode: 'local',
			store: new Ext.data.ArrayStore({
			    fields: ['value', 'text'],
			    data : [
					['Debt', 'Debt'], 
					['Service', 'Service'], 
					['Income', 'Income'], 
					['Other','Other']
				]
			}),
			value: "Debt",
			valueField: 'value',
			displayField: 'text',
	    },{
			xtype:	'numberfield',
			name:	'amount',
			fieldLabel: 'Amount'
	    },{
			xtype:	'checkbox',
			name:	'income',
			fieldLabel: 'Income?',
			value: false
		}

	];
    
	this.submitForm = function(b,e){
		var form = this.getForm();
		var data = this.form.getValues();		
		console.log("submitted data from the form",data)
		if(this.record){
		    Ext.apply(this.record.data, data);
		    this.record.markDirty();
			this.record.endEdit();
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

