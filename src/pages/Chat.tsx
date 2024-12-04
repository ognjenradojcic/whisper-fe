import { FormEvent, useEffect, useState } from "react";
import { MessageService } from "../common/services/MessageService";
import { useParams } from "react-router-dom";
import { useAuth } from "../common/context/AuthProvider";
import { IMessage } from "../common/models/Message";
import Echo from "laravel-echo";

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const { receiverId } = useParams();
  const { loginData } = useAuth();

  const authUserId = loginData.data.id;

  const getMessages = async () => {
    const response = await MessageService.oldMessages(receiverId);

    const data = response?.data.data;

    if (data) {
      console.log("HERE");
      setMessages((prevMessages) => [...prevMessages, ...data]);
    }
  };

  useEffect(() => {
    getMessages();

    const channel = window.Echo.private(`users.${receiverId}.${authUserId}`);

    channel.listen("MessageReceived", (e: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, e]);
      console.log("Event: ", e);
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
        {messages.map((message, index) => (
          <div
            className={`list-group-item list-group-item-action py-3 lh-sm ${
              message.receiver.id === authUserId ? "text-start" : "text-end"
            }`}
            key={index}
          >
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h3 className="card-title">{message.sender.name}</h3>
                <p className="card-text">{message.payload}</p>
              </div>
            </div>
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
