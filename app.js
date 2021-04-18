// Selecting the Elements
const githubForm = document.getElementById("github-form");
const nameInput = document.getElementById("githubname");
const clearLastUsers = document.getElementById("clear-last-users");
const lastUsers = document.getElementById("last-users");
const lastSearch = document.getElementById("lastSearch");
const profile = document.getElementById("profile");
const repos = document.getElementById("repos");
const github = new Github();
const ui = new UI();


eventListeners();

function eventListeners() {
    githubForm.addEventListener("submit", getData);
    clearLastUsers.addEventListener("click", clearAllSearched);
    document.addEventListener("DOMContentLoaded", getAllSearched);
    lastSearch.addEventListener("click", getLastData);
    profile.addEventListener("click" ,getInfo);
    repos.addEventListener("click",getInfo);

}

function getData(e) {
    let username = nameInput.value.trim();
    if (username === "") {
        alert("Please enter a username !");
    }
    else {
        github.getGithubData(username)
            .then(response => {
                if (response.user.message === "Not Found") {
                    ui.showError("User not found !");
                }
                else {
                    ui.addSearchedUserToUI(username);
                    Storage.addSearchedUserToStorage(username);
                    ui.showUserInfo(response.user);
                    ui.showRepoInfo(response.repo);
                }
            })
            .catch(err => ui.showError(err));
    }

    ui.clearInput(); // Clears all inputs
    e.preventDefault();
}

function clearAllSearched() {
    if (confirm("All will be deleted. Are you sure ?")) {
        Storage.clearAllSearchedUsersFromStorage();
        ui.clearAllSearchedUsersFromUI();
    }
}

function getAllSearched() {
    // Searched items are taken from the storage and added to the UI

    let users = Storage.getSearchedUsersFromStorage();
    let result = "";
    users.forEach(user => {
        result += `<li class="list-group-item">${user}</li>`;
    });
    lastUsers.innerHTML = result;
}

function getLastData(e) {   // Displays the profile of the last searched user

    let username = e.target.textContent;
    if (e.target.className === "list-group-item") {
        github.getGithubData(username)
            .then(response => {
                ui.showUserInfo(response.user);
                ui.showRepoInfo(response.repo);
            })
            .catch(err => ui.showError(err));
    }
}

function getInfo(e){
    let info = e.target.attributes.href.value;
    window.open(info,"_blank");
}