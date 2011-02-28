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
			
			xtype:	'compositefield',
			labelWidth: 60,
			qtip: "Repeat this transaction every x periods ( every 1 month )",
			fieldLabel: "Repeat every",
			items: [
				{
					xtype: 'numberfield',
					name:	'repeat_amount',
					fieldLabel: 'Repeat',
					value:	1,
					width: 30,
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
					width: 80
			    }
			]
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
					['Other','Other'],
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
			tooltip: "Select this box if this is income (otherwise, MoneyStew will make sure the amount is negative)",
			value: false
		},{
			xtype: 'textarea',
			name: 'note',
			fieldLabel: 'Notes',
			grow: true
		}

	];
    
	this.submitForm = function(b,e){
		var form = this.getForm();
		var data = this.form.getValues();		
		if(data.income && data.income == "on"){
			if(data.amount <0 ){
				data.amount *= -1;
			}
		} else {
			if(data.amount > 0){
				data.amount *= -1;
			}
		}
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
		var frm = this.getForm();
		
		frm.setValues(this.record.data);
		if(this.record.data.amount > 0){
			frm.setValues({
				'income': true
			});
		}
    }
}

Ext.extend(MS.LedgerForm, Ext.form.FormPanel);

