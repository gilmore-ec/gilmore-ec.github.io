// Progressive disclosure logic
document.getElementById('subject').addEventListener('change', function () {
    const selectedValue = this.value;

    // Hide all conditional fields first
    document.querySelectorAll('.conditional-fields').forEach(field => {
        field.style.display = 'none';
    });

    // Show relevant fields based on selection
    const messageField = document.getElementById('message');
    let targetFields = null;

    switch (selectedValue) {
        case 'full-time':
            targetFields = document.getElementById('employment-fields');
            break;
        case 'freelance':
            targetFields = document.getElementById('freelance-fields');
            break;
        case 'collaboration':
            targetFields = document.getElementById('collaboration-fields');
            break;
    }

    // Update message placeholder based on selection
    const placeholders = {
        'full-time': 'Tell me about the role, your company culture, and what excites you about this opportunity...',
        'freelance': 'Describe your project goals, current challenges, and what success looks like...',
        'collaboration': 'What kind of collaboration are you envisioning? What would we work on together?',
        'feedback': 'Which project caught your attention? What are your thoughts or suggestions?',
        'general': 'What questions do you have? How can I help you?'
    };

    if (targetFields) {
        targetFields.style.display = 'block';
        targetFields.classList.add('fade-in');
    }

    if (placeholders[selectedValue]) {
        messageField.placeholder = placeholders[selectedValue];
    }

    // Update required fields after changing visibility
    updateRequiredFields();
});

// Call updateRequiredFields when the form is reset
document.querySelector(".formcarryForm").addEventListener("reset", function () {
    // Small delay to let the reset complete
    setTimeout(updateRequiredFields, 10);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    updateRequiredFields();
});

// Dynamic required field management for conditional form fields
function updateRequiredFields() {
    // Get all conditional field containers
    const conditionalContainers = document.querySelectorAll('.conditional-fields');

    conditionalContainers.forEach(container => {
        const isVisible = container.style.display !== 'none';
        const requiredFields = container.querySelectorAll('input[required], select[required], textarea[required]');

        requiredFields.forEach(field => {
            if (isVisible) {
                // Container is visible, make fields required
                field.required = true;
                // Also remove any custom validity that might prevent submission
                field.setCustomValidity('');
            } else {
                // Container is hidden, remove required attribute
                field.required = false;
                // Clear any validation errors
                field.setCustomValidity('');
                // Clear the field value to avoid sending hidden data
                field.value = '';
            }
        });
    });
}

// Form submission
function registerNotificationBar(notifElement) {
    var block = notifElement;
    var content = block.querySelector('.fc-message-content');

    function resetNotification() {
        block.className = 'formcarry-message-block';
    }

    function notify(status, message) {
        var determinateStatus = status === "error" ? "error" : "success";
        var notifClasses = [
            'formcarry-message-block',
            'fc-' + determinateStatus,
            'active'
        ];

        block.className = notifClasses.join(' ');
        content.innerHTML = message;

        // Auto-hide success messages after 5 seconds
        if (status === "success") {
            setTimeout(resetNotification, 5000);
        }
    }

    // Register close event
    var messageClose = block.querySelector('.fc-message-close');
    messageClose.addEventListener('click', resetNotification);

    return {
        resetNotification,
        notify
    };
}

document.querySelector(".formcarryForm").addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

    var href = this.getAttribute("action");
    var formData = new FormData(this);
    var form = this;
    var submitBtn = document.getElementById('submit-btn');

    var { notify, resetNotification } = registerNotificationBar(form.querySelector('.formcarry-message-block'));

    // Reset notification and show loading state
    resetNotification();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';

    fetch(href, {
        method: 'POST',
        headers: {
            Accept: "application/json",
        },
        body: formData
    })
        .then(response => response.json())
        .then(response => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span>';

            if (response.status == "success") {
                notify("success", "Thanks! I'll get back to you within 24 hours.");
                form.reset();

                // Hide conditional fields after reset
                document.querySelectorAll('.conditional-fields').forEach(field => {
                    field.style.display = 'none';
                });
            }
            else if (response.code === 422) {
                Object.keys(response.errors).forEach(function (key) {
                    var field = form.querySelector('[name="' + key + '"]');
                    if (field) {
                        field.setCustomValidity(response.errors[key].message);
                        field.addEventListener('invalid', function () {
                            this.addEventListener('blur', function () {
                                this.setCustomValidity('');
                            });
                        });
                    }
                });
                form.reportValidity();
                notify("error", response.message);
            }
            else {
                notify("error", response.message || "Something went wrong. Please try again.");
            }
        })
        .catch(error => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span>';
            notify("error", "Network error. Please check your connection and try again.");
        });
});

// Enhanced accessibility
document.addEventListener('DOMContentLoaded', function () {
    // Add keyboard navigation for custom elements
    const closeButtons = document.querySelectorAll('.fc-message-close');
    closeButtons.forEach(button => {
        button.setAttribute('tabindex', '0');
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', 'Close message');

        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});