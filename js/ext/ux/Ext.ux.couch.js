/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.ns.("Ext.ux");

Ext.ux.couch = new Ext.extend(Ext.data.JsonStore, {

    //This schema is used to create a default template to apply the data to
    //before saving to the database.
    schema : {
        //Save template
        template: {
            type:'',
            name:''
        },
        //Reader fields
        fields : [
            'name',
            'type'
        ]
    },

    constructor : function(config){
        this.name = config.name;
        this.addEvents({
            "add" : true
        });

        //Configuration options for json store
        Ext.apply(this,config||{});
        //Reader config
        config.fields = this.schema.fields;
        
        Ext.ux.couch.superclass.constructor.call(this, Ext.apply(config, {
            reader: new Ext.data.JsonReader(config)
        }));
        this.db = new CouchDB(this.database);
    },

    updateReader : function(){


    },

    add: function(item)
    {
        //automatically save time
        //todo.time = (new Date()).getTime();
        this.db.save(item);
        this.fireEvent('add',item);
        
    },

    load:function()
    {
        var all_docs = this.db.view("todo/all");

        if(all_docs && all_docs.total_rows > 0) {
            for(var idx = 0; idx < all_docs.total_rows; idx++) {
                var todo = all_docs.rows[idx];
                this.insert({
                    _id:todo.id,
                    _rev:todo.value.rev,
                    text:todo.value.text
                });
            }
        }
    },

    remove:function(li)
    {
        var doc = this._todos[li.id];
        this.db.deleteDoc(doc);
        this._todos[li.id] = null;

        $("todos").removeChild($(li.id));
        this.updateEmpty();

        // focus the input field
        $("todo").focus();
    },

    updateEmpty: function()
    {
        //if there are no todos, show a message
        $("empty").style.display = (0 == $("todos").childNodes.length)?"block":"none";
    }
});