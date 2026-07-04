const repos = document.getElementById("repos");
const usernameInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");
const profile = document.getElementById("profile");

const user1Input = document.getElementById("user1");
const user2Input = document.getElementById("user2");
const battleBtn = document.getElementById("battleBtn");
const battleResult = document.getElementById("battleResult");

searchBtn.addEventListener("click", searchUser);
battleBtn.addEventListener("click", battleUsers);
async function searchUser() {

    const username = usernameInput.value;
    profile.innerHTML = "<h2>Loading...</h2>";
    const response = await fetch(`https://api.github.com/users/${username}`);
if (!response.ok) {
        profile.innerHTML = "<h2>User Not Found 😔</h2>";
        return;
    }

    const data = await response.json();

    profile.innerHTML = `
    <img src="${data.avatar_url}" width="150">

    <h2>${data.name}</h2>

    <p>${data.bio || "No bio available"}</p>

    <p><strong>Joined:</strong> ${new Date(data.created_at).toDateString()}</p>

    <a href="${data.html_url}" target="_blank">
        Visit GitHub Profile
    </a>
`;
const repoResponse = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=5&sort=updated`
);


const repoData = await repoResponse.json();

repos.innerHTML = "<h3>Latest Repositories</h3>";
repoData.forEach(function(repo) {

    repos.innerHTML += `
        <div class="repo-card">
            <a href="${repo.html_url}" target="_blank">
                <h4>${repo.name}</h4>
            </a>

            <p>${repo.description || "No description available"}</p>

            <small>
                ⭐ ${repo.stargazers_count}
                &nbsp;&nbsp;
                🍴 ${repo.forks_count}
                &nbsp;&nbsp;
                ${repo.language || "Unknown"}
            </small>
        </div>
    `;

});
}
async function battleUsers() {

    const user1 = user1Input.value;
    const user2 = user2Input.value;
    if (!user1 || !user2) {
    battleResult.innerHTML = "<h3>Please enter both usernames.</h3>";
    return;
}

    const userResponses = await Promise.all([
        fetch(`https://api.github.com/users/${user1}`),
        fetch(`https://api.github.com/users/${user2}`)
    ]);

    const users = await Promise.all([
        userResponses[0].json(),
        userResponses[1].json()
    ]);

    const repoResponses = await Promise.all([
        fetch(`https://api.github.com/users/${user1}/repos`),
        fetch(`https://api.github.com/users/${user2}/repos`)
    ]);

    const repos = await Promise.all([
        repoResponses[0].json(),
        repoResponses[1].json()
    ]);

    const stars1 = repos[0].reduce((total, repo) => total + repo.stargazers_count, 0);
    const stars2 = repos[1].reduce((total, repo) => total + repo.stargazers_count, 0);

    let winnerCard = "";
let loserCard = "";

if (stars1 > stars2) {

    winnerCard = `
        <div class="winner-card">
            <h2>🏆 Winner</h2>
            <h3>${users[0].login}</h3>
            <p>⭐ ${stars1} Stars</p>
        </div>
    `;

    loserCard = `
        <div class="loser-card">
            <h2>❌ Loser</h2>
            <h3>${users[1].login}</h3>
            <p>⭐ ${stars2} Stars</p>
        </div>
    `;

}
else if (stars2 > stars1) {

    winnerCard = `
        <div class="winner-card">
            <h2>🏆 Winner</h2>
            <h3>${users[1].login}</h3>
            <p>⭐ ${stars2} Stars</p>
        </div>
    `;

    loserCard = `
        <div class="loser-card">
            <h2>❌ Loser</h2>
            <h3>${users[0].login}</h3>
            <p>⭐ ${stars1} Stars</p>
        </div>
    `;

}
else {

    battleResult.innerHTML = `
        <h2>🤝 It's a Tie!</h2>
        <p>Both users have ${stars1} stars.</p>
    `;

    return;
}

battleResult.innerHTML = winnerCard + loserCard;
}