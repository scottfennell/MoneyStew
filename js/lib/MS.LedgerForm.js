Ext.ns("MS");
MS.LedgerForm = Ext.extend(Ext.Window, {
	
	constructor: function(config){
		
	    Ext.apply(this,config||{});
	    this.addEvents({
			'save':true
	    });
	    //this._setWizard();
		this._setAddEdit();
	    MS.LedgerForm.superclass.constructor.apply(this,arguments);
	
	    if(this.record){
			var frm = this.addForm.getForm();
			var vals = this.record.data;
			vals['repeater'] = this._translateRepeat(this.record.data.repeat, this.record.data.repeat_amount);
			frm.setValues(vals);
	    }
	},
	
	_setAddEdit : function() {
		this.addForm = this._createAddForm();
		this.addForm.flex = 100;
	    this.frame = true;
	    this.border = true;
		this.layout = 'fit';
	    this.items = [
			this.addForm
		];
		
		
		if (this.wizard) {
			var frm = this.addForm.getForm();
			frm.setValues({
				name:"Paycheck",
				type:"Income"
			});
		}
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
		var wiz =[ {
			xtype:	"panel",
			border:	false,
			html:
			"<p>MoneyStew is designed to help you keep track of your scheduled income and expenses</p>"+
			"<p><b>Lets get started, first lets put in your paycheck information, I have already filled out a few of the fields for you</b></p> ",
			padding:5
		}];
		
	 	var formitems = [
			{
				xtype:	'textfield',
				name:	'name',
				fieldLabel: 'Transaction Name',
				allowBlank: false,
				value: '',
				qtip:		'Enter the name of the transaction here<br/>This will be used to identify this transaction.'
		    },{
				xtype:	'datefield',
				name:	'start_date',
				fieldLabel: 'Start Date',
				allowBlank: false,
				value: '',
				qtip: '<p>This is the first, or next date for this transaction</p> This needs to be set in order to choose the correct day of the month, or day of the week to repeat on.</p> <p>Generally, you can use the last or next date that this transaction will happen on</p>'
			},{
				id:"repeat-form-element",
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
						//set the form value for repeat and repeat_amount
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
							case 'None':
								Ext.Msg.alert("Are you sure?", "Transactions that are not repeating are not saved to the server, they are simply used to help you calculate your current balance. See the help menu for more information")
						}
						self.addForm.getForm().setValues(vals);
					}
				},
				qtip: "<p>This is how often this transaction will repeat</p><p>For example, if you have a credit card payment due once a month, you should select <b>Monthly</b> to make sure this transaction shows up every month</p><p>MoneyStew is intended to track <i>expected</i> spending.</p>"
			},{
				xtype: 	'hidden',
				name:	'repeat',
				value:	'Monthly'
			},{
				xtype:	'hidden',
				name:	'repeat_amount',
				value:	1
			},{//http://thelampposts.blogspot.com/2008/04/creating-basic-select-box-in-extjs.html
				xtype:'combo',
				name: 'type',
				fieldLabel: "Type of transaction",
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
				qtip: "<p>This is the type of transaction this record is for. Use the list below for help</p>"+
				"<ul>"+
				"<li><b>Credit Debt</b> - Revolving debt payment, such as a credit card</li>"+
				"<li><b>Fixed payment</b> - Fixed debt payment, such as a car loan or a personal loan</li>"+
				"<li><b>Other Debt</b> - Some other debt repayment</li>"+
				"<li><b>Service</b> - Utilities, Trash, Phone, Internet, etc.</li>"+
				"<li><b>Income</b> - <i>Paycheck</i>, interest income, etc. <i>Make sure you select this option if this is income, otherwise MoneyStew will make sure the amount is a negative</i></li>"+
				"<li><b>Other</b> - Some other type of transaction</li>"+
				"<li><b>Savings</b> - Automatic savings plan or planned savings</li>"+
				"</ul>"
		    },{
				xtype:	'numberfield',
				name:	'amount',
				fieldLabel: 'Amount',
				allowBlank: false,
				value: '',
				qtip: '<p>The amount (in Dollars) that each transaction will be. </p><p>If this needs to be a negative amount (i.e. Income) then make sure that you select the income option from the transaction type<p>'
		    },{
				xtype: 'textarea',
				name: 'note',
				fieldLabel: 'Notes',
				grow: true,
				allowBlank:true,
				qtip: "<p>If you would like to specify some extra information about this transaction, here is the place</p>"
			}
		];
		if(this.wizard){
			formitems = wiz.concat(formitems);
		}
		
		var form = new Ext.form.FormPanel({
			monitorValid:true,
			defaults: {
				anchor: "-20"
			},
			layoutConfig: {
				fieldTpl: new Ext.Template(
				    '<div class="x-form-item {itemCls}" tabIndex="-1">',
				        '<label for="{id}" style="{labelStyle}" class="x-form-item-label">{label}',
						'{labelSeparator}</label>',
				        '<div class="x-form-element" id="x-form-el-{id}" style="{elementStyle}">',
						'<span id="tip-{id}" class="formtip"></span>',
				        '</div><div class="{clearCls}"></div>',
				    '</div>'
				),
			},
			padding:10,
			items: formitems,
			border: false,
			labelWidth: 150,
			buttons: [{
				text: "Save",
				formBind:true,
				listeners:{
					click:{
					    fn:this._onSubmitForm,
					    scope:this
					}
			    },
			}]
		});
				
		this.on('show',function(){
			form.items.each(function(item,idx,len){
				var tip = item.qtip || item.fieldLabel || item.name || item.id;
				var title = item.fieldLabel || item.name || item.id;
				var tar = Ext.get("tip-"+item.id);

				new Ext.ToolTip({
					title:title,
					target:tar,
					anchor:"left",
					html:tip,
					closable: true,
					width:300,
					autoHide:false
				});
					
			});
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

