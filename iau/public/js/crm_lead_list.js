frappe.listview_settings["CRM Lead"] = {
    onload : function(listview){
        if (frappe.get_route()[1] === "CRM Lead") {
        $('.standard-filter-section input[data-fieldname="lead_name"]').closest('.form-group').hide();
        $('.standard-filter-section input[data-fieldname="name"]').closest('.form-group').hide();
    }
    },
    refresh: function(listview) {
        const reportOption = document.querySelector('li[data-view="Report"] a');
        if (reportOption) {
            reportOption.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                window.location.href = '/app/crm-lead/view/report/Lead View4';
            });
        }
    }
}