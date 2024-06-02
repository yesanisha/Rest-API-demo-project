document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.getElementById('posts');
    const postDetailsContainer = document.getElementById('post-details');
    const loadingIndicator = document.getElementById('loading');
    const errorContainer = document.getElementById('error');

    async function fetchPostsAndUsers() {
        try {
            loadingIndicator.style.display = 'block';
            const [postsResponse, usersResponse] = await Promise.all([
                fetch('https://jsonplaceholder.typicode.com/posts'),
                fetch('https://jsonplaceholder.typicode.com/users')
            ]);

            const posts = await postsResponse.json();
            const users = await usersResponse.json();

            const usersMap = users.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {});

            displayPosts(posts, usersMap);
        } catch (error) {
            showError('Failed to fetch posts or users.');
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    function displayPosts(posts, usersMap) {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const user = usersMap[post.userId];
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <p>By: ${user.name} (${user.email})</p>
                <button onclick="fetchPostDetails(${post.id})">View Details</button>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    async function fetchPostDetails(postId) {
        try {
            loadingIndicator.style.display = 'block';
            const [postResponse, commentsResponse] = await Promise.all([
                fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`),
                fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
            ]);

            const post = await postResponse.json();
            const comments = await commentsResponse.json();
            displayPostDetails(post, comments);
        } catch (error) {
            showError('Failed to fetch post details or comments.');
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    function displayPostDetails(post, comments) {
        postDetailsContainer.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <h3>Comments</h3>
        `;

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <p><strong>${comment.name}</strong> (${comment.email})</p>
                <p>${comment.body}</p>
            `;
            postDetailsContainer.appendChild(commentElement);
        });

        postDetailsContainer.style.display = 'block';
    }

    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }

    fetchPostsAndUsers();
});
