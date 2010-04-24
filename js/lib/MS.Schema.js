/* 
 * View and modify the schema
 *

checkbox         Ext.form.Checkbox
checkboxgroup    Ext.form.CheckboxGroup
combo            Ext.form.ComboBox
datefield        Ext.form.DateField
displayfield     Ext.form.DisplayField
field            Ext.form.Field
fieldset         Ext.form.FieldSet
hidden           Ext.form.Hidden
htmleditor       Ext.form.HtmlEditor
label            Ext.form.Label
numberfield      Ext.form.NumberField
radio            Ext.form.Radio
radiogroup       Ext.form.RadioGroup
textarea         Ext.form.TextArea
textfield        Ext.form.TextField
timefield        Ext.form.TimeField
trigger          Ext.form.TriggerField
 *
 */


MS.Schema = new Ext.extend(Ext.util.Observable,{

    elements: [
	{
	    name:   'TextField',
	    //xtype here for the field return val
	    type:  'textfield',
	    //Static configuration options, these would be for every field usin
	    //this form element
	    config:{
		xtype: 'textfield'
	    },
	    form:{
		items: [
		    {
			xtype:	    'textfield',
			name:	    'name',
			fieldLabel: 'Name'
		    },{
			xtype:	    'textfield',
			name:	    'fieldLabel',
			fieldLabel: 'Field Label'
		    }
		]
	    }
	},
	{
	    name:   'TextArea',
	    type:  'textarea',
	    config:{
		xtype: 'textarea'
	    },
	    form:{
		items: [
		    {
			xtype:	    'textfield',
			name:	    'name',
			fieldLabel: 'Name'
		    },{
			xtype:	    'textfield',
			name:	    'fieldLabel',
			fieldLabel: 'Field Label'
		    }
		]
	    }
	},
	{
	    name:   'Checkbox',
	    type:  'checkbox',
	    config:{
		xtype: 'checkbox'
	    },
	    form:{
		items: [
		    {
			xtype:	    'textfield',
			name:	    'name',
			fieldLabel: 'Name'
		    },{
			xtype:	    'textfield',
			name:	    'fieldLabel',
			fieldLabel: 'Field Label'
		    }
		]
	    }
	},
	{
	    name:   'HtmlEditor',
	    type:  'htmleditor',
	    config:{
		xtype: 'htmleditor'
	    },
	    form:{
		items: [
		    {
			xtype:	    'textfield',
			name:	    'name',
			fieldLabel: 'Name'
		    },{
			xtype:	    'textfield',
			name:	    'fieldLabel',
			fieldLabel: 'Field Label'
		    }
		]
	    }
	},
	{
	    name:   'Number Field',
	    type:  'numberfield',
	    config:{
		xtype: 'numberfield'
	    },
	    form:{
		items: [
		    {
			xtype:	    'textfield',
			name:	    'name',
			fieldLabel: 'Name'
		    },{
			xtype:	    'textfield',
			name:	    'fieldLabel',
			fieldLabel: 'Field Label'
		    }
		]
	    }
	}
    ],

    fieldsetConfig : {
	xtype:'fieldset',
	title: 'Field Options',
	collapsible: false,
	autoHeight:true,
	defaults: {
	    anchor: '-20' // leave room for error icon
	},
	defaultType: 'textfield'
    },

    currentSchema : [],
    currentRecord : null,

    constructor: function(config){
	Ext.apply(this,config||{});
	MS.Schema.superclass.constructor.apply(this,arguments);
	this.addEvents({
            "close" : true,
	    "open"  : true,
	    "schemaupdate": true
        });
	this.fieldstore = new Ext.data.JsonStore({
	    fields: ['name','type'],
	    data : this.elements // from states.js
	});

	this.formStore =  new Ext.ux.data.CouchStore({
            db:    'moneystew',
            view:  'all/forms',
            fields:[
                {name: '_id'},  // I'd love to get rid of this as well
                {name: '_rev'},  // ditto
                {name: 'name'},
		{name: 'type'},
		{name: 'items'}
	    ]
        });
        this.formStore.load({});
	console.log(this.formStore);
	this.currentForm = new Ext.data.JsonStore({
	    fields: ['name','fieldLabel','type'],
	    data: this.currentSchema
	})

	this.ledgerStore = new Ext.ux.data.CouchStore({
	    db:    'moneystew',
            view:  'all/ledger',
            fields:[
                {name: '_id'},  // I'd love to get rid of this as well
                {name: '_rev'},  // ditto
                {name: 'date'},
		{name: 'name'},
		{name: 'amount'},
		{name: 'type'}
	    ]
	})

    },

    viewForms: function(){
	//Use the currnet schema to display the form ...
	console.log(this.formStore);
	var listView = new Ext.list.ListView({
	    store: this.formStore,
	    multiSelect: false,
	    emptyText: 'Nothing here',
	    reserveScrollOffset: true,
	    columns: [{
		header: 'Name',
		width: .5,
		dataIndex: 'name'
	    }
	    ,{
		header: 'Items',
		width: .5,
		dataIndex: 'items',
		tpl: '<tpl for="items">{name}, </tpl>'
	    }
	    ]
	});

	var panel = new Ext.Panel({
	    id:'images-view',
	    layout:'fit',
	    title:'Simple ListView (0 items selected)',
	    items: listView,
	    tbar:[
		{
		    text:"Add new type",
		    listeners:{
			'click':{
			    fn:this.createNew,
			    scope:this
			}
		    }
		}
	    ]
	});
	listView.on('click',this.setCurrentSchema,this);
	this.parent.addTab(panel);

    },

    setCurrentSchema: function(dataview, idx, node, e){
	var rec = dataview.getRecord(node);
	this.currentForm.loadData(rec.data.items);
	this.currentSchema = rec.data.items;
	this.currentRecord = rec;
	this.showSchema();
    },

    addWindow: function(){
	this.combo = new Ext.form.ComboBox({
	    store: this.fieldstore,
	    displayField:'name',
	    valueField:'type',
	    typeAhead: true,
	    mode: 'local',
	    triggerAction: 'all',
	    emptyText:'Select a form element...',
	    selectOnFocus:true,
	    width:135,
	    name: "fieldtype",
	    fieldLabel:"Element Type"
	});

	this.configform = null;
	this.formForm = new Ext.form.FormPanel({
            autoWidth:true,
            frame:true,
            border:false,
            items: [
		this.combo
            ],
            buttons:[{
		text:"Add",
		listeners:{
		    'click':{
			fn:this.addElement,
			scope:this
		    }
		}
	    }
	    ]
	});

	this.addFieldWindow = this.parent.addWindow({
	    items:[this.formForm]
	}, "addelement");

	this.combo.on('select',this.updateConfigForm,this);
    },

    updateConfigForm: function(combo, rec, idx){
	this.parent.log(rec.json);
	this.comboSelect = rec.json;
	//Remove old config if it exists
	if(this.configform != null){
	    this.formForm.remove(this.configform);
	}
	
	this.configform = new Ext.form.FieldSet(
	    Ext.apply(this.fieldsetConfig, rec.json.form)
	);

	this.formForm.add(this.configform);
	this.formForm.doLayout();
    },

    addElement : function(){
	var vals = this.formForm.getForm().getValues();
	if(this.comboSelect){
	    var item = Ext.apply(this.comboSelect.config, vals);	    
	    this.currentSchema.push(item);
	    this.currentForm.loadData(this.currentSchema);
	    this.fireEvent("schemaupdate",this.currentSchema);
	}else{
	    throw "Error adding item, comboSelect is not valid";
	}
	this.parent.log(vals);
	this.addFieldWindow.destroy();
    },

    createNew : function(){
	this.currentSchema = [];
	this.currentRecord = null,
	this.currentForm.loadData(this.currentSchema);
	this.showSchema();
    },

    showSchema : function(){

	var listView = new Ext.list.ListView({
	    region:'center',
	    store: this.currentForm,
	    multiSelect: true,
	    emptyText: 'Nothing here',
	    reserveScrollOffset: true,
	    columns: [{
		header: 'Name',
		width: .33,
		dataIndex: 'name'
	    },{
		header: 'Lable',
		width: .33,
		dataIndex: 'fieldLabel'
	    },{
		header: 'Type',
		width: .33,
		dataIndex: 'fieldtype'
	    }
	    ]
	});
	var name = '';
	if(this.currentRecord != null){
	    name = this.currentRecord.data.name;
	}

	this.forming = new Ext.form.FormPanel({
	    region:'north',
	    autoWidth:true,
	    height: 100,
            frame:true,
            border:false,
            items: [
		{
		    xtype:'textfield',
		    name:'name',
		    fieldLabel:'Type name',
		    value:name
		}

            ],
            buttons:[{
		text:"Add Element",
		listeners:{
		    'click':{
			fn:this.addWindow,
			scope:this
		    }
		}
	    }
	    ]
	});

	var panel = new Ext.Panel({	    
	    layout:'border',
	    title:'Create/Edit Form',
	    closable:true,
	    items: [
		this.forming,
		listView
	    ],
	    tbar:[
		{
		    text:'Add Field',
		    listeners:{
			'click':{
			    fn:this.addWindow,
			    scope:this
			}
		    }
		},{
		    text:'Save',
		    listeners:{
			'click':{
			    fn:this.saveCurrent,
			    scope:this
			}
		    }
		}
	    ]
	});
	
	this.parent.addTab(panel);
    },

    saveCurrent: function(){
	//take the current items and push them to the form
	var formvals = this.forming.getForm().getValues();
	if(this.currentRecord != null){
	    if(formvals.name){
		this.currentRecord.set('name',formvals.name);
	    }
	    this.currentRecord.set('items',this.currentSchema);
	    this.formStore.commitChanges();
	}else{
	    var name = 'default';
	    if(formvals.name){
		name = formvals.name;
	    }
	    var x = new this.formStore.record({
		items:this.currentSchema,
		type:'form',
		name:name
	    });
	    this.formStore.add(x);
	}
	
	//close tab?
    }

});

