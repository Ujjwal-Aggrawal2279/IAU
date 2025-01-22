// Fetching the Blog Post Records for rendering
const fetchBlogPosts = async (sortOrder = 'desc') => {
    try {
        const response = await fetch(`/api/resource/Blog Post?fields=["*"]&order_by=creation ${sortOrder}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        renderBlogPosts(data.data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Fetch additional info including the image for a specific blog post
const fetchDocInfo = async (name) => {
    try {
        const response = await fetch(`/api/resource/Blog Post/${name}?fields=["*"]`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const docInfo = await response.json();

        // Returning docInfo
        return docInfo.data.meta_image;
    } catch (error) {
        console.error('Error fetching doc info:', error);
        return '';
    }
};

// Render Blog Posts into the container
const renderBlogPosts = async (blogPosts) => {
    const listingsContainer = document.getElementById('news_listings_container');

    // Clearing the container if there are any existing listings
    listingsContainer.innerHTML = '';

    // Creating and appending divs for each blog post
    for (const blog of blogPosts) {
        const date = new Date(blog.published_on);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        // Fetch the image URL
        const imageUrl = await fetchDocInfo(blog.name);


        const blogDiv = document.createElement('div');
        blogDiv.className = 'news-display';
        blogDiv.style.width = '25.6875rem';
        blogDiv.style.height = '30rem';
        blogDiv.style.backgroundImage = 'linear-gradient(180deg, #EFE6D2 0%, rgba(239, 230, 210, 0) 100%)';

        // Customize the content inside the div
        blogDiv.innerHTML = `
            <a href="/newsinfo?NewsTitle=${encodeURIComponent(blog.title)}" style="text-decoration : none;">
                <div style="height : 15.1875rem;">
                    <img src="${imageUrl}" alt="${blog.name}" style="width: 100%; height: 15.1875rem;" />
                </div>
                <article style="padding: 0.875rem">
                    <h4 style="color : #101423; font-weight : 700; font-size : 1.5rem; line-height : 1.875rem; font-family : Encode Sans Condensed;">${(preferred_language_value==="ar" && blog.custom_title_arabic)?blog.custom_title_arabic:blog.title}</h4>
                    <p style="margin-top : 0.75rem; font-family : 'Encode Sans Condensed', system-ui; font-size : 1.375rem; line-height : 2rem; color : #101423; font-weight : 500;">${(preferred_language_value==="ar"&& blog.custom_blog_intro_arabic)?blog.custom_blog_intro_arabic:blog.blog_intro}</p>
                    <div style="display : flex; gap : 1.25rem; align-items : center; margin-top : 0.875rem;">
                        <p style="color: #3D4667; font-family: 'Encode Sans Condensed', system-ui; font-weight: 500; font-size: 1.375rem; line-height: 2rem; margin-top: 0.375rem;">
                        ${formattedDate}
                        </p>
                    </div>
                </article>
            </a>
        `;
        listingsContainer.appendChild(blogDiv);
    }
};

// Handle Sorting
document.getElementById('sort').addEventListener('change', (event) => {
    const sortOrder = event.target.value === 'most-recent' ? 'desc' : 'asc';
    fetchBlogPosts(sortOrder);
});

// Initial fetch
fetchBlogPosts();
