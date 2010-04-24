/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Require form and store
 */

Ext.ux.CrudPanel = function(config){

    Ext.apply(this,config||{});

    this.editFormClick = function(b,e){	
	var rec = this.selModel.getSelected();
	var form = new this.form({
	    record: rec
	});
	this.currentWindow = new Ext.Window({
	    width:400,
	    height:300,
	    layout:'fit',
	    title: 'Edit Item',
	    items:[form]
	});
	this.currentWindow.show();
	form.on('save', this.saveAfterEdit, this)
    }

    this.addFormClick = function(){
	var form = new this.form();
	this.currentWindow = new Ext.Window({
	    width:400,
	    height:300,
	    layout:'fit',
	    title: 'Add Item',
	    items:[form]
	});
	this.currentWindow.show();
	form.on('save', this.saveAfterAdd, this)
    }

    this.saveAfterEdit = function(data){
	//record should be updated
	this.completeEditAdd();
    }

    this.saveAfterAdd = function(data){
	var x = new this.store.record(data);
	this.store.add(x);
	this.completeEditAdd();
    }

    this.completeEditAdd = function(){
	this.store.commitChanges();
	if(this.currentWindow){
	    this.currentWindow.destroy();
	}
    }


    this.sm = new Ext.grid.CheckboxSelectionModel({
	listeners: {
	    // On selection change, set enabled state of the removeButton
	    // which was placed into the GridPanel using the ref config
	    selectionchange: function(sm) {
		if (sm.getCount()) {
		    sm.grid.removeButton.enable();
		} else {
		    sm.grid.removeButton.disable();
		}
	    }
	}
    });

    var cols = [this.sm];
    if(this.columns){
	this.columns = cols.concat(this.columns);
    }

    this.cm = new Ext.grid.ColumnModel(this.columns);

    this.tbar =  [{
	    text:'Add Something',
	    tooltip:'Add a new row',
	    iconCls:'add',
	    listeners:{
		click:{
		    fn:this.addFormClick,
		    scope: this
		}

	    }
	}, '-', {
	    text:'Edit',
	    tooltip:'Edit the selected item',
	    iconCls:'option',
	    listeners:{
		click:{
		    fn:this.editFormClick,
		    scope: this
		}
	    }
	},'-',{
	    text:'Remove Something',
	    tooltip:'Remove the selected item',
	    iconCls:'remove',
	    listeners: {
		click:{
		    fn:function(b,e){
			var sel = this.selModel.getSelected();
			if(sel){
			    this.store.remove(sel);
			}
		    },
		    scope:this
		}
	    },

	    // Place a reference in the GridPanel
	    ref: '../removeButton',
	    disabled: true
	}];

    this.viewConfig = {
	forceFit:true
    };

    //Overridable config options
    Ext.applyIf(this, {
	title:		'CrudPanel',
	singleSelect:	true,
	columnLines:	true
    });

    Ext.ux.CrudPanel.superclass.constructor.apply(this,arguments);
}

Ext.extend(Ext.ux.CrudPanel, Ext.grid.GridPanel);
