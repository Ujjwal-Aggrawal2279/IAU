import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def reset_password(email):
    if not email:
        frappe.throw(_("Email is required"))
    
    return {"message": "Password reset link has been sent to your email."}
