function filterProjects(category) {
    // Update active filter button class
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Filter project cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all') {
            card.style.display = 'flex';
        } else {
            if (cardCategory === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

async function handleContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    const successAlert = document.getElementById('contact-success');
    const errorAlert = document.getElementById('contact-error');
    const submitBtn = document.getElementById('submit-btn');
    
    // Reset alerts
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending message...';
    
    try {
        const response = await fetch('/api/v1/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            successAlert.innerText = data.message;
            successAlert.style.display = 'block';
            document.getElementById('contact-form').reset();
        } else {
            let errorMsg = data.detail || 'Failed to send message';
            if (Array.isArray(errorMsg)) {
                errorMsg = errorMsg.map(err => err.msg).join(', ');
            }
            throw new Error(errorMsg);
        }
    } catch (err) {
        errorAlert.innerText = err.message;
        errorAlert.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            Send Message
        `;
    }
}
