let currentPage = 1;
const recordsPerPage = 12;
let sortOrder = 'desc'; // Default sort order

// Fetch Job Openings from API
const fetchJobOpenings = async (page = 1) => {
    try {
        const offset = (page - 1) * recordsPerPage;
        const response = await fetch(`/api/resource/Job Opening?fields=["*"]&limit_page_length=${recordsPerPage}&limit_start=${offset}&order_by=posted_on ${sortOrder}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        renderJobOpenings(data.data);
        updatePagination(page);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Render Job Openings into the container
const renderJobOpenings = (jobOpenings) => {
    const listingsContainer = document.getElementById('listings_container');
    listingsContainer.innerHTML = ''; // Clear previous listings

    // Creating and appending divs for each job opening
    jobOpenings.forEach(job => {
        const date = new Date(job.posted_on);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        const jobDiv = document.createElement('div');
        jobDiv.style.width = '475px';
        jobDiv.style.height = '127px';
        jobDiv.style.backgroundImage = 'linear-gradient(to bottom, #FFFBF1, #EAE2C4)';
        jobDiv.style.padding = '21px 24px';

        jobDiv.innerHTML = `
        <a href="/eservice/jobInfo?JobTitle=${encodeURIComponent(job.job_title)}" style="text-decoration: none !important;">
            <p class="job-title-class" style="font-family: 'Encode Sans Condensed'; font-size: 24px; font-weight: 700; line-height: 30px; color: #101423">
                ${job.job_title}
            </p>
            <div style="display: flex; justify-content: space-between; margin-top: 36px;">
                <p style="font-family: Inter Display; font-size: 18px; line-height: 32px; color: #8092A7;">
                    ${formattedDate}
                </p>
            </div>
        </a>
        `;

        listingsContainer.appendChild(jobDiv);
    });
};

// Update Pagination Controls
const updatePagination = (page) => {
    document.getElementById('currentPage').textContent = `${page}`;
    currentPage = page;
};

// Add Event Listeners for Pagination Controls
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        fetchJobOpenings(currentPage - 1);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    fetchJobOpenings(currentPage + 1);
});

// Search Functionality
document.getElementById('jobSearchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const divs = document.querySelectorAll('#listings_container > div');

    divs.forEach(div => {
        const titleElement = div.querySelector('.job-title-class');
        if (titleElement) {
            const title = titleElement.textContent.toLowerCase();
            if (title.includes(filter)) {
                div.style.display = '';
            } else {
                div.style.display = 'none';
            }
        }
    });
});

// Handle Sorting
document.getElementById('sort').addEventListener('change', (event) => {
    sortOrder = event.target.value === 'most-recent' ? 'desc' : 'asc';
    fetchJobOpenings(currentPage);
});

// Initial Fetch for the First Page
fetchJobOpenings(1);
