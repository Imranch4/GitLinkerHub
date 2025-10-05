function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  if (err.response) {
    // GitHub API error
    if (err.response.status === 404) {
      return res.status(404).json({ 
        message: 'GitHub user not found' 
      });
    } else if (err.response.status === 403) {
      return res.status(429).json({ 
        message: 'GitHub API rate limit exceeded. Please try again later.' 
      });
    } else {
      return res.status(err.response.status).json({ 
        message: 'GitHub API error' 
      });
    }
  } else if (err.request) {
    // Network error
    return res.status(503).json({ 
      message: 'Cannot connect to GitHub. Please check your internet connection.' 
    });
  } else if (err.code === 'ECONNABORTED') {
    // Timeout error
    return res.status(408).json({ 
      message: 'Request timeout. Please try again.' 
    });
  }

  // Default error
  res.status(500).json({ 
    message: 'Internal server error' 
  });
}

module.exports = errorHandler;