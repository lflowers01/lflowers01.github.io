{
    "cleanUrls": true,
    "trailingSlash": false,
    "routes": [
      { "handle": "filesystem" },
      { "src": "/assets/(.*)", "dest": "/assets/$1" },
      { "src": "/(.*).html", "dest": "/$1" },
      { "src": "/(.*).htm", "dest": "/$1" }
    ]
  }