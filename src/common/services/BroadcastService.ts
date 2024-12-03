import Echo from "laravel-echo";
import { axios } from "../config/axios";
import config from "../config/config";

export const BroadcastService = {
  echo() {
    return new Echo({
      authEndpoint: `${config.baseUrl}/broadcasting/auth`,
      broadcaster: "pusher",
      key: config.pusherKey,
      cluster: config.pusherCluster,
      encrypted: true,
      authorizer: (channel: any, options: any) => {
        return {
          authorize: (socketId: string, callback: Function) => {
            axios
              .post(`${config.baseUrl}/broadcasting/auth`, {
                socket_id: socketId,
                channel_name: channel.name,
              })
              .then((response) => {
                callback(false, response.data);
              })
              .catch((error) => {
                callback(true, error);
              });
          },
        };
      },
    });
  },
};
