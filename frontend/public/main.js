// =======================
// PIPEDRIVE SDK SETUP
// =======================
const AppExtensionsSDK = window.AppExtensionsSDK;
let sdk = null;
let loggedUser = null;

async function initPipedriveSDK() {
    try {
        sdk = await new AppExtensionsSDK().initialize();
        // Define o tamanho inicial do iframe
        await sdk.execute(AppExtensionsSDK.Command.RESIZE, {
            width: 500,
            height: 450
        });
        loggedUser = await sdk.user.getUserInfo();
        console.log("SDK Loaded. Logged user:", loggedUser);
    } catch (error) {
        console.error("Error at the Pipedrive SDK:", error);
        // Aqui é normal falhar se estiveres a testar fora do Pipedrive.
    }
}
// Pipedrive test
initPipedriveSDK();
// =======================
// APP LOGIC
// =======================
// Elements for login logic
const authView = document.getElementById("authView");
const calendarView = document.getElementById("calendarView");
const currentUser = document.getElementById("email");
const loginBtn = document.getElementById("loginBtn");
const currentUserName = document.getElementById("currentUserName");

// Show calendar after login
function showCalendarView() {
    if (!authView || !calendarView) return;
    authView.classList.add("hidden");
    calendarView.classList.remove("hidden");
}

if (loginBtn) {
    loginBtn.addEventListener("click", (event) => {
        console.log("Login button clicked");
        // doesn-t allow form submission refresh the page
        event.preventDefault();

        showCalendarView();

        if (currentUser && currentUserName) {
            // span has .textContent
            currentUserName.textContent = currentUser.value || "João";
        }

        // Write the day of the week grid
        renderWeekGrid();
    });
}

// Inserting events
const eventsList = document.getElementById("eventsList");
const HOURS = [ // work hours array
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];
const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function renderWeekGrid() {
    if (!eventsList) return;
    // Clear existing content
    eventsList.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "week-grid";

    // Create header row
    const emptyHeader = document.createElement("div");
    emptyHeader.className = "week-cell week-header";
    grid.appendChild(emptyHeader);

    // header days of the week 
    WEEK_DAYS.forEach(day => { // Creates a div for each week day to show as header of the grid
        const dayHeader = document.createElement("div"); 
        dayHeader.className = "week-cell week-header"; /*each week day header has this class*/
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });

    // Colunm for hours
    HOURS.forEach(hour => {
        const hourCell = document.createElement("div")
        hourCell.className = "week-cell week-day-cell"; /* first column: hour labels */
        hourCell.textContent = hour;
        grid.appendChild(hourCell);
        
        WEEK_DAYS.forEach(day => {
            const cell = document.createElement("div");
            cell.className = "week-cell week-day-cell"; /* grid cell for a specific day/hour */
            cell.dataset.day = day;
            cell.dataset.hour = hour;

            grid.appendChild(cell)
        })
    });

    eventsList.appendChild(grid);
}