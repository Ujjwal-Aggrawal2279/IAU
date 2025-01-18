var swiper = new Swiper(".myBannerSwiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});
async function total_projects_count(){
    try{
        const projects_count_response = await fetch(`/api/resource/Project?fields=["count(name)"]`);
        if (!projects_count_response.ok) {
            throw new Error('Failed to fetch project count details.');
        }
        const projects_count = await projects_count_response.json();
        document.getElementById('ics_no_of_project_count').innerHTML = ``;
        document.getElementById('ics_no_of_project_count').innerHTML = `
        ${projects_count.data[0]['count(name)']} <br><span>Number of Projects<span>
        `;
    }catch(error){
        console.error("Error in projects count:",error)
    }
}
total_projects_count();

// Fetching the Job Openings Record for rendering

const fetchJobOpenings = async () => {
    try {
        const response = await fetch('/api/resource/Job Opening?fields=["*"]&filters=[["status","=","Open"],["publish","=","1"]]&limit_page_length=9&order_by=creation desc');
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
    const listingsContainer = document.getElementById('jobs_listing_section');

    // Clearing the container if there are any existing listings
    listingsContainer.innerHTML = '';

    if (jobOpenings.length === 0) {
        // Create a message element
        const messageDiv = document.createElement('div');
        messageDiv.style.display = 'flex';
        messageDiv.style.justifyContent = 'center';
        messageDiv.style.alignItems = 'center';
        messageDiv.style.height = '6.25rem';
        messageDiv.style.textAlign = 'center';
        messageDiv.innerHTML = `
            <p style="font-family: 'Encode Sans Condensed', system-ui; font-size: 1.375rem; font-weight: 700; color: #101423;">
                No openings available right now!
            </p>
        `;
        listingsContainer.appendChild(messageDiv);
    } else {
        // Creating and appending divs for each job opening
        jobOpenings.forEach(job => {
            const date = new Date(job.posted_on);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            const jobDiv = document.createElement('div');
            jobDiv.className = 'job-opening';
            jobDiv.style.minWidth = '23.604375rem';
            jobDiv.style.height = '7.9375rem';
            jobDiv.style.backgroundImage = 'linear-gradient(to bottom, #FFFBF1, #EAE2C4)';
            jobDiv.style.padding = '1.3125rem 1.5rem';

            // Customize the content inside the div
            jobDiv.innerHTML = `
                <a href="/jobInfo?JobTitle=${encodeURIComponent(job.job_title)}" style="text-decoration : none;">
                    <p style="font-family: 'Encode Sans Condensed', system-ui; font-size: 1.5rem; font-weight: 700; line-height: 1.75rem; color: #101423">${job.job_title}</p>
                    <div style="margin-top: 2.25rem;">
                        <p style="font-family: 'Encode Sans Condensed', system-ui; font-size: 1.125rem; line-height: 2rem; color: #8092A7;">${formattedDate}</p>
                    </div>
                </a>
            `;
            listingsContainer.appendChild(jobDiv);
        });
    }
};

fetchJobOpenings();

// Fetching the Blog Posts records for rendering

const fetchBlogPosts = async () => {
    try {
        const response = await fetch('/api/resource/Blog%20Post?fields=["*"]&filters=[["meta_image","!=",""]]&limit_page_length=9&order_by=creation desc');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        renderBlogPost(data.data);

        // Initialize Swiper JS after rendering blog posts
        var swiper = new Swiper(".mySwiper", {
            slidesPerView: 3,
            slidesPerGroup: 1,
            spaceBetween: 30,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                280: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                1280: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                1536: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

fetchBlogPosts();


// Render Job Openings into the container
const renderBlogPost = (blogs) => {
    const listingsContainer = document.getElementById('featured_blogs_seection');

    // Clearing the container if there are any existing listings
    listingsContainer.innerHTML = '';

    if (blogs.length === 0) {
        // Create a message element
        const messageDiv = document.createElement('div');
        messageDiv.style.display = 'flex';
        messageDiv.style.justifyContent = 'center';
        messageDiv.style.alignItems = 'center';
        messageDiv.style.height = '6.25rem';
        messageDiv.style.textAlign = 'center';
        messageDiv.innerHTML = `
            <p style="font-family: 'Encode Sans Condensed'; font-size: 1.375rem; font-weight: 700; color: #101423;">
                No News available right now!
            </p>
        `;
        listingsContainer.appendChild(messageDiv);
    } else {
        // Creating and appending divs for each blog post
        blogs.forEach(blog => {
            const date = new Date(blog.published_on);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            const blogDiv = document.createElement('div');
            blogDiv.className = 'news-display';

            // Add the global class and swiper-slide class
            blogDiv.classList.add('blogDiv', 'swiper-slide');

            blogDiv.innerHTML = `
            <a href="/newsinfo?NewsTitle=${encodeURIComponent(blog.title)}" style="text-decoration : none;">
                <div style="height: 15.1875rem;">
                    <img src="${blog.meta_image}" alt="news 1" />
                </div>
                <article style="padding: 1.5rem">
                    <h4 style="font-family: 'Encode Sans Condensed', system-ui; font-size: 1.5rem; font-weight: 700; line-height: 1.75rem; color: #101423;">
                        ${blog.title}
                    </h4>
                    <p>
                        ${blog.blog_intro}
                    </p>
                    <p style="color: #3D4667; font-family: 'Encode Sans Condensed', system-ui; font-weight: 500; font-size: 1.375rem; line-height: 2rem; margin-top: 0.375rem;">
                        ${formattedDate}
                    </p>
                </article>
            </a>
            `;
            listingsContainer.appendChild(blogDiv);
        });
    }
};

fetchBlogPosts();
