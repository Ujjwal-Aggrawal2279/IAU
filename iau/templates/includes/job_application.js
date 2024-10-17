// Function to extract query parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const jobTitle = params.get('job_title');
    return { email, jobTitle };
}

// Fetch job application and job details using Frappe API
async function fetchJobApplication(email, jobTitle) {
    try {
        const notSavedIndicator = document.querySelector('#not-saved-indicator');
        // notSavedIndicator.textContent = 'Saved';
        notSavedIndicator.style.display = 'none';
        const submit_button_container = document.querySelector('.submit-button-container');
        submit_button_container.style.display = 'none';
        const uploadButton = document.querySelector('#uploadButton');
        uploadButton.style.display = 'none';
        // API URL to fetch Job Applicant details
        const applicantUrl = `/api/resource/Job%20Applicant?filters=[["email_id", "=", "${email}"], ["job_title", "=", "${jobTitle}"]]&fields=["*"]`;

        // API URL to fetch Job Opening details
        const jobUrl = `/api/resource/Job Opening?filters=[["name", "=", "${jobTitle}"]]&fields=["*"]`;

        // Fetch Job Applicant data
        const response = await fetch(applicantUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch job application.');
        }

        const data = await response.json();
        if (data.data.length === 0) {
            throw new Error('No job application found.');
        }

        const jobApplication = data.data[0];
        notSavedIndicator.textContent = `Status : ${jobApplication.status}`;

        // Set Job Applicant fields
        const jobInputEle = document.querySelector('input#job_title');
        const applicantInputEle = document.querySelector('input#applicant_name');
        const emailInputEle = document.querySelector('input#applicant_email');
        const applicantPhone = document.getElementById('applicant_phone_number');
        const countryOfResidence = document.getElementById('country_of_residence');
        const coverLetter = document.getElementById('cover_letter');
        const fileInputEle = document.querySelector('#fileNameDisplay');

        jobInputEle.value = jobApplication.job_title;
        applicantInputEle.value = jobApplication.applicant_name;
        emailInputEle.value = jobApplication.email_id;
        applicantPhone.value = jobApplication.phone_number;
        countryOfResidence.value = jobApplication.country;
        coverLetter.value = jobApplication.cover_letter;
        fileInputEle.textContent = `File uploaded ${jobApplication.resume_attachment}`;

        // Set all fields to readonly
        jobInputEle.readOnly = true;
        emailInputEle.readOnly = true;
        applicantInputEle.readOnly = true;
        applicantPhone.readOnly = true;
        countryOfResidence.readOnly = true;
        coverLetter.readOnly = true;

        // Fetch Job Opening details
        const jobResponse = await fetch(jobUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!jobResponse.ok) {
            throw new Error('Failed to fetch job details.');
        }

        const jobData = await jobResponse.json();
        if (jobData.data.length === 0) {
            throw new Error('No job details found.');
        }

        const jobDetails = jobData.data[0];

        // Set Job Opening fields
        const jobTitleEle = document.getElementById('job_title');
        const departmentEle = document.getElementById('department');
        const employmentTypeEle = document.getElementById('employment_type');
        const locationEle = document.getElementById('location');

        jobTitleEle.textContent = `Applied for ${jobDetails.job_title}`;
        departmentEle.textContent = jobDetails.department;
        employmentTypeEle.textContent = jobDetails.employment_type;
        locationEle.textContent = jobDetails.location;

    } catch (error) {
        console.error('Error fetching job application or job details:', error.message);
    }
}

// Usage
const { email, jobTitle } = getQueryParams();
if (email) { // Check if email exists in URL parameters
    fetchJobApplication(email, jobTitle);
} else {
    console.warn('No email parameter found in the URL.');
}







