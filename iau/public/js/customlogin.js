document.addEventListener('DOMContentLoaded', () => {
    // Check if the redirection has already occurred
    if (!localStorage.getItem('redirected')) {
        // Fetch the server response for any stored redirect URL
        fetch('/api/method/iau.api.get_redirect_url')
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Store the redirect URL and set the flag in localStorage
                    localStorage.setItem('redirect_url', data.message);
                    localStorage.setItem('redirected', 'true');

                    // Perform the redirection
                    window.location.href = data.message;
                }
            })
            .catch(error => {
                console.error('Failed to fetch redirect URL:', error);
            });
    } else {
        // Clear the flag from localStorage after redirection has occurred
        localStorage.removeItem('redirected');
    }
});
