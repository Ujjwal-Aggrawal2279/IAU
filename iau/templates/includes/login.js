// Password Toggler
const pswd_toggler = document.getElementById('password_toggler');
pswd_toggler.addEventListener('click', () => {
    const password_input = document.querySelector('input[name="password"]');
    if(password_input.style.webkitTextSecurity === "none") {
        password_input.style.webkitTextSecurity = "disc";
        }
    else {
        password_input.style.webkitTextSecurity = "none";
    }
})

// login form
const login_form_ele = document.querySelector('#login_form');

login_form_ele.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Gather form data
    const email = document.querySelector('#userId').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('/api/method/iau.custom_login.custom_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usr: email,
                pwd: password,
            }),
        });

        // Handle the response
        if (response.ok) {
            const result = await response.json();
            if (new URLSearchParams(window.location.search).get("redirect-to") && result.message.redirect_url !== "/Login") {
                window.location.href = new URLSearchParams(window.location.search).get("redirect-to");
                return; 
            } else if(new URLSearchParams(window.location.search).get("redirect-to") && result.message.redirect_url === "/Login"){
                location.reload();
            } else {
                window.location.href = result.message.redirect_url;
            }
        } else {
            const error = await response.json();
            console.log('Login failed', error);
            alert('Login failed: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error occurred during login', error);
        alert('An error occurred: ' + error.message);
    }
});

