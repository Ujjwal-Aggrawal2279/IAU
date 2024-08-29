// Fetching the Blog Post Records for rendering
const fetchBlogPosts = async () => {
    try {
        const response = await fetch('/api/resource/Blog Post?fields=["*"]');
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
        const response = await fetch(`/api/method/frappe.desk.form.load.get_docinfo?doctype=Blog Post&name=${name}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const docInfo = await response.json();
        const attachments = docInfo.docinfo.attachments;

        // Assuming the image is the first attachment
        return attachments.length > 0 ? attachments[0].file_url : '';
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
        blogDiv.style.width = '421px';
        blogDiv.style.height = '469px';
        blogDiv.style.backgroundImage = 'linear-gradient(180deg, #EFE6D2 0%, rgba(239, 230, 210, 0) 100%)';

        // Customize the content inside the div
        blogDiv.innerHTML = `
            <div style="height : 243px;">
                <img src="${imageUrl}" alt="${blog.name}" style="width: 100%; height: 243px;" />
            </div>
            <article style="padding: 14px">
                <h4 style="color : #101423; font-weight : 700; font-size : 24px; line-height : 30px; font-family : Encode Sans Condensed;">${blog.name}</h4>
                <p style="margin-top : 12px; font-family : Inter Display; font-size : 22px; line-height : 32px; color : #101423; font-weight : 500;">${blog.blog_intro}</p>
                <div style="display : flex; gap : 20px; align-items : center; margin-top : 14px;">
                    <p style="color: #3D4667; font-family: Inter Display; font-weight: 500; font-size: 22px; line-height: 32px; margin-top: 6px;">
                    ${formattedDate}
                    </p>
                    <a href="/eservice/newsinfo">
                        <p style = "font-family : Inter Display; font-weight : 500; font-size : 22px; line-height : 32px; color : #3D4667; text-decoration : underline; text-decoration-color : #3D4667">Read More</p>
                    </a>
                </div>
            </article>
        `;
        listingsContainer.appendChild(blogDiv);
    }
};

fetchBlogPosts();
