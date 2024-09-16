let currentPage = 1;
const recordsPerPage = 12;
let sortOrder = 'desc';
let allJobOpenings = [];

// Fetch All Job Openings Initially
const fetchAllJobOpenings = async () => {
    try {
        const response = await fetch(`/api/resource/Job Opening?fields=["*"]&order_by=posted_on ${sortOrder}&limit_page_length=null`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allJobOpenings = data.data;
        renderJobOpenings(allJobOpenings.slice(0, recordsPerPage)); // Show first 12 records initially
        updatePagination();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Render Job Openings into the container
const renderJobOpenings = (jobOpenings) => {
    const listingsContainer = document.getElementById('listings_container');
    listingsContainer.innerHTML = ''; // Clear previous listings

    jobOpenings.forEach(job => {
        const date = new Date(job.posted_on);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        const jobDiv = document.createElement('div');
        jobDiv.className = 'job-opening1';
        jobDiv.style.backgroundImage = 'linear-gradient(to bottom, #FFFBF1, #EAE2C4)';
        jobDiv.style.padding = '10px 10px';

        jobDiv.innerHTML = `
        <a href="/eservice/jobInfo?JobTitle=${encodeURIComponent(job.job_title)}" style="text-decoration: none !important;">
            <p class="job-title-class" style="font-family: 'Encode Sans Condensed', system-ui; font-weight: 700; color: #101423">
                ${job.job_title}
            </p>
            <div style="display: flex; justify-content: space-between; margin-top: 36px;">
                <p style="font-family: 'Inter', sans-serif; font-size: 18px; color: #8092A7;">
                    ${formattedDate}
                </p>
            </div>
        </a>
        `;

        listingsContainer.appendChild(jobDiv);
    });
};

// Update Pagination Controls
const updatePagination = () => {
    const totalRecords = allJobOpenings.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear existing pagination

    // Create page numbers dynamically
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'page-button';
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            const start = (i - 1) * recordsPerPage;
            const end = start + recordsPerPage;
            renderJobOpenings(allJobOpenings.slice(start, end)); // Render the records for the selected page
            updatePagination(); // Update pagination to reflect the active page
        });
        paginationContainer.appendChild(pageButton);
    }
};

// Search Functionality
document.getElementById('jobSearchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const filteredJobOpenings = allJobOpenings.filter(job => job.job_title.toLowerCase().includes(filter));

    // Render filtered job openings and reset to first page
    currentPage = 1;
    renderJobOpenings(filteredJobOpenings.slice(0, recordsPerPage));
    updatePagination();
});

// Initial Fetch for All Job Openings
fetchAllJobOpenings();
