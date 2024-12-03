import { FormEvent, useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { BroadcastService } from "../common/services/BroadcastService";
import { MessageService } from "../common/services/MessageService";
import { useParams } from "react-router-dom";
import { useAuth } from "../common/context/AuthProvider";
import { send } from "process";

interface MessageEvent {
  id: number;
  payload: string;
}

const Chat = () => {
  const [username, setUsername] = useState<string>("username");
  const [receivedMessages, setReceivedMessages] = useState<MessageEvent[]>([]);
  const [sentMessages, setSentMessages] = useState<MessageEvent[]>([]);
  const [message, setMessage] = useState<string>("");
  const { receiverId } = useParams();
  const { loginData } = useAuth();

  const authUserId = loginData.data.id;

  const getMessages = async () => {
    const response = await MessageService.oldMessages(receiverId);

    const data = response?.data.data;

    if (data) {
      setReceivedMessages(data.received);
      setSentMessages(data.sent);
    }
  };

  useEffect(() => {
    getMessages();

    const channel = window.Echo.private(`users.${receiverId}.${authUserId}`);

    channel.listen("MessageReceived", (e: MessageEvent) => {
      setReceivedMessages((prevMessages) => [...prevMessages, e]);
      console.log("Event: ", e.payload);
    });

    return () => {
      channel.stopListening("MessageReceived");
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    MessageService.create({
      receiver_id: receiverId,
      payload: message,
    }).catch((error) => {
      console.log("Error: ", error);
    });

    setMessage("");
  };

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary"></div>
      <div className="list-group list-group-flush border-bottom scrollarea">
        {receivedMessages.map((message, index) => (
          <div
            className="list-group-item list-group-item-action py-3 lh-sm"
            key={index}
          >
            <div className="d-flex w-100 align-items-center justify-content-between">
              <strong className="mb-1">{message.payload}</strong>
            </div>
            <div className="col-10 mb-1 small">{message.payload}</div>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => submit(e)}>
        <input
          className="form-control"
          placeholder="Write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></input>
      </form>
    </div>
  );
};

export default Chat;
