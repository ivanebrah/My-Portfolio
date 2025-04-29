// Function to adjust footer position based on scroll
function scrollFooter(scrollY, heightFooter) {
    if (scrollY >= heightFooter) {
        $('footer').css({ 'bottom': '0px' });
    } else {
        $('footer').css({ 'bottom': '-' + heightFooter + 'px' });
    }
}

// Load function to set up initial positions
$(window).on('load', function () {
    var windowHeight = $(window).height(),
        footerHeight = $('footer').height(),
        heightDocument = windowHeight + $('.content').height() + $('footer').height() - 20;

    $('#scroll-animate, #scroll-animate-main').css({ 'height': heightDocument + 'px' });
    $('header').css({ 'height': windowHeight + 'px', 'line-height': windowHeight + 'px' });
    $('.wrapper-parallax').css({ 'margin-top': windowHeight + 'px' });
    scrollFooter(window.scrollY, footerHeight);

    var handleScroll = _.throttle(function () {
        var scroll = window.scrollY;
        $('#scroll-animate-main').css({ 'top': '-' + scroll + 'px' });
        $('header').css({ 'background-position-y': 50 - (scroll * 100 / heightDocument) + '%' });
        scrollFooter(scroll, footerHeight);
    }, 100);

    window.onscroll = handleScroll;
});

// Smooth scrolling fix for navigation links (adjust for fixed navbar)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));

        if (!target) {
            console.error("Error: Section not found for", this.getAttribute('href'));
            return;
        }

        const headerHeight = document.querySelector('.navbar').offsetHeight;

        window.scrollTo({
            top: target.offsetTop - headerHeight - 20,
            behavior: 'smooth'
        });
    });
});

// Form validation with warnings inside input boxes
function validateForm() {
    var nameField = document.querySelector('input[name="introduzir_nome"]');
    var emailField = document.querySelector('input[name="introduzir_email"]');
    var subjectField = document.querySelector('input[name="introduzir_assunto"]');
    var messageField = document.querySelector('textarea[name="introduzir_mensagem"]');

    var onlyLetters = /^[a-zA-Z\s]*$/;
    var onlyEmail = /^[^\s@]+@[^\s@]+$/;

    // Remove previous warnings
    document.querySelectorAll('.input-warning').forEach(el => el.remove());

    let isValid = true;

    function showWarning(field, message) {
        var warning = document.createElement('span');
        warning.className = 'input-warning';
        warning.style.color = '#dc3545';
        warning.style.fontSize = '0.9rem';
        warning.style.fontWeight = 'bold';
        warning.innerText = message;
        field.parentNode.appendChild(warning);
        isValid = false;
    }

    if (!nameField.value.match(onlyLetters)) {
        showWarning(nameField, "Please enter a valid name (letters only).");
    }

    if (!emailField.value.match(onlyEmail)) {
        showWarning(emailField, "Please enter a valid email address.");
    }

    if (!subjectField.value.match(onlyLetters)) {
        showWarning(subjectField, "The subject should contain only letters.");
    }

    if (messageField.value.trim() === "") {
        showWarning(messageField, "Message cannot be empty.");
    }

    if (!isValid) {
        return false;
    }

    sendEmail(); // If validation passes, send the email
    return true;
}

// Function to send email using EmailJS and reset the form
function sendEmail() {
    const nameField = document.querySelector('input[name="introduzir_nome"]');
    const emailField = document.querySelector('input[name="introduzir_email"]');
    const subjectField = document.querySelector('input[name="introduzir_assunto"]');
    const messageField = document.querySelector('textarea[name="introduzir_mensagem"]');
    const feedback = document.getElementById("email-feedback");

    if (!nameField.value || !emailField.value || !subjectField.value || !messageField.value) {
        return; // Prevent sending if fields are empty (handled in validation)
    }

    feedback.innerHTML = `<p class="sending">Sending...</p>`;

    emailjs.send("service_hi0en52", "template_s4g4b0r", {
        from_name: nameField.value,
        from_email: emailField.value,
        subject: subjectField.value,
        message: messageField.value
    }).then(
        function () {
            feedback.innerHTML = `<p class="success">Email Sent Successfully!</p>`;

            // Clear the form fields after successful submission
            nameField.value = "";
            emailField.value = "";
            subjectField.value = "";
            messageField.value = "";
        },
        function (error) {
            console.error("Error:", error);
            feedback.innerHTML = `<p class="error">Failed to send email. Try again.</p>`;
        }
    );
}

// Attach event listener to Send button
document.querySelector(".custom-btn").addEventListener("click", function (e) {
    e.preventDefault();
    validateForm();
});