Ext.ns("MS");
MS.LedgerForm = Ext.extend(Ext.Panel, {
	
	constructor: function(config){
	    Ext.apply(this,config||{});
	    this.addEvents({
			'save':true
	    });
	    this._setWizard();
	    MS.LedgerForm.superclass.constructor.apply(this,arguments);
	
	    if(this.record){
			var frm = this.addForm.getForm();
			var vals = this.record.data;
			vals['repeater'] = this._translateRepeat(this.record.data.repeat, this.record.data.repeat_amount);
			frm.setValues(vals);
	    }
	},
	
	_setAddEdit : function() {
		this.wizard = false;
		this.addForm = this._createPayAddForm();
		this.addForm.flex = 100;
		this.autoWidth = true;
	    this.frame = true;
	    this.border = true;
		this.layout = 'fit';
	    this.items = [
			this.addForm
		];
		
		var frm = this.addForm.getForm();
		frm.setValues({
			name:"Paycheck",
			type:"Income"
		})	
	    
	    this.buttons = [
			{
			    text:"Save",
			    listeners:{
					click:{
					    fn:this._onSubmitForm,
					    scope:this
					}
			    }
			}
	    ];
	},
	
	_setWizard: function() {
		this.wizard = true;
		this.addForm = this._createPayForm();
		this.addForm.flex = 100;
		this.addForm.region = "center";
		this.sautoWidth = true;
		this.autoScroll = true;
	    this.frame = true;
	    this.border = true;
		this.layout = 'fit';
	    this.items = [
			{
				xtype: "panel",
				layout: 'border',
				items:[
					{
						region:"north",
						html:"<b>Welcome to MoneyStew!</b><br/>"+
						"Let's get started, first, start by entering your how often you get paid below<br/><br/>"+
						"You can bring up this form to add additional transactions by clicking "+
						"<b>\"Add Transaction\"</b> in the upper left<br/><br/>"+
						"Click on \"Help\" in the upper right to get more information",
					},
					this.addForm
				]
			},
			
		];
	    
	    this.buttons = [
			{
			    text:"Next",
			    listeners:{
					click:{
					    fn:this._onPaycheckForm,
					    scope:this
					}
			    }
			}
	    ];
	},
	
	_translateRepeat: function(repeat, repeat_amount){
		if(repeat == "Weekly"){
			if(repeat_amount == 1){
				return "weekly";
			}else if (repeat_amount == 2){
				return "biweekly";
			}
		} else if (repeat == "Monthly") {
			if(repeat_amount == 1){
				return "monthly";
			} else if(repeat_amount == 3){
				return "quarterly";
			}
		} else if (repeat == "Yearly") {
			return "yearly";
		} else if (repeat == "Semi-Monthly"){
			return "semimonthly";
		}
		return repeat;
	},
	
	_createAddForm: function(values){
		var self = this;
	 	var formitems = [
			{
				xtype:	'textfield',
				name:	'name',
				fieldLabel: 'Transaction Name',
				qtip:		'Enter the name of the transaction here'
		    },{
				xtype:	'datefield',
				name:	'start_date',
				fieldLabel: 'Start Date'
			},{
				xtype: 			'combo',
				name:			'repeater',
				fieldLabel: 	"Repeat transaction",
				editable: 		false,
				disableKeyFilter: true,
				forceSelection: true,
				emptyText: 		'--select one--',
				triggerAction: 	'all',
				mode: 			'local',
				store: new Ext.data.ArrayStore({
					fields: ['value', 'text'],
					data: [
						['monthly', 		'Monthly (Once a month)'], 
						['biweekly',	'Biweekly (Every 2 weeks)'],
						['semimonthly',	'Semi-monthly (Twice a month)'],
						['weekly', 		'Weekly (Once a week)'], 
						['yearly', 		'Yearly (Once a year)'], 
						['quarterly',	'Quarterly (Once every 3 months)'],
						['None', 		'None (Never repeat, only happens once on the start date)']
					]
				}),
				value: "Monthly",
				valueField: 'value',
				displayField: 'text',
				listeners: {
					change: function(box, newVal,oldVal) {
						//set the form value for repeate and repeat_amount
						var vals = {};
						switch(newVal){
							case 'monthly':
								vals = {
									'repeat':"Monthly",
									'repeat_amount':1
								};
								break;
							case 'biweekly':
								vals = {
									'repeat': "Weekly",
									'repeat_amount': 2
								};
								break;
							case 'semimonthly':
								vals = {
									repeat: "Semi-Monthly",
									repeat_amount: 1
								}
								break;
							case 'weekly':
								vals = {
									'repeat': "Weekly",
									'repeat_amount': 1
								};
								break;
							case 'yearly':
								vals = {
									'repeat': "Yearly",
									'repeat_amount': 1
								};
								break;
							case 'quarterly':
								vals = {
									'repeat': "Monthly",
									'repeat_amount': 3
								};
								break;
						}
						self.addForm.getForm().setValues(vals);
					}
				}
			},{
				xtype: 	'hidden',
				name:	'repeat'
			},{
				xtype:	'hidden',
				name:	'repeat_amount'	
			},{//http://thelampposts.blogspot.com/2008/04/creating-basic-select-box-in-extjs.html
				xtype:'combo',
				name: 'type',
				fieldLabel: "Type of transaction",
				qtip: 'The type of transaction, for example: Debt repayment, Paycheck. This will help breakdown where your money is going',
				editable: false,
				forceSelection: true,
				triggerAction: 'all',
				mode: 'local',
				store: new Ext.data.ArrayStore({
				    fields: ['value', 'text', 'description'],
				    data : [
						['Credit Debt', 'Credit Debt', 'Revolving debt payment, such as a credit card'],
						['Fixed Payment', 'Fixed Payment', 'Fixed debt payment, such as a car loan or a personal loan'],
						['Debt', 'Other Debt', 'Another form of debt'], 
						['Service', 'Service', 'Utilities, Trash, Phone, Internet, etc.'], 
						['Income', 'Income', 'Paycheck, interest income, etc.'], 
						['Other','Other', 'Some other type of transaction'],
						['Savings', 'Savings', 'Automatic or otherwise']
					]
				}),
				valueField: 'value',
				displayField: 'text',
		    },{
				xtype:	'numberfield',
				name:	'amount',
				fieldLabel: 'Amount'
		    },{
				xtype: 'textarea',
				name: 'note',
				fieldLabel: 'Notes',
				grow: true
			}
		];
		
		var form = new Ext.form.FormPanel({
			defaults: {
				swidth:	250,
				anchor: "-20"
			},
			items: formitems,
			border: false,
			labelWidth: 150
		});
		
		return form;
	},
	
	_createPayForm: function(values){
		var self = this;
	 	var formitems = [
			
			{
				xtype:	'textfield',
				name:	'name',
				fieldLabel: 'Transaction <b>Name</b>',
				qtip:		'Enter the name of the transaction here',
				value: "Paycheck"
		    },{
				xtype:	'datefield',
				name:	'start_date',
				fieldLabel: '<b>Start Date</b> or the next (or last) date you will get paid. All transactions will repeat based off of this date'
			},{
				xtype: 			'combo',
				name:			'repeater',
				fieldLabel: 	"<b>Repeat</b> Select how often you get paid, if you get paid every other week, for example, select Biweekly.",
				editable: 		false,
				disableKeyFilter: true,
				forceSelection: true,
				emptyText: 		'--select one--',
				triggerAction: 	'all',
				mode: 			'local',
				store: new Ext.data.ArrayStore({
					fields: ['value', 'text'],
					data: [
						['monthly', 		'Monthly (Once a month)'], 
						['biweekly',	'Biweekly (Every 2 weeks)'],
						['semimonthly',	'Semi-monthly (Twice a month)'],
						['weekly', 		'Weekly (Once a week)'], 
						['yearly', 		'Yearly (Once a year)'], 
						['quarterly',	'Quarterly (Once every 3 months)'],
						['None', 		'None (Never repeat, only happens once on the start date)']
					]
				}),
				value: "biweekly",
				valueField: 'value',
				displayField: 'text',
				listeners: {
					change: function(box, newVal,oldVal) {
						//set the form value for repeate and repeat_amount
						var vals = {};
						switch(newVal){
							case 'monthly':
								vals = {
									'repeat':"Monthly",
									'repeat_amount':1
								};
								break;
							case 'biweekly':
								vals = {
									'repeat': "Weekly",
									'repeat_amount': 2
								};
								break;
							case 'semimonthly':
								vals = {
									repeat: "Semi-Monthly",
									repeat_amount: 1
								}
								break;
							case 'weekly':
								vals = {
									'repeat': "Weekly",
									'repeat_amount': 1
								};
								break;
							case 'yearly':
								vals = {
									'repeat': "Yearly",
									'repeat_amount': 1
								};
								break;
							case 'quarterly':
								vals = {
									'repeat': "Monthly",
									'repeat_amount': 3
								};
								break;
						}
						self.addForm.getForm().setValues(vals);
					}
				}
			},{
				xtype: 	'hidden',
				name:	'repeat',
				value:	'Weekly'
			},{
				xtype:	'hidden',
				name:	'repeat_amount',
				value: 	2
			},{//http://thelampposts.blogspot.com/2008/04/creating-basic-select-box-in-extjs.html
				xtype:'combo',
				name: 'type',
				fieldLabel: "<b>Type of transaction</b> This will be <ul>Income</ul> for a paycheck, all other options refer to types of debts",
				qtip: 'The type of transaction, for example: Debt repayment, Paycheck. This will help breakdown where your money is going',
				editable: false,
				forceSelection: true,
				triggerAction: 'all',
				mode: 'local',
				store: new Ext.data.ArrayStore({
				    fields: ['value', 'text', 'description'],
				    data : [
						['Credit Debt', 'Credit Debt', 'Revolving debt payment, such as a credit card'],
						['Fixed Payment', 'Fixed Payment', 'Fixed debt payment, such as a car loan or a personal loan'],
						['Debt', 'Other Debt', 'Another form of debt'], 
						['Service', 'Service', 'Utilities, Trash, Phone, Internet, etc.'], 
						['Income', 'Income', 'Paycheck, interest income, etc.'], 
						['Other','Other', 'Some other type of transaction'],
						['Savings', 'Savings', 'Automatic or otherwise']
					]
				}),
				value: "Income",
				valueField: 'value',
				displayField: 'text',
		    },{
				xtype:	'numberfield',
				name:	'amount',
				fieldLabel: '<b>Amount</b> Your total income per paycheck'
		    },{
				xtype: 'textarea',
				name: 'note',
				fieldLabel: '<b>Notes</b> Add any extra notes about this transaction ',
				grow: true
			}
		];
		
		var form = new Ext.form.FormPanel({
			defaults: {
				anchor: "-20"
			},
			items: formitems,
			border: false,
			labelWidth: 150,
			autoScroll: true
		});
		
		return form;
	},
	
	_onSubmitForm: function(b,e){
		var form = this.addForm.getForm();
		var data = form.getValues();		
		
		if(data.type && data.type == "Income"){
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
    },
	
	_onPaycheckForm: function(b,e){
		var form = this.addForm.getForm();
		var data = form.getValues();		
		
		if(data.type && data.type == "Income"){
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
    },
	
	_getRepeatConfig: function() {
		var config = {
			xtype: 'combo',
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
				data: [['Monthly', 'Monthly'], ['Weekly', 'Weekly'], ['Yearly', 'Yearly'], ['None', 'None']]
			}),
			value: "Monthly",
			valueField: 'value',
			displayField: 'text',
			width: 80
		}
		return config;
	}
});

