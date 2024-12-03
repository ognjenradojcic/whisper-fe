const config = {
  baseUrl: "http://localhost:8000/api",
  auth: true,
  pusherKey: process.env.REACT_APP_PUSHER_KEY,
  pusherCluster: process.env.REACT_APP_PUSHER_CLUSTER,
};

export default config;
