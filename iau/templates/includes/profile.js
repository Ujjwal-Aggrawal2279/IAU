async function getUserFullName() {
    try {
        // Fetch the logged-in user's ID
        const response = await fetch('/api/method/frappe.auth.get_logged_user', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('User is not logged in or session has expired.');
        }

        const { message: userId } = await response.json(); // Extract the user ID

        // Fetch the user's details using their ID
        const userDetailsResponse = await fetch(`/api/resource/User/${userId}`, {
            method: 'GET',
        });

        if (!userDetailsResponse.ok) {
            throw new Error('Failed to fetch user details.');
        }

        const { data: userDetails } = await userDetailsResponse.json(); // Extract user details

        // Access the user's Full Name and Image and set it
        const fullNameHeadingEle = document.getElementById('full_name');
        const emailIFEle = document.getElementById('email_id_para');
        const phoneInputEle = document.getElementById('phoneInput');
        const userImageEle = document.getElementById('user_avatar');
        const userInitialsEle = document.getElementById('user_initials');
        const userEmailId = userDetails.email;

        fullNameHeadingEle.textContent = `${userDetails.full_name}`;
        emailIFEle.textContent = `${userDetails.email}`;

        // Handle the user image or fallback to initials
        if (userDetails.user_image) {
            // If user image exists, show it and hide initials
            userImageEle.src = userDetails.user_image;
            userInitialsEle.style.display = 'none';
        } else {
            // If no image, display initials and background color
            userImageEle.style.display = 'none'; // Hide the img element
            const initial = userDetails.full_name.charAt(0).toUpperCase(); // Get the first letter of the full name
            userInitialsEle.textContent = initial;
            userInitialsEle.style.display = 'block'; // Show the initials
        }

        // Fetch job applicant data using the email ID
        const jobApplicantResponse = await fetch(`/api/resource/Job Applicant?limit_page_length=null&fields=["*"]&filters=[["email_id", "=", "${userEmailId}"]]`, {
            method: 'GET',
        });

        if (!jobApplicantResponse.ok) {
            throw new Error('Failed to fetch job applicant data.');
        }

        const { data: jobApplicants } = await jobApplicantResponse.json(); // Extract job applicant data

        // Get the jobsTableBody element
        const jobsTableBody = document.getElementById('jobsTableBody');

        // Clear existing rows (if any)
        jobsTableBody.innerHTML = '';

        // Helper function to format the date
        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        }

        // Append each job applicant as a table row
        jobApplicants.forEach(job => {
            let statusClass = '';
            let statusText = '';

            switch (job.status) {
                case 'Open':
                    statusClass = 'status-open';
                    statusText = 'Open';
                    break;
                case 'Hold':
                    statusClass = 'status-hold';
                    statusText = 'Hold';
                    break;
                case 'Accepted':
                    statusClass = 'status-accepted';
                    statusText = 'Accepted';
                    break;
                case 'Rejected':
                    statusClass = 'status-rejected';
                    statusText = 'Rejected';
                    break;
                case 'Replied':
                    statusClass = 'status-replied';
                    statusText = 'Replied';
                    break;
                default:
                    statusClass = '';
                    statusText = job.status;
            }
            const jobDetailsUrl = `/jobApplication?email=${encodeURIComponent(userDetails.email)}&job_title=${encodeURIComponent(job.job_title)}`;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="${jobDetailsUrl}" style="color: #10142380 !important; font-size : 18px">${job.job_title}</a></td>
                <td style="color: #10142380 !important; font-size : 18px">${formatDate(job.creation)}</td>
                <td class="${statusClass}" style="color: #10142380 !important; font-size : 18px">${statusText} <span class="status-dot"></span></td>
            `;
            jobsTableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Usage
getUserFullName();

// Adding the search functionality
document.getElementById('jobSearchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#jobsTableBody tr');

    rows.forEach(row => {
        const title = row.querySelector('td:first-child').textContent.toLowerCase();
        if (title.includes(filter)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});
