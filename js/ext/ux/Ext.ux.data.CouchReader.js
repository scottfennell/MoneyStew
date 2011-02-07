/**
The MIT License

Copyright (c) 2008, Shawn P. Garbett (www.garbett.org), Jonathan Hicks

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

Ext.namespace('Ext.ux', 'Ext.ux.data');

Ext.ux.data.CouchReader = function(meta, recordType){
  meta = meta || {};
  Ext.ux.data.CouchReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};
Ext.extend(Ext.ux.data.CouchReader, Ext.data.JsonReader, {
    
    //This needs to be overriden to add the f.name since this is called by the contructor
    buildExtractors : function() {
        if(this.ef){
            return;
        }
        var s = this.meta, Record = this.recordType,
            f = Record.prototype.fields, fi = f.items, fl = f.length;

        if(s.totalProperty) {
            this.getTotal = this.createAccessor(s.totalProperty);
        }
        if(s.successProperty) {
            this.getSuccess = this.createAccessor(s.successProperty);
        }
        if (s.messageProperty) {
            this.getMessage = this.createAccessor(s.messageProperty);
        }
        this.getRoot = s.root ? this.createAccessor(s.root) : function(p){return p;};
        if (s.id || s.idProperty) {
            var g = this.createAccessor(s.id || s.idProperty);
            this.getId = function(rec) {
                var r = g(rec);
                return (r === undefined || r === '') ? null : r;
            };
        } else {
            this.getId = function(){return null;};
        }
        var ef = [];
        for(var i = 0; i < fl; i++){
            f = fi[i];
            var map = (f.mapping !== undefined && f.mapping !== null) ? f.mapping : 'value.'+f.name;
            ef.push(this.createAccessor(map));
        }
        this.ef = ef;
    },


  /**
   * This override is primarily to default .value on values.
   * Why so much copying is required seems like poor desing on the extjs libraries part
   */
  readRecords : function(o)
  {
    console.log("readRecords");
    
    /**
     * After any data loads, the raw JSON data is available for further custom processing.  If no data is
     * loaded or there is a load exception this property will be undefined.
     * @type Object
     */
    this.jsonData = o;
    if(o.metaData)
    {
        delete this.ef;
        this.meta = o.metaData;
        this.recordType = Ext.data.Record.create(o.metaData.fields);
        this.onMetaChange(this.meta, this.recordType, o);
    }
    var s = this.meta, Record = this.recordType,
        f = Record.prototype.fields, fi = f.items, fl = f.length;

    


    var root = this.getRoot(o), c = root.length, totalRecords = c, success = true;
    if(s.totalProperty)
    {
          var v = parseInt(this.getTotal(o), 10);
          if(!isNaN(v))
          {
              totalRecords = v;
          }
    }
    if(s.successProperty)
    {
          var v = this.getSuccess(o);
          if(v === false || v === 'false')
          {
              success = false;
          }
    }

    var records = [];

    for(var i = 0; i < c; i++)
    {
      var n = root[i];
      var values = {};
      var id = this.getId(n);
      for(var j = 0; j < fl; j++)
      {
        f = fi[j];
        var v = this.ef[j](n);
        values[f.name] = f.convert((v !== undefined) ? v : f.defaultValue, n);
      }
      var record = new Record(values, id);
      record.json = n;
      records[i] = record;
    }

    return {
        success : success,
        records : records,
        totalRecords : totalRecords
    };
  }
});

Ext.ux.data.CouchStore = function(c) {
  var url = (c.url === undefined || c.url === null) ? '/'+c.db+'/'+c.design+'/_view/'+c.view : c.url;
  c = Ext.apply(c,{
    root: 'rows',
    totalProperty: 'total_rows',
    url: url
  });
  Ext.ux.data.CouchStore.superclass.constructor.call(
    this,
    Ext.apply(c, {
      url: url,
      proxy:  !c.data ? new Ext.data.HttpProxy({url: url}) : undefined,
      reader: new Ext.ux.data.CouchReader(c, c.fields)
  }));
  this.addListener('update', function(store, record, operation) {

    if(operation != Ext.data.Record.COMMIT) return;

    Ext.Ajax.request({
      url: '/'+store.db+'/'+record.data._id,
      method: 'PUT',
      jsonData: record.data,
      waitMsg: (store.waitMsg === undefined || store.waitMsg === null) ? 'Saving Data...' : store.waitMsg
    });
  });
  this.addListener('remove', function(store, record, index) {
    Ext.Ajax.request({
      url: '/'+store.db+'/'+record.data._id+'?rev='+record.data._rev,
      method: 'DELETE',
      waitMsg: (store.waitMsg === undefined || store.waitMsg === null) ? 'Deleting Data...' : store.waitMsg
    });
  });
  this.addListener('add', function(store, records, index){
    for(var i=0; i<records.length; i++) {
      record = records[i];
      Ext.Ajax.request({
        url: '/'+store.db,
        method: 'POST',
        jsonData: record.data,
        waitMsg: (store.waitMsg === undefined || store.waitMsg === null) ? 'Adding Data...' : store.waitMsg
      });
    }
  });

  // Disable caching till I can figure out what to do with _dc, contact couchdb guys
  this.proxy.conn.disableCaching = false;

  // Create a record creation helper
  this.record = Ext.data.Record.create(this.fields);
}
Ext.extend(Ext.ux.data.CouchStore, Ext.data.Store);