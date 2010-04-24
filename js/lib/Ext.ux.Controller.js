/* 
 * Ext.ux.Controller
 *
 * Defines an object that can be extended to easily provide access to a data
 * store and dynamically generate grids and forms
 */


Ext.ux.Controller = new Ext.extend(Ext.util.Observable,{

    schema: {
	grid:[],
	fields: [],
	db:    'moneystew',
        view:  'moneystew/all'
    },

    form: null,

    defaults: {
	storeType: Ext.ux.data.CouchStore
    },

    constructor: function(config){

	this.addEvents({
	    'widgetcreated':true,
	    'widgetdestroy':true,
	    'widgetselect':true
	})

	Ext.apply(this.defaults);
	Ext.apply(this,config||{});
	Ext.ux.Controller.superclass.constructor.apply(this,arguments);
	if(this.schema.fields){
	    this.store = new this.storeType(this.schema);
	}
    },

    list: function(){
	if(this.crudpanel){	    
	    this.fireEvent('widgetselect',this.crudpanel);
	}else{
	    this.crudpanel = new Ext.ux.CrudPanel({
		store:this.store,
		form:this.form
	    });
	    this.fireEvent('widgetcreated',this.crudpanel);
	}
    },
    
    save: function(data){
	//Check to see if data has an id field, if not then save new	
	
    },
    
    find: function(){
	
    }
});