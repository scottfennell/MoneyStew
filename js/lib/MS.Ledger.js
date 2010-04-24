//
Ext.ux.grid.GroupSummary.Calculations['totalCost'] = function(v, record, field){
    return v + (record.data.estimate * record.data.rate);
};

MS.Ledger = new Ext.extend(Ext.util.Observable,{
    gridCfg:[
	{header: 'Day', dataIndex:'day'},
	//{header: 'Address', renderer: Ext.util.Format.usMoney, dataIndex: 'address'},
	{header: 'Name', dataIndex: 'name'},
	{header: 'Repeat', dataIndex: 'repeat'},
	{header: 'Type', dataIndex: 'type'},
	{header: 'Amount', dataIndex: 'amount'}	
    ],

    constructor: function(config){
	Ext.apply(this,config||{});
	MS.Ledger.superclass.constructor.apply(this,arguments);
    },


    showList: function(){
	this.panel = new Ext.ux.CrudPanel({
	    columns:[
		{header: 'Day', dataIndex:'day', width:10},
		//{header: 'Address', renderer: Ext.util.Format.usMoney, dataIndex: 'address'},
		{header: 'Name', dataIndex: 'name', width:40},
		{header: 'Repeat', dataIndex: 'repeat',width:20},
		{header: 'Type', dataIndex: 'type', width:20},
		{header: 'Amount', dataIndex: 'amount', width:20}
	    ],
	    store:this.store,
	    form:MS.LedgerForm
	});
	this.parent.addTab(this.panel);
	return this.panel;
    },

    ledgerPanel: function(){

	if(this.store){
	    this.datedata = new MS.LedgerSchedule({
		pstore:this.store
	    })
	}	

	var summary = new Ext.ux.grid.GroupSummary();
	var self = this;
	var checkColumn = new Ext.grid.CheckColumn({
	   header: 'Paid?',
	   dataIndex: 'disable',
	   id: 'check',
	   width: 10
	});

	var pan = new Ext.grid.GridPanel({
	    closable: true,
	    ds: this.datedata,
	    columns: [
            {
                id: 'name',
                header: 'Name',
                width: 80,
                dataIndex: 'name',
                summaryType: 'count',
                hideable: false,
                summaryRenderer: function(v, params, data){
                    return ((v === 0 || v > 1) ? '(' + v +' Items)' : '(1 Item)');
                },
                editor: new Ext.form.TextField({
                   allowBlank: false
                })
            },{
                header: 'Month',
                width: 20,
                sortable: true,
                dataIndex: 'month'
            },{
                header: 'Date',
                width: 25,
                sortable: true,
                dataIndex: 'date',
                //summaryType: 'max',
                renderer: Ext.util.Format.dateRenderer('m/d/Y'),
                editor: new Ext.form.DateField({
                    format: 'm/d/Y'
                })
            }, checkColumn,
            {
		header: 'Amount',
                width: 20,
                sortable: false,
                renderer: Ext.util.Format.usMoney,
                dataIndex: 'amount',
                summaryType: 'sum',
                editor: new Ext.form.NumberField({
                    allowBlank: false,
                    allowNegative: false,
                    style: 'text-align:left'
                })
            },{
		id: 'tcost',
                header: 'Balance',
                width: 20,
                sortable: false,
                groupable: false,
                renderer: Ext.util.Format.usMoney,
                dataIndex: 'total'
                //summaryType: 'sum',
                //summaryRenderer: Ext.util.Format.usMoney
	    }
	    ],
	    view: new Ext.grid.GroupingView({
		forceFit: true,
		showGroupName: false,
		enableNoGroups: false,
		enableGroupingMenu: false,
		hideGroupedColumn: true
	    }),
	    plugins:[summary,checkColumn],

	    tbar : [
		'Start',{
		    xtype:'datefield',
		    value:self.datedata.startDate,
		    listeners: {
			change: {
			    fn:self.datedata.updateStartDate,
			    scope:self.datedata
			}
		    }
		},"End",{
		    xtype:'datefield',
		    value:self.datedata.endDate,
		    listeners: {
			change: {
			    fn:self.datedata.updateEndDate,
			    scope:self.datedata
			}
		    }
		},'->',"Current Balance"
		,{
		    xtype:'numberfield',
		    name:'balance',
		    value: "0.00",
		    listeners: {
			change: {
			    fn:self.changeBalance,
			    scope:self
			}
		    }

		}
	    ],
	    clicksToEdit: 1,
	    trackMouseOver: false,
	    //enableColumnMove: false,
	    title: 'Ledger'
	});
	this.ledgerpanelgrid = pan;
	this.parent.addTab(pan);

    },

    changeBalance: function(field, newVal,oldVal){
	if(this.datedata){
	    this.datedata.changeStartBalance(newVal);
	}
    }
});