// Fetching Logged In User Details
async function fetchLoggedInUserDetails() {
    try {
        // Fetch the logged-in user's ID
        const response = await fetch('/api/method/frappe.auth.get_logged_user');
        const data = await response.json();

        if (data.message) {
            // Fetch the user details using the email
            const userResponse = await fetch(`/api/resource/User?filters=[["email", "=", "${data.message}"]]&fields=["*"]`);
            const userData = await userResponse.json();

            // Check if user data exists and return full_name and email
            if (userData.data && userData.data.length > 0) {
                const user = userData.data[0];
                return {
                    full_name: user.full_name,
                    email: user.email
                };
            }
        }
        return null; // Return null if no user found
    } catch (error) {
        console.error('Error fetching logged in user details:', error);
        return null;
    }
}
// Trigger file input on button click
document.getElementById('uploadButton').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

// Show the file name in the UI when a file is selected
document.getElementById('fileInput').addEventListener('change', function () {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        fileNameDisplay.textContent = `Selected file: ${fileName}`;
    } else {
        fileNameDisplay.textContent = 'No file selected';
    }
});

// Function to get a query parameter value by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get the job title from the query parameter
document.addEventListener('DOMContentLoaded', async function () {
    const jobTitle = getQueryParam('JobTitle');
    const userDetails = await fetchLoggedInUserDetails();

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
                const applicantInputEle = document.querySelector('input#applicant_name');
                const emailInputEle = document.querySelector('input#applicant_email');
                jobTitleEle.textContent = `Applying for ${jobDetails.job_title}`;
                departmentEle.textContent = jobDetails.department;
                employmentTypeEle.textContent = jobDetails.employment_type;
                locationEle.textContent = jobDetails.location;
                jobInputEle.value = jobDetails.name;
                applicantInputEle.value = userDetails.full_name;
                emailInputEle.value = userDetails.email;
            } else {
                console.error('Job not found');
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    }
    const notSavedIndicator = document.getElementById('not-saved-indicator');
    const inputFields = document.querySelectorAll('input:not(#job_title):not(#applicant_name):not(#applicant_email), textarea');

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

document.getElementById('fileInput').addEventListener('change', function () {
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    if (this.files.length > 0) {
        fileNameDisplay.textContent = this.files[0].name;
    } else {
        fileNameDisplay.textContent = 'No file selected';
    }
});

async function submitJobApplication(event) {
    event.preventDefault();  // Prevent default form submission

    // Collect form data
    const jobTitle = document.querySelector('input#job_title').value;
    const applicantName = document.getElementById('applicant_name').value;
    const applicantEmail = document.getElementById('applicant_email').value;
    const applicantPhone = document.getElementById('applicant_phone_number').value;
    const countryOfResidence = document.getElementById('country_of_residence').value;
    const coverLetter = document.getElementById('cover_letter').value;
    const resumeFile = document.getElementById('fileInput').files[0];

    // Validate required fields
    if (!jobTitle || !applicantName || !applicantEmail || !applicantPhone || !countryOfResidence || !coverLetter || !resumeFile) {
        alert('Please fill out all required fields and upload your resume.');
        return;
    }

    // Read file content as base64
    const resumeFileData = await readFileAsBase64(resumeFile);

    // Prepare data to send to the server-side function
    const payload = {
        applicant_name: applicantName,
        jobTitle: jobTitle,
        email_id: applicantEmail,
        phone_number: applicantPhone,
        country: countryOfResidence,
        cover_letter: coverLetter,
        resume_file_data: {
            filename: resumeFile.name,
            content: resumeFileData
        }
    };

    try {
        const response = await fetch('/api/method/iau.jobApplicantCustom.submit_job_application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            showToast('Job application submitted successfully!');
            window.location.pathname = "/Profile";
        } else {
            console.error('Failed to submit job application:', response.statusText);
        }
    } catch (error) {
        console.error('Error submitting job application:', error);
    }
}


// Utility function to read file as base64
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Show toast notification
function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toastContainer.style.display = 'block';

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toastContainer.style.display = 'none';
    }, 3000);
}

// Attach the form submission handler
document.getElementById('jobApplicationForm').addEventListener('submit', submitJobApplication);


// Add submit event listener
const form = document.getElementById('jobApplicationForm');
form.addEventListener('submit', submitJobApplication);
