/**
 * Campus Complaint Portal (CCP) - Registration JS Validation
 * Implements the 5 JavaScript Validations required for project documentation:
 * 
 * 1. Fig 1.1 JS Validation: All fields are required
 * 2. Fig 1.2 JS Validation: Password Length
 * 3. Fig 1.3 JS Validation: Email Pattern
 * 4. Fig 1.4 JS Validation: Password Pattern
 * 5. Fig 1.5 JS Validation: Phone number patterns
 */

document.getElementById("registerForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("regName");
    const enrollmentInput = document.getElementById("regEnrollment");
    const emailInput = document.getElementById("regEmail");
    const phoneInput = document.getElementById("regPhone");
    const deptInput = document.getElementById("regDept");
    const semInput = document.getElementById("regSem");
    const passwordInput = document.getElementById("regPassword");
    const msg = document.getElementById("registerMsg");
    const enableAlert = document.getElementById("enableAlert") ? document.getElementById("enableAlert").checked : true;

    const name = nameInput ? nameInput.value.trim() : "";
    const enrollment = enrollmentInput ? enrollmentInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const dept = deptInput ? deptInput.value : "";
    const sem = semInput ? semInput.value : "";
    const password = passwordInput ? passwordInput.value : "";

    // Clear previous invalid states
    const fields = [nameInput, enrollmentInput, emailInput, phoneInput, deptInput, semInput, passwordInput];
    fields.forEach(f => {
        if (f) f.classList.remove("is-invalid");
    });
    msg.innerHTML = "";

    // Helper to render error both in UI and as alert popup for documentation screenshots
    function triggerValidationError(figTitle, errorText, inputElement) {
        if (inputElement) {
            inputElement.classList.add("is-invalid");
            inputElement.focus();
        }

        // Render visible alert banner on the page
        msg.innerHTML = `
            <div class="alert alert-danger p-3 mb-0" role="alert">
                <strong>${figTitle}</strong><br>
                <span>${errorText}</span>
            </div>
        `;

        // Trigger alert dialog for screenshot if enabled
        if (enableAlert) {
            alert(`${figTitle}\n\n${errorText}`);
        }
    }

    // =========================================================================
    // Fig 1.1 JS Validation: All fields are required
    // =========================================================================
    if (!name || !enrollment || !email || !phone || !dept || !sem || !password) {
        let firstEmpty = null;
        if (!name) firstEmpty = nameInput;
        else if (!enrollment) firstEmpty = enrollmentInput;
        else if (!email) firstEmpty = emailInput;
        else if (!phone) firstEmpty = phoneInput;
        else if (!dept) firstEmpty = deptInput;
        else if (!sem) firstEmpty = semInput;
        else if (!password) firstEmpty = passwordInput;

        triggerValidationError(
            "Fig 1.1 JS Validation: All fields are required",
            "Please fill in all required fields. None of the fields can be left blank.",
            firstEmpty
        );
        return;
    }

    // =========================================================================
    // Fig 1.5 JS Validation: Phone number patterns
    // Must be exactly 10 digits (typically starting with 6-9 in India)
    // =========================================================================
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(phone)) {
        triggerValidationError(
            "Fig 1.5 JS Validation: Phone number patterns",
            "Invalid phone number! Must be a valid 10-digit mobile number starting with 6, 7, 8, or 9 (e.g. 9876543210).",
            phoneInput
        );
        return;
    }

    // =========================================================================
    // Fig 1.3 JS Validation: Email Pattern
    // Validates standard email address format (username@domain.extension)
    // =========================================================================
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        triggerValidationError(
            "Fig 1.3 JS Validation: Email Pattern",
            "Invalid email format! Please enter a valid email pattern (e.g. student@example.com).",
            emailInput
        );
        return;
    }

    // =========================================================================
    // Fig 1.2 JS Validation: Password Length
    // Password must be at least 8 characters long
    // =========================================================================
    if (password.length < 8) {
        triggerValidationError(
            "Fig 1.2 JS Validation: Password Length",
            "Password is too short! Password length must be at least 8 characters.",
            passwordInput
        );
        return;
    }

    // =========================================================================
    // Fig 1.4 JS Validation: Password Pattern
    // Must contain at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character
    // =========================================================================
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        triggerValidationError(
            "Fig 1.4 JS Validation: Password Pattern",
            "Password does not match pattern requirements! Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).",
            passwordInput
        );
        return;
    }

    // =========================================================================
    // Existing Backend/Storage Logic
    // =========================================================================
    const users = CCP.getUsers();
    const normalizedEmail = email.toLowerCase();
    if (users.some(u => u.email && u.email.toLowerCase() === normalizedEmail)) {
        triggerValidationError(
            "Registration Error",
            "An account with this email already exists. Please login or use a different email.",
            emailInput
        );
        return;
    }

    // Save registered user
    users.push({
        name,
        enrollment,
        email: normalizedEmail,
        phone,
        department: dept,
        semester: sem,
        password
    });
    CCP.saveUsers(users);

    msg.innerHTML = `
        <div class="alert alert-success p-3 mb-0" role="alert">
            <strong>Success!</strong> Registration successful. Redirecting to login...
        </div>
    `;

    if (enableAlert) {
        alert("Registration Successful!\n\nYour account has been registered. Redirecting to login page...");
    }

    setTimeout(() => {
        location.href = "login.html";
    }, 1000);
});
