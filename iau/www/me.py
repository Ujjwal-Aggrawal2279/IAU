# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

import frappe
import frappe.www.list
from frappe import _

no_cache = 1


def get_context(context):
	if frappe.session.user == "Guest":
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)

	context.current_user = frappe.get_doc("User", frappe.session.user)
	user_doc = frappe.get_doc("User", {"name": frappe.session.user})
	user_roles = {r.role for r in user_doc.roles}
	if "Employee" in user_roles:
		employee_doc = frappe.get_doc("Employee", {"user_id": frappe.session.user})
		if employee_doc.custom_enable_self_service:
			context.show_sidebar = True
		else:
			context.show_sidebar = False
	else:			
		context.show_sidebar = True
