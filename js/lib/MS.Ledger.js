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
				{header: 'Start Date', dataIndex:'start_date', width:10, renderer: Ext.util.Format.dateRenderer('m-d-Y')},
				//{header: 'Address', renderer: Ext.util.Format.usMoney, dataIndex: 'address'},
				{header: 'Name', dataIndex: 'name', width:40},
				{header: 'Repeat', dataIndex: 'repeat',width:20},
				//{header: 'Type', dataIndex: 'type', width:20},
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
		    });
		}	
	
		var summary = new Ext.ux.grid.GroupSummary();
		var self = this;
		var checkColumn = new Ext.grid.CheckColumn({
		   header: 'Paid?',
		   dataIndex: 'disable',
		   id: 'check',
		   width: 10
		});
		
		row_actions = new Ext.ux.grid.RowActions({
			 header:'Actions'
//			,autoWidth:false
//			,hideMode:'display'
			,keepSelection:true
			,actions:[
				{
					iconCls:'icon-open'
					,tooltip:'Open'
				},{
					 iconCls:'icon-wrench'
					,tooltip:'Configure'
					,qtipIndex:'qtip2'
				},{
					qtipIndex:'qtip3'
					,iconCls:'icon-user'
					,tooltip:'User'
					,style:'background-color:yellow'
				}
			]
			,groupActions:[
				{
					 iconCls:'icon-del-table'
					,qtip:'Remove Table'
				},{
					 iconCls:'icon-add-table'
					,qtip:'Add Table - with callback'
					,callback:function(grid, records, action, groupId) {
						console.log('Callback: icon-add-table', 'Group: <b>{0}</b>, action: <b>{1}</b>, records: <b>{2}</b>', groupId, action, records.length);
					}
				},{
					 iconCls:'icon-graph'
					,qtip:'View Graph'
					,align:'left'
				}
			]
			,callbacks:{
				'icon-plus':function(grid, record, action, row, col) {
					console.log('Callback: icon-plus', 'You have clicked row: <b>{0}</b>, action: <b>{0}</b>', row, action);
				}
			}
		});
		
		row_actions.on({
			action:function(grid, record, action, row, col) {
				console.log('Event: action', 'You have clicked record', record);
			}
			,beforeaction:function() {
				console.log('Event: beforeaction', 'You can cancel the action by returning false from this event handler.');
			}
			,beforegroupaction:function() {
				console.log('Event: beforegroupaction', 'You can cancel the action by returning false from this event handler.');
			}
			,groupaction:function(grid, records, action, groupId) {
				console.log('Event: groupaction', 'Group: <b>{0}</b>, action: <b>{1}</b>, records: <b>{2}</b>', groupId, action, records.length);
			}
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
		    	},row_actions
		    ],
		    view: new Ext.grid.GroupingView({
			forceFit: true,
			showGroupName: false,
			enableNoGroups: false,
			enableGroupingMenu: false,
			hideGroupedColumn: true
		    }),
		    plugins:[summary,checkColumn,row_actions],
	
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
