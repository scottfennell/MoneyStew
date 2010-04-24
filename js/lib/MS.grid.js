Ext.ns('MS.grid');

MS.grid = Ext.extend(Ext.grid.GridPanel,{

    columns: [
        {id: 'company', header: 'Company', width: 200, sortable: true, dataIndex: 'company'},
        {header: 'Price', renderer: Ext.util.Format.usMoney, dataIndex: 'price'},
        {header: 'Change', dataIndex: 'change'},
        {header: '% Change', dataIndex: 'pctChange'},
        // instead of specifying renderer: Ext.util.Format.dateRenderer('m/d/Y') use xtype
        {
            header: 'Last Updated', width: 135, dataIndex: 'lastChange',
            xtype: 'datecolumn', format: 'M d, Y'
        }
    ],
    viewConfig: {
        forceFit: true
    },
    sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
    title: 'Framed with Row Selection and Horizontal Scrolling',
    iconCls: 'icon-grid'
});
