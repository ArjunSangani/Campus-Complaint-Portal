/**
 * Campus Complaint Portal (CCP) - Login Validation & Admin Authentication
 * Implements Admin-side JavaScript Validations:
 * 
 * - Admin Fig 2: Admin Login Required Fields Validation
 * - Admin Fig 3: Admin Login Invalid Credentials Validation
 */

document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("loginEmail");
    const passInput = document.getElementById("loginPassword");
    const msg = document.getElementById("loginMsg");

    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const pass = passInput ? passInput.value : "";

    // Clear previous invalid states
    [emailInput, passInput].forEach(inp => {
        if (inp) inp.classList.remove("is-invalid");
    });
    msg.innerHTML = "";

    function triggerLoginError(title, text, inputEl) {
        if (inputEl) {
            inputEl.classList.add("is-invalid");
            inputEl.focus();
        }
        msg.innerHTML = `
            <div class="alert alert-danger p-2 mb-0 mt-2 small" role="alert">
                <strong>${title}:</strong> ${text}
            </div>
        `;
        alert(`${title}\n\n${text}`);
    }

    // =========================================================================
    // Admin Fig 2: Admin Login Required Fields Validation
    // =========================================================================
    if (!email || !pass) {
        const firstEmpty = !email ? emailInput : passInput;
        triggerLoginError(
            "Admin Fig 2: All Fields are Required",
            "Please enter both administrator email and password.",
            firstEmpty
        );
        return;
    }

    // =========================================================================
    // Admin Fig 3: Admin Login Invalid Credentials Validation
    // Validates against official demo credentials: admin@ccp.local / admin123
    // =========================================================================
    if (email === "admin@ccp.local") {
        if (pass !== "admin123") {
            triggerLoginError(
                "Admin Fig 3: Invalid Administrator Credentials",
                "Incorrect admin password! Please verify your administrator credentials.",
                passInput
            );
            return;
        }

        // Admin authentication successful
        sessionStorage.setItem("ccp_admin", "true");
        msg.innerHTML = `<div class="alert alert-success p-2 mb-0 mt-2 small">Admin authenticated! Redirecting to Admin Dashboard...</div>`;
        alert("Admin Authentication Successful!\n\nWelcome Administrator. Redirecting to Admin Dashboard...");
        setTimeout(() => {
            location.href = "admin.html";
        }, 600);
        return;
    }

    // Check student user credentials
    const user = CCP.getUsers().find(u => u.email && u.email.toLowerCase() === email && u.password === pass);
    if (user) {
        sessionStorage.setItem("ccp_user", JSON.stringify(user));
        msg.innerHTML = `<div class="alert alert-success p-2 mb-0 mt-2 small">Login successful! Redirecting to Dashboard...</div>`;
        setTimeout(() => {
            location.href = "dashboard.html";
        }, 600);
        return;
    }

    // Fallback credential error
    triggerLoginError(
        "Admin Fig 3: Invalid Administrator Credentials",
        "Invalid email or password. For demo administrator access use:\nEmail: admin@ccp.local\nPassword: admin123",
        emailInput
    );
});
