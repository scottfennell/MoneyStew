/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.ns("MS");
MS.viewport = Ext.extend(Ext.Viewport,{
	
	constructor: function(config){
		this.addEvents({
            "nav" : true
        });
		
		var defConfig = {
	        layout: 'border',
	        items: [{
	            region: 'north',
	            html: 'MoneyStew',
	            autoHeight: true
	        },{
	            region: 'west',
	            collapsible: true,
	            title: 'Navigation',
	            xtype: 'treepanel',
	            width: 200,
	            autoScroll: true,
	            split: true,
	            loader: new Ext.tree.TreeLoader(),
	            root: new Ext.tree.AsyncTreeNode({
	                expanded: true,
	                children: [{
			    		module: 'Ledger',
	                    action: 'ledgerPanel',
	                    text: 'Ledger',
	                    leaf: true
	                },{
	                    module: 'Ledger',
	                    action: 'showList',
	                    text: 'Ledger Items',
			    		tooltip: 'Add/Edit ledger Items',
	                    leaf: true
	                }]
	            }),
	            rootVisible: false
	        },{
	            region: 'center',
	            xtype: 'tabpanel' // TabPanel itself has no title
	        }]
	    }
		defConfig = Ext.apply(defConfig,config || {});
		Ext.apply(this,defConfig);
		MS.viewport.superclass.constructor.apply(this,[defConfig]);
		
		this.navPanel = this.items.itemAt(1);
        this.navPanel.on('click',this.fireNav,this);
        this.tabPanel = this.items.itemAt(2);
	},

    fireNav : function(n){        
        this.fireEvent('nav',n.attributes);
    },

    fireResize : function(w, h){
        this.fireEvent('resize', this, w, h, w, h);
    }

})