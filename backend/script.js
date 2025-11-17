// =======================
// PIPEDRIVE SDK SETUP
// =======================
const AppExtensionsSDK = window.AppExtensionsSDK;
let sdk = null;
let loggedUser = null;

async function initPipedriveSDK() {
    try {
        sdk = await new AppExtensionsSDK().initialize();
        // iframe size
        await sdk.execute(AppExtensionsSDK.Command.RESIZE, {
            width: 500,
            height: 450
        });
        loggedUser = await sdk.user.getUserInfo();
        console.log("SDK Loaded. Logged user:", loggedUser);
    } catch (error) {
        console.error("Error at the Pipedrive SDK:", error);
        // It's normal to fail here if without a Pipedrive login context
    }
}

// =======================
// APP STATE
// =======================
let accessToken = null;
let refreshIntervalId = null;

const authView = document.getElementById("authView");
const calendarView = document.getElementById("calendarView");

const loginForm = document.getElementById("loginForm");
const authStatus = document.getElementById("authStatus");

const currentUserNameSpan = document.getElementById("currentUserName");
const eventsListEl = document.getElementById("eventsList");
const calendarStatus = document.getElementById("calendarStatus");

const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");

function showAuthView() {
    authView.classList.remove("hidden");
    calendarView.classList.add("hidden");
}

function showCalendarView() {
    authView.classList.add("hidden");
    calendarView.classList.remove("hidden");
}

// =======================
// LOGIN (ALPHA)
// =======================
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    authStatus.textContent = "";
    authStatus.className = "status";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        authStatus.textContent = "Please fill both email and password.";
        authStatus.classList.add("error");
        return;
    }

    try {
        authStatus.textContent = "Signing in...";

        // Alpha login
        const bodyPayload = {
            email,
            password,
            pipedriveUserId: loggedUser ? loggedUser.id : null,
            pipedriveCompanyId: loggedUser ? loggedUser.company_id : null
        };

        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyPayload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Login failed.");
        }

        const data = await response.json();
        // Esperado: { token: "jwtOrSessionToken", userName: "Name", teamId: 123, ... }
        accessToken = data.token;

        currentUserNameSpan.textContent = data.userName || email;
        authStatus.textContent = "Login success!";
        authStatus.classList.add("success");

        showCalendarView();
        await loadTeamEvents();

        // Atualização automática de X em X segundos (ex: 30s)
        if (refreshIntervalId) clearInterval(refreshIntervalId);
        refreshIntervalId = setInterval(loadTeamEvents, 30000);
    } catch (error) {
        console.error(error);
        authStatus.textContent = error.message;
        authStatus.classList.add("error");
    }
});

// =======================
// LOGOUT
// =======================
logoutBtn.addEventListener("click", () => {
    accessToken = null;
    if (refreshIntervalId) clearInterval(refreshIntervalId);
    eventsListEl.innerHTML = "";
    calendarStatus.textContent = "";
    showAuthView();
});

// =======================
// LOAD EVENTS
// =======================
async function loadTeamEvents() {
    if (!accessToken) return;

    calendarStatus.textContent = "Loading team events...";
    calendarStatus.className = "status";

    try {
        // Exemplo de chamada à tua API (que lê a DB)
        const response = await fetch("/api/team-events", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || "Cannot load events.");
        }

        const events = await response.json();
        // Esperado algo tipo:
        // [
        //   { id: 1, title: "Call with Client X", start: "2025-11-17T10:00:00Z", end: "...", ownerName: "Ana" },
        //   ...
        // ]
        renderEvents(events);
        calendarStatus.textContent = `Showing ${events.length} events from your team.`;
    } catch (error) {
        console.error(error);
        calendarStatus.textContent = error.message;
        calendarStatus.className = "status error";
        eventsListEl.innerHTML = "";
    }
}

function renderEvents(events) {
    if (!events || events.length === 0) {
        eventsListEl.innerHTML = "<p style='font-size:13px; color:#6b7280;'>No events for your team.</p>";
        return;
    }

    eventsListEl.innerHTML = "";

    // Podias ordenar por data aqui
    events.sort((a, b) => new Date(a.start) - new Date(b.start));

    for (const event of events) {
        const item = document.createElement("div");
        item.className = "event-item";

        const startDate = new Date(event.start);
        const endDate = event.end ? new Date(event.end) : null;

        const timeStr = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const endTimeStr = endDate
            ? endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : null;

        item.innerHTML = `
            <div class="event-title">${event.title || "(No title)"}</div>
            <div class="event-meta">
                ${startDate.toLocaleDateString()} — ${timeStr}${endTimeStr ? " - " + endTimeStr : ""}
            </div>
            <div class="badge-owner">${event.ownerName || "Unknown owner"}</div>
        `;

        eventsListEl.appendChild(item);
    }
}

// Botão "Refresh"
refreshBtn.addEventListener("click", loadTeamEvents);

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", async () => {
    await initPipedriveSDK();
    showAuthView(); // começa sempre no login (alpha)
});
