// Upload button 
document.getElementById('uploadButton').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

// Function to get a query parameter value by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get the job title from the query parameter
document.addEventListener('DOMContentLoaded', async function () {
    const jobTitle = getQueryParam('JobTitle');

    if (jobTitle) {
        const decodedTitle = decodeURIComponent(jobTitle);

        try {
            // Fetch the job record details from the Frappe API
            const response = await fetch(`/api/resource/Job%20Opening?limit_page_length=null&fields=["*"]&filters=[["job_title", "=", "${decodedTitle}"]]`);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                const jobDetails = data.data[0];
                const jobTitleEle = document.getElementById('job_title');
                const departmentEle = document.getElementById('department');
                const employmentTypeEle = document.getElementById('employment_type');
                const locationEle = document.getElementById('location');
                const jobInputEle = document.querySelector('input#job_title');
                jobTitleEle.textContent = `Applying for ${jobDetails.job_title}`;
                departmentEle.textContent = jobDetails.department;
                employmentTypeEle.textContent = jobDetails.employment_type;
                locationEle.textContent = jobDetails.location;
                jobInputEle.value = jobDetails.name;
            } else {
                console.error('Job not found');
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    }
    const notSavedIndicator = document.getElementById('not-saved-indicator');
    const inputFields = document.querySelectorAll('input:not(#job_title), textarea');

    function checkInputFields() {
        let isAnyFieldFilled = Array.from(inputFields).some(input => input.value.trim() !== '');
        if (isAnyFieldFilled) {
            notSavedIndicator.style.display = 'block';
        } else {
            notSavedIndicator.style.display = 'none';
        }
    }

    // Add event listeners to all relevant input fields
    inputFields.forEach(field => field.addEventListener('input', checkInputFields));

    // Initial check in case fields are pre-filled
    checkInputFields();
});

// Function to create a Job Applicant record in Frappe with file upload
async function submitJobApplication(event) {
    event.preventDefault();  // Prevent default form submission

    // Collect form data
    const jobTitle = document.getElementById('job_title').value;
    const applicantName = document.getElementById('applicant_name').value;
    const applicantEmail = document.getElementById('applicant_email').value;
    const applicantPhone = document.getElementById('applicant_phone_number').value;
    const countryOfResidence = document.getElementById('country_of_residence').value;
    const coverLetter = document.getElementById('cover_letter').value;
    const resumeFile = document.getElementById('fileInput').files[0];  // Corrected file input ID

    if (!resumeFile) {
        console.error('No resume file selected.');
        return;
    }

    // First, upload the resume file to Frappe's file storage
    const uploadedFileUrl = await uploadResumeFile(resumeFile);

    if (!uploadedFileUrl) {
        console.error('Failed to upload resume file.');
        return;
    }

    // Now, create the Job Applicant record with the resume URL
    const formData = {
        "doctype": "Job Applicant",
        "applicant_name": applicantName,
        "email_id": applicantEmail,
        "phone_number": applicantPhone,
        "country": countryOfResidence,
        "cover_letter": coverLetter,
        "resume_attachment": uploadedFileUrl // Use the correct field name
    };

    try {
        const response = await fetch('/api/resource/Job%20Applicant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `token ece9e6462948f84:eeae5e6d50ebb9c`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Job application submitted successfully:', result);
        } else {
            console.error('Failed to submit job application:', response.statusText);
        }
    } catch (error) {
        console.error('Error submitting job application:', error);
    }
}

// Function to upload resume file to Frappe
async function uploadResumeFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doctype', 'Job Applicant');
    formData.append('docname', 'resume_attachment'); // Ensure this matches the field in your DocType

    try {
        const response = await fetch('/api/method/upload_file', {
            method: 'POST',
            headers: {
                'Authorization': `token ece9e6462948f84:eeae5e6d50ebb9c`
            },
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            return result.message.file_url; // Return the file URL
        } else {
            console.error('Failed to upload file:', response.statusText);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

// Add submit event listener
const form = document.getElementById('jobApplicationForm');
form.addEventListener('submit', submitJobApplication);
