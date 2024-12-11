const config = {
  baseUrl: `http://${window.location.hostname}:8000/api`,
  auth: true,
  pusherKey: process.env.REACT_APP_PUSHER_KEY,
  pusherCluster: process.env.REACT_APP_PUSHER_CLUSTER,
  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
};

export default config;
