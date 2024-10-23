import frappe
from frappe.utils.file_manager import save_file

@frappe.whitelist(allow_guest=True)
def submit_job_application(applicant_name, jobTitle, email_id, phone_number, country, cover_letter, resume_file_data):
    # Create Job Applicant record
    job_applicant = frappe.get_doc({
        "doctype": "Job Applicant",
        "job_title": jobTitle,
        "applicant_name": applicant_name,
        "email_id": email_id,
        "phone_number": phone_number,
        "country": country,
        "cover_letter": cover_letter
    })
    
    # Save job applicant to the database
    job_applicant.insert(ignore_permissions=True)
    
    # Save the file to the record
    if resume_file_data:
        file_doc = save_file(fname=resume_file_data.get("filename"), content=resume_file_data.get("content"), 
                             dt="Job Applicant", dn=job_applicant.name, is_private=True, decode = True)
        job_applicant.resume_attachment = file_doc.file_url
        job_applicant.save()
    
    frappe.db.commit()  # Ensure changes are committed

    return {
        "status": "success",
        "job_applicant_id": job_applicant.name,
        "message": "Job application submitted successfully"
    }
