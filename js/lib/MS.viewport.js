/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.ns("MS");
MS.viewport = Ext.extend(Ext.Container,{
    config: {
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
    },

    fireNav : function(n){        
        this.fireEvent('nav',n.attributes);
    },

    //I assume that this is the constructor... bla
    initComponent : function() {
        this.addEvents({
            "nav" : true
        });
        Ext.apply(this, this.config);
        MS.viewport.superclass.initComponent.call(this);
        this.navPanel = this.items.itemAt(1);
        this.navPanel.on('click',this.fireNav,this);
        this.tabPanel = this.items.itemAt(2);
        document.getElementsByTagName('html')[0].className += ' x-viewport';
        this.el = Ext.getBody();
        this.el.setHeight = Ext.emptyFn;
        this.el.setWidth = Ext.emptyFn;
        this.el.setSize = Ext.emptyFn;
        this.el.dom.scroll = 'no';
        this.allowDomMove = false;
        this.autoWidth = true;
        this.autoHeight = true;
        Ext.EventManager.onWindowResize(this.fireResize, this);
        this.renderTo = this.el;
    },

    fireResize : function(w, h){
        this.fireEvent('resize', this, w, h, w, h);
    }
    

})

MS.viewports = {
    layout: 'border',
    items: [{
        region: 'north',
        html: 'Yeaha...',
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
                text: 'Menu Option 1',
                leaf: true
            }, {
                text: 'Menu Option 2',
                leaf: true
            }, {
                text: 'Menu Option 3',
                leaf: true
            }]
        }),
        rootVisible: false,
        listeners: {
            click: function(n) {
                Ext.Msg.alert('Navigation Tree Click', 'You clicked: "' + n.attributes.text + '"');
            }
        }
    },{
        region: 'center',
        xtype: 'tabpanel', // TabPanel itself has no title
        items: {
            title: 'Default Tab',
            html: 'The first tab\'s content. Others may be added dynamically'
        }
    }]
};