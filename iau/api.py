import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_redirect_url():
    user = frappe.session.user
    user_roles = frappe.get_roles(user)
    if "Supplier" or "Employee" in user_roles:
        return "/me"
    else:
        return "/app/home"
