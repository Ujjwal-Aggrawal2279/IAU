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
        const currentHost = window.location.host;
        const url = `http://${currentHost}/jobApplication?JobTitle=${decodedTitle}`;
        // Generate QR code
        const qr = new QRious({
            value: url,
            size: 250
        });

        // Convert QR code to data URL
        const qrDataUrl = qr.toDataURL();

        // Set the data URL as the src of the img element
        document.getElementById('qrcode-img').src = qrDataUrl;
        // document.getElementById('job-title').textContent = decodedTitle;
        document.title = decodedTitle + ' - Job Information'; // Set the title of the page

        try {
            // Fetch the job record details from the Frappe API
            const response = await fetch(`/api/resource/Job%20Opening?limit_page_length=1&fields=["*"]&filters=[["job_title", "=", "${decodedTitle}"]]`);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                const jobDetails = data.data[0];
                const departmentEle = document.getElementById('department');
                const employmentTypeEle = document.getElementById('employment_type');
                const locationEle = document.getElementById('location');
                const jobDescriptionEle = document.getElementById('job_description');
                jobDescriptionEle.style.fontFamily = 'Encode Sans Condensed, system-ui';
                jobDescriptionEle.style.fontWeight = 500;
                const applyLink = document.getElementById('apply-link');

                document.getElementById('job-title').textContent = (preferred_language_value==="ar" && jobDetails.custom_job_title_arabic)?jobDetails.custom_job_title_arabic:decodedTitle;
                departmentEle.textContent = (preferred_language_value==="ar" && jobDetails.custom_department_arabic)?jobDetails.custom_department_arabic:jobDetails.department;
                employmentTypeEle.textContent = (preferred_language_value==="ar" && jobDetails.custom_employment_type_arabic)?jobDetails.custom_employment_type_arabic:jobDetails.employment_type;
                locationEle.textContent = (preferred_language_value==="ar" && jobDetails.custom_location_arabic)?jobDetails.custom_location_arabic:jobDetails.location;

                // Replace newlines with <br> for job description
                const formattedDescription = (preferred_language_value==="ar" && jobDetails.custom_job_description_arabic)?jobDetails.custom_job_description_arabic.replace(/\n/g, '<br>'):jobDetails.custom_job_description.replace(/\n/g, '<br>');
                jobDescriptionEle.innerHTML = formattedDescription;

                // Set the href dynamically using the job title
                applyLink.href = `/jobApplication?JobTitle=${encodeURIComponent(jobDetails.job_title)}`;

                // Function to check if user is authenticated
                async function checkAuthentication() {
                    try {
                        const response = await fetch('/api/method/frappe.auth.get_logged_user', {
                            method: 'GET',
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (!data.message) {
                                return false;
                            }
                            return true;
                        } else {
                            throw new Error('Failed to check authentication');
                        }
                    } catch (error) {
                        console.error('Error checking authentication:', error);
                        return false;
                    }
                }

                applyLink.addEventListener('click', async function (event) {
                    event.preventDefault();

                    const isAuthenticated = await checkAuthentication();

                    if (isAuthenticated) {
                        // If authenticated, navigate to the jobApplication page
                        window.location.href = applyLink.href;
                    } else {
                        // If not authenticated, redirecting to login page with "next" parameter
                        window.location.href = `/Login?redirect-to=${encodeURIComponent(applyLink.href)}`;
                    }
                });
            } else {
                console.error('Job not found');
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    }
});
