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

    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)) {
      return res.status(400).json({ 
        message: 'Invalid GitHub username format' 
      });
    }

    const response = await axios.get(
      `https://api.github.com/users/${username}/following?per_page=100`,
      {
        headers: {
          'User-Agent': 'GitHub-Connection-App',
          'Accept': 'application/vnd.github.v3+json'
        },
        timeout: 10000
      }
    );

    const following = response.data.map(user => ({
      login: user.login,
      avatar_url: user.avatar_url,
      html_url: user.html_url
    }));

    res.json({
      success: true,
      count: following.length,
      following: following
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;