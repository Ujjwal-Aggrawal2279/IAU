import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def custom_login(usr, pwd):
    """
    Custom login method to authenticate user via API and check user roles and desk access.
    :param usr: Email of the user
    :param pwd: Password of the user
    :return: Success or Error message with redirection based on roles and desk access
    """
    try:
        # Authenticate user with Frappe's inbuilt authenticate method
        login_manager = frappe.auth.LoginManager()
        login_manager.authenticate(user=usr, pwd=pwd)
        login_manager.post_login()

        # Fetch user roles after successful login
        user_doc = frappe.get_doc("User", usr)
        user_roles = [d.role for d in user_doc.get("roles")]

        # List of roles that typically have Desk access (can be customized)
        roles = frappe.get_list("Role", filters=[["desk_access", "=", 1]], fields=["name"])
        # Extract just the names
        desk_access_roles = [role['name'] for role in roles]
        has_desk_access = frappe.utils.has_common(user_roles, desk_access_roles)
        if any(role in user_roles for role in ["Supplier", "Customer", "Employee"]):
            if has_desk_access:
                # Redirect to desk if user has desk access
                return {
                    "message": _("Login successful, redirecting to desk"),
                    "redirect_url": "/desk",
                    "user": usr
                }
            else:
                return {
                    "message": _("Login successful, redirecting to /me"),
                    "redirect_url": "/me",
                    "user": usr
                }
        else:
            # Redirect to desk if user has desk access and other roles
            if has_desk_access:
                return {
                    "message": _("Login successful, redirecting to desk"),
                    "redirect_url": "/desk",
                    "user": usr
                }
            else:
                # Redirect to /me if no desk access
                return {
                    "message": _("Login successful, redirecting to /me"),
                    "redirect_url": "/me",
                    "user": usr
                }

    except frappe.AuthenticationError:
        frappe.clear_messages()
        return {
            "message": _("Invalid login credentials. Please try again."),
            "status_code": 401
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Login Error"))
        return {
            "message": str(e),
            "status_code": 500
        }

@frappe.whitelist(allow_guest=True)
def logout():
    frappe.local.login_manager.logout()
    return {
        "message": _("Logged out successfully."),
        "url": "/Login",
    }
    