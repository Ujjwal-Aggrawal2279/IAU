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

// Fetching the Job Openings Record for rendering

const fetchJobOpenings = async () => {
    try {
        const response = await fetch('/api/resource/Job Opening?fields=["*"]&limit_page_length=null');
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
        messageDiv.style.height = '100px'; // Adjust height as needed
        messageDiv.style.textAlign = 'center';
        messageDiv.innerHTML = `
            <p style="font-family: 'Encode Sans Condensed'; font-size: 22px; font-weight: 700; color: #101423;">
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
            jobDiv.style.width = '417.67px';
            jobDiv.style.height = '127px';
            jobDiv.style.backgroundImage = 'linear-gradient(to bottom, #FFFBF1, #EAE2C4)';
            jobDiv.style.padding = '21px 24px';

            // Customize the content inside the div
            jobDiv.innerHTML = `
                <p style="font-family: 'Encode Sans Condensed'; font-size: 22px; font-weight: 700; line-height: 28px; color: #101423">${job.job_title}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 36px;">
                    <p style="font-family: Inter Display; font-weight: 500; font-size: 22px; line-height: 32px; color: #3D4667">Learn More</p>
                    <p style="font-family: Inter Display; font-size: 18px; line-height: 32px; color: #8092A7;">${formattedDate}</p>
                </div>
            `;
            listingsContainer.appendChild(jobDiv);
        });
    }
};

fetchJobOpenings();

// Fetching the Blog Posts records for rendering

const fetchBlogPosts = async () => {
    try {
        const response = await fetch('/api/resource/Blog%20Post?fields=["*"]&filters=[["meta_image","!=",""]]&limit_page_length=null');
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
        messageDiv.style.height = '100px';
        messageDiv.style.textAlign = 'center';
        messageDiv.innerHTML = `
            <p style="font-family: 'Encode Sans Condensed'; font-size: 22px; font-weight: 700; color: #101423;">
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

            // Add the global class and swiper-slide class
            blogDiv.classList.add('blogDiv', 'swiper-slide');

            blogDiv.innerHTML = `
                <div style="height: 243px;">
                    <img src="${blog.meta_image}" alt="news 1" />
                </div>
                <article style="padding: 24px">
                    <h4 style="font-family: 'Encode Sans Condensed'; font-size: 22px; font-weight: 700; line-height: 28px; color: #101423;">
                        ${blog.title}
                    </h4>
                    <p style="font-family: Inter Display; font-size: 18px; line-height: 26px; color: #101423;">
                        ${blog.blog_intro}
                    </p>
                    <p style="color: #3D4667; font-family: Inter Display; font-weight: 500; font-size: 22px; line-height: 32px; margin-top: 6px;">
                        ${formattedDate}
                    </p>
                </article>
            `;
            listingsContainer.appendChild(blogDiv);
        });
    }
};

fetchBlogPosts();
