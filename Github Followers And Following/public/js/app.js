class GitHubExplorer {
    constructor() {
        this.input = document.querySelector('.search-input');
        this.button = document.querySelector('.button');
        this.followersContainer = document.querySelectorAll('.list-container')[0];
        this.followingContainer = document.querySelectorAll('.list-container')[1];

        this.init();
    }

    init() {
        this.button.addEventListener('click', () => this.handleSearch());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
    }

    async handleSearch() {
        const username = this.input.value.trim();
        if (!username) {
            alert('Please enter a GitHub username');
            return;
        }

        this.showLoading(true);
        this.clearResults();

        try {
            const [followersData, followingData] = await Promise.all([
                this.fetchGitHub(`https://api.github.com/users/${username}/followers`),
                this.fetchGitHub(`https://api.github.com/users/${username}/following`)
            ]);

            this.displayUsers(this.followersContainer, followersData, 'Followers');
            this.displayUsers(this.followingContainer, followingData, 'Following');
        } catch (err) {
            alert(err.message || 'Failed to fetch data');
        } finally {
            this.showLoading(false);
        }
    }

    async fetchGitHub(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error('User not found');
        return await res.json();
    }

    displayUsers(container, users, title) {
        container.innerHTML = `<h2 class="list-title">${title}</h2>`;

        if (!users.length) {
            container.innerHTML += `
                <div class="empty-state">
                    <i class="fas fa-${title === 'Followers' ? 'user-friends' : 'user-check'}"></i>
                    <p>No ${title.toLowerCase()} found</p>
                </div>
            `;
            return;
        }

        const list = document.createElement('ul');
        list.className = 'user-list';

        users.forEach(u => {
            const item = document.createElement('li');
            item.className = 'user-item';
            item.innerHTML = `
                <div class="user-avatar">
                    <img src="${u.avatar_url}" alt="${u.login}" 
                        style="width:40px;height:40px;border-radius:50%;" 
                        onerror="this.src='https://via.placeholder.com/40?text=?'">
                </div>
                <div class="user-info">
                    <a href="${u.html_url}" target="_blank" rel="noopener" class="user-name">
                        ${u.login}
                    </a>
                    <p class="user-bio">${u.type}</p>
                </div>
            `;
            list.appendChild(item);
        });

        container.appendChild(list);
    }

    showLoading(isLoading) {
        if (isLoading) {
            this.button.disabled = true;
            this.button.querySelector('.button__text').textContent = 'Searching...';
        } else {
            this.button.disabled = false;
            this.button.querySelector('.button__text').textContent = 'SEARCH';
        }
    }

    clearResults() {
        this.followersContainer.innerHTML = `<h2 class="list-title">Followers</h2>`;
        this.followingContainer.innerHTML = `<h2 class="list-title">Following</h2>`;
    }
}

document.addEventListener('DOMContentLoaded', () => new GitHubExplorer());
