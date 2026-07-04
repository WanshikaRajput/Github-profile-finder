const repos = document.getElementById("repos");
const usernameInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");
const profile = document.getElementById("profile");

searchBtn.addEventListener("click", searchUser);
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
