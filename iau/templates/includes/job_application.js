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
