/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.ns("MS");
MS.Viewport = Ext.extend(Ext.Viewport,{
	
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
	            html: '',
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
				id: 		'EastContentPanel',
				region: 	'east',
				title: 		"Expenses per month",
				width:		300,
				layout: 	"anchor",
				items: [
					new MS.PieChart({
						id: "piechart",
						store: config.store,
						anchor: "100% -80"
					}),
					{
						title: "Montly Debt to Income",
						id: "stasis",	
						anchor: "100%",
						border: false
					}
				]
			}]
	    }
		
		defConfig = Ext.apply(defConfig,config || {});
		Ext.apply(this,defConfig);
		MS.Viewport.superclass.constructor.apply(this,[defConfig]);
		
		this.eastPanel = Ext.getCmp("EastContentPanel");
		this.tabPanel = Ext.getCmp("MainContentPanel");
		this.southpaw = Ext.getCmp("SouthPaw");
		var adPanel = Ext.get("adsense-panel");
		this.southpaw.body.appendChild(adPanel);
		
		this.pie = Ext.getCmp("piechart");
		this.stasis = Ext.getCmp("stasis");
		this.pie.setInfoElement(this.stasis.body);
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
		window.location = window.logout_url;
	}

})