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
	        items: [
				new Ext.Toolbar({
					region: "north",
					height: 25,
				    items: [
						{
							xtype: 'tbtext', 
							text: 'MoneyStew',
							cls: "money-stew-header"
						}, 
						"->",
				        {
				            text: 'Help',
							listeners: {
								click: {
									fn: this.helpClick,
									scope:this
								}
							}
				        },
				        {
				            text: 'Logout',
							listeners: {
								click: {
									fn: this.logoutClick,
									scope:this
								}
							}
				        }
				    ]
				}),{
				id: "SouthPaw",
	            region: 'south',
	            html: '',//<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>',
	            height: 100,
				border: false,
				cls: "moneystew-header"
	        },{
	            id:		'MainContentPanel',
				region: 'center',
	            xtype: 'tabpanel',
	            border: false
	        }
			,{
				id: 'EastContentPanel',
				region: 'east',
				title: "Expenses per month",
				width:300
			}]
	    }
		
		defConfig = Ext.apply(defConfig,config || {});
		Ext.apply(this,defConfig);
		MS.viewport.superclass.constructor.apply(this,[defConfig]);
		
		//this.navPanel = this.items.itemAt(1);
        //this.navPanel.on('click',this.fireNav,this);
        //this.tabPanel = this.items.itemAt(2);
		this.eastPanel = Ext.getCmp("EastContentPanel");
		this.tabPanel = Ext.getCmp("MainContentPanel");
		this.southpaw = Ext.getCmp("SouthPaw");
		console.log(this.southpaw);
		var adPanel = Ext.get("adsense-panel");
		this.southpaw.body.appendChild(adPanel);
	},
	
	addChart: function(store) {
		var chart = new MS.PieChart({
			store:store
		});
		
		this.eastPanel.add(chart);
		this.eastPanel.doLayout();
	},

    fireNav : function(n){        
        this.fireEvent('nav',n.attributes);
    },

    fireResize : function(w, h){
        this.fireEvent('resize', this, w, h, w, h);
    },
	
	helpClick: function(b,e){
		var window = new Ext.Window({
			autoLoad: "/static/help.html",
			width: 400,
			height: 300,
			constrain: true,
			autoScroll: true
		});
		window.show();
	},
	
	logoutClick: function(b,e){
		console.log(window.logout_url);
		window.location = window.logout_url;
	}

})