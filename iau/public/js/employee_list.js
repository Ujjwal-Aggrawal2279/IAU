frappe.listview_settings["Employee"] = {
    hide_name_column:true,
    onload : function(listview){
        if (frappe.get_route()[1] === "Employee") {
        $('.standard-filter-section input[data-fieldname="name"]').closest('.form-group').hide();
    }
}
}