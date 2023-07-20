module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '192.168.0.220',
      username: 'root',
      // pem: './path/to/pem'
      password: 'root'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'mini-pos',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'http://192.168.0.220:1500',
      MONGO_URL: 'mongodb://mongodb/mini-pos',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local',
      PORT: 1500
    },

    docker: {
      image: 'zodern/meteor:root',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '4.0.5',
    servers: {
      one: {}
    }
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
};
