const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { username } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ 
        message: 'Username is required' 
      });
    }

    // Validate username format
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)) {
      return res.status(400).json({ 
        message: 'Invalid GitHub username format' 
      });
    }

    const response = await axios.get(
      `https://api.github.com/users/${username}/followers?per_page=100`,
      {
        headers: {
          'User-Agent': 'GitHub-Connection-App',
          'Accept': 'application/vnd.github.v3+json'
        },
        timeout: 10000
      }
    );

    const followers = response.data.map(follower => ({
      login: follower.login,
      avatar_url: follower.avatar_url,
      html_url: follower.html_url
    }));

    res.json({
      success: true,
      count: followers.length,
      followers: followers
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;