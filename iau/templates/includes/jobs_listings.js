// Fetching the Job Openings Record for rendering

const fetchJobOpenings = async () => {
    try {
        const response = await fetch('/api/resource/Job Opening?fields=["*"]');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        renderJobOpenings(data.data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Render Job Openings into the container
const renderJobOpenings = (jobOpenings) => {
    const listingsContainer = document.getElementById('listings_container');

    // Clearing the container if there are any existing listings
    listingsContainer.innerHTML = '';

    // Creating and appending divs for each job opening
    jobOpenings.forEach(job => {
        const date = new Date(job.posted_on);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const jobDiv = document.createElement('div');
        jobDiv.style.width = '475px';
        jobDiv.style.height = '127px';
        jobDiv.style.backgroundImage = 'linear-gradient(to bottom, #FFFBF1, #EAE2C4';
        jobDiv.style.padding = '21px 24px';

        // Customize the content inside the div
        jobDiv.innerHTML = `
            <p style = "font-family : 'Encode Sans Condensed'; font-size : 24px; font-weight : 700; line-height : 30px; color : #101423">${job.job_title}</p>
            <div style="display : flex; justify-content : space-between; margin-top : 36px;">
                <a href="/eservice/jobInfo">
                    <p style = "font-family : Inter Display; font-weight : 500; font-size : 22px; line-height : 32px; color : #3D4667; text-decoration : underline; text-decoration-color : #3D4667">Learn More</p>
                </a>
                <p style="font-family : Inter Display; font-size : 18px; line-height : 32px; color : #8092A7;">${formattedDate}</p>
            </div>
        `;
        listingsContainer.appendChild(jobDiv);
    });
};

fetchJobOpenings();