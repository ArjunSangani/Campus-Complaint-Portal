/**
 * Campus Complaint Portal (CCP) - Admin Console Management & Validations
 * Implements Admin-side JavaScript Validations:
 * 
 * - Admin Fig 1: Route Protection / Access Denied Validation
 * - Admin Fig 4: Complaint Status Change Validation & Confirmation
 * - Admin Fig 5: Complaint Deletion Confirmation Validation
 */

// =============================================================================
// Admin Fig 1: Route Protection / Access Denied Validation
// Prevents unauthenticated users from accessing the admin console directly
// =============================================================================
(function checkAdminAuth() {
    const isAdmin = sessionStorage.getItem("ccp_admin");
    if (isAdmin !== "true") {
        alert("Admin Validation Fig 1: Access Denied!\n\nAdministrator credentials are required to view this dashboard. Redirecting to login...");
        location.href = "login.html";
    }
})();

const adminCategories = [
    "Classroom", "Laboratory", "Wi-Fi", "Library", "Hostel",
    "Canteen", "Transport", "Washroom", "Electricity", "Water Supply", "Parking", "Other"
];

// Populate category dropdown
const catSelect = document.getElementById("adminCategory");
if (catSelect) {
    adminCategories.forEach(x => {
        catSelect.insertAdjacentHTML("beforeend", `<option value="${x}">${x}</option>`);
    });
}

/**
 * Render complaints table and statistics
 */
function adminRender() {
    const data = CCP.getComplaints();
    const q = (document.getElementById("adminSearch")?.value || "").toLowerCase().trim();
    const s = document.getElementById("adminStatus")?.value || "";
    const cat = document.getElementById("adminCategory")?.value || "";

    // Update Statistics
    const totalEl = document.getElementById("aTotal");
    const pendingEl = document.getElementById("aPending");
    const progressEl = document.getElementById("aProgress");
    const resolvedEl = document.getElementById("aResolved");

    if (totalEl) totalEl.textContent = data.length;
    if (pendingEl) pendingEl.textContent = data.filter(x => x.status === "Pending").length;
    if (progressEl) progressEl.textContent = data.filter(x => x.status === "In Progress").length;
    if (resolvedEl) resolvedEl.textContent = data.filter(x => x.status === "Resolved").length;

    // Filter complaints
    const rows = data.filter(x => {
        const matchStatus = !s || x.status === s;
        const matchCategory = !cat || x.category === cat;
        const matchSearch = !q || [x.id, x.studentName, x.title, x.category, x.priority].some(v => String(v).toLowerCase().includes(q));
        return matchStatus && matchCategory && matchSearch;
    });

    const tbody = document.getElementById("adminTable");
    if (!tbody) return;

    if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-secondary py-4 font-monospace">No complaints found matching the criteria.</td></tr>';
        return;
    }

    tbody.innerHTML = rows.map(x => `
        <tr>
            <td class="font-monospace text-secondary">${CCP.escape(x.id)}</td>
            <td><strong>${CCP.escape(x.studentName)}</strong></td>
            <td>${CCP.escape(x.category)}</td>
            <td><span class="badge ${x.priority === 'High' ? 'bg-danger' : x.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-secondary'}">${CCP.escape(x.priority)}</span></td>
            <td>${CCP.escape(x.date)}</td>
            <td>
                <select class="form-select form-select-sm terminal-input" onchange="changeStatus('${x.id}', this.value)">
                    ${["Pending", "In Progress", "Resolved", "Rejected"].map(st => `<option value="${st}" ${st === x.status ? "selected" : ""}>${st}</option>`).join("")}
                </select>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteComplaint('${x.id}')">Delete</button>
            </td>
        </tr>
    `).join("");
}

// =============================================================================
// Admin Fig 4: Complaint Status Change Validation & Confirmation
// =============================================================================
function changeStatus(id, newStatus) {
    const validStatuses = ["Pending", "In Progress", "Resolved", "Rejected"];
    if (!validStatuses.includes(newStatus)) {
        alert("Admin Validation Fig 4 Error: Invalid status selected.");
        adminRender();
        return;
    }

    const complaints = CCP.getComplaints();
    const item = complaints.find(c => c.id === id);
    if (!item) {
        alert("Admin Validation Fig 4 Error: Complaint record not found.");
        return;
    }

    const confirmed = confirm(`Admin Validation Fig 4: Confirm status change for complaint [${id}] from "${item.status}" to "${newStatus}"?`);
    if (!confirmed) {
        adminRender(); // Revert select element back to previous value
        return;
    }

    item.status = newStatus;
    CCP.saveComplaints(complaints);
    adminRender();
    CCP.toast(`Complaint ${id} status updated to ${newStatus}`);
}

// =============================================================================
// Admin Fig 5: Complaint Deletion Confirmation Validation
// =============================================================================
function deleteComplaint(id) {
    const confirmed = confirm(`Admin Validation Fig 5: Are you sure you want to permanently delete complaint [${id}]?\n\nWarning: This action cannot be reversed!`);
    if (!confirmed) return;

    const complaints = CCP.getComplaints().filter(x => x.id !== id);
    CCP.saveComplaints(complaints);
    adminRender();
    alert(`Admin Validation Fig 5: Complaint [${id}] deleted successfully.`);
}

// Event Listeners
document.getElementById("adminSearch")?.addEventListener("input", adminRender);
document.getElementById("adminStatus")?.addEventListener("input", adminRender);
document.getElementById("adminCategory")?.addEventListener("input", adminRender);

// Demo Data Loader with Validation Confirmation
document.getElementById("seedBtn")?.addEventListener("click", () => {
    if (!confirm("Admin Validation: Load standard demo complaint records into LocalStorage?")) return;
    CCP.seed();
    adminRender();
    alert("Admin Validation: Demo complaints loaded successfully.");
});

// Logout handler
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    sessionStorage.removeItem("ccp_admin");
    alert("Admin logged out successfully.");
    location.href = "login.html";
});

// Initialize on page load
adminRender();
