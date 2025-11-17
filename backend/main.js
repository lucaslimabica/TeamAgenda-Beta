// =======================
// PIPEDRIVE SDK SETUP
// =======================
//const AppExtensionsSDK = window.AppExtensionsSDK;
//let sdk = null;
//let loggedUser = null;
//
//async function initPipedriveSDK() {
//    try {
//        sdk = await new AppExtensionsSDK().initialize();
//        // Define o tamanho inicial do iframe
//        await sdk.execute(AppExtensionsSDK.Command.RESIZE, {
//            width: 500,
//            height: 450
//        });
//        loggedUser = await sdk.user.getUserInfo();
//        console.log("SDK Loaded. Logged user:", loggedUser);
//    } catch (error) {
//        console.error("Error at the Pipedrive SDK:", error);
//        // Aqui é normal falhar se estiveres a testar fora do Pipedrive.
//    }
//}
//initPipedriveSDK();

// =======================
// APP LOGIC
// =======================
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
        // doesn-t allow form submission refresh the page
        event.preventDefault();

        showCalendarView();

        if (currentUser && currentUserName) {
            // span has .textContent
            currentUserName.textContent = currentUser.value || "João";
        }
    });
}
