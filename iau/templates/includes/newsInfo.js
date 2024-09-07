// Function to get a query parameter value by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to format the date
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options); // 'en-GB' for British English format
}

// Function to get paragraphs from text
function getParagraphs(text) {
    // Split by double newlines to separate paragraphs
    return text.split(/\n\s*\n/);
}

// Get the job title from the query parameter
document.addEventListener('DOMContentLoaded', async function () {
    const newsTitle = getQueryParam('NewsTitle');
    if (newsTitle) {
        const decodedTitle = decodeURIComponent(newsTitle);
        document.getElementById('news-title').textContent = decodedTitle;
        document.title = decodedTitle; // Set the title of the page
        try {
            // Fetch the job record details from the Frappe API
            const response = await fetch(`/api/resource/Blog%20Post?limit_page_length=1&fields=["*"]&filters=[["title", "=", "${decodedTitle}"]]`);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                const BlogDetails = data.data[0];

                // Format the published date
                const publishEle = document.getElementById('published_on');
                publishEle.textContent = ` Published on ${formatDate(BlogDetails.published_on)}`;

                // Get paragraphs
                const paragraphs = getParagraphs(BlogDetails.custom_blog_description);

                // Set the image
                const news_image_ele = document.getElementById('news_image');
                news_image_ele.src = BlogDetails.meta_image;

                // Set the first paragraph in the news_intro element
                const newsIntroEle = document.getElementById('news_intro');
                if (paragraphs.length > 0) {
                    newsIntroEle.textContent = paragraphs[0];
                }

                // Set the rest of the paragraphs in the news_content element
                const newsContentEle = document.getElementById('news_content');
                if (paragraphs.length > 1) {
                    newsContentEle.innerHTML = paragraphs.slice(1).join('<br/><br/>');
                }
            } else {
                console.error('Blog post not found');
            }
        } catch (error) {
            console.error('Error fetching blog details:', error);
        }
    }
});
