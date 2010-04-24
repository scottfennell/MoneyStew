/* 
 * This is intended to be overridden mostly,
 */


MS.CouchTab = new Ext.extend(Ext.Panel,{

    config: {
	layout:'border'
	tbar:[
	    {
		text:'Add',
		listeners:{
		    click:{
			fn:this.addItem,
			scope:this
		    }
		}
	    }
	]
    }

   constructor: function(config){
       Ext.apply(this,config||{});
       MS.CouchTab.superclass.constructor.apply(this,arguments);
   },

   initComponent: function(){
       MS.CouchTab.superclass.initComponent.call(this);


   },

   createGrid: function(){
       var cols = this.parent.schema.grid;
       var store = this.parent.store;
       this.grid = new MS.grid({columns:cols,store:store})
       this.parent.addTab(this.grid);
   },


   createForm: function(record){

       var form = new Ext.form.FormPanel({
            autoWidth:true,
            frame:true,
            border:false,
            items:record.data.items,
            buttons:[
		{
		    text:"Save",
		    listeners:{
			click:{
			    fn:this.SaveNewLedger,
			    scope:this
			}
		    }
		}
	    ]
        });
       this.parent.addWindow({
           items:[form]
       }, 'Ledger Form')
   }

});