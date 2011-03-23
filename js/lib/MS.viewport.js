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
	            region: 'south',
	            html: '<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>',
	            height: 90,
				border: false,
				cls: "moneystew-header"
	        },{
	            id:		'MainContentPanel',
				region: 'center',
	            xtype: 'tabpanel',
	            border: false
	        }
			/*
			,{
				region: 'east',
				
				width:300,
				layout: {
					type: "vbox",
					padding: '5',
    				align: 'left'
				},
				items: [
					{ 
						flex: 50,
						html:"This is the first",
						border: false
					},
					{
						flex:50,
						html: "This is the second",
						border: false
					}
				]
			}
			*/
			]
	    }
		defConfig = Ext.apply(defConfig,config || {});
		Ext.apply(this,defConfig);
		MS.viewport.superclass.constructor.apply(this,[defConfig]);
		
		//this.navPanel = this.items.itemAt(1);
        //this.navPanel.on('click',this.fireNav,this);
        //this.tabPanel = this.items.itemAt(2);
		this.tabPanel = Ext.getCmp("MainContentPanel");
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