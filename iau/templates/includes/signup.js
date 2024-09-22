async function getCsrfToken() {
    const response = await fetch('/api/method/iau.custom_login.get_csrf_token', {
        method: 'GET',
        credentials: 'include', // Include cookies to ensure proper session
    });
    const data = await response.json();
    return data.csrf_token;
}

document.addEventListener('DOMContentLoaded', async () => {
    const csrfToken = await getCsrfToken();
    document.querySelector('#csrf_token').value = csrfToken; // Set the hidden input value
});

const signup_form_ele = document.querySelector('#signup_form');

signup_form_ele.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Gather form data
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const csrfToken = document.querySelector('#csrf_token').value; // Get the CSRF token

    try {
        const response = await fetch('/api/method/iau.custom_login.custom_sign_up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken // Include the CSRF token here
            },
            body: JSON.stringify({
                email: email,
                full_name: username,
            }),
        });

        // Handle the response
        if (response.ok) {
            const result = await response.json();
            alert('Sign up successful! Please check your email for verification.');
        } else {
            const error = await response.json();
            console.log(error);
            alert('Sign up failed: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error occurred during sign-up', error);
        alert('An error occurred: ' + error.message);
    }
});
