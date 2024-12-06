import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../common/context/AuthProvider";
import { IMessage } from "../common/models/Message";
import { MessageService } from "../common/services/MessageService";

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const { receiverId } = useParams();
  const { loginData } = useAuth();

  const authUserId = loginData.data.id;

  const getMessages = async () => {
    const response = await MessageService.oldMessages(receiverId);

    const data = response?.data.data;

    console.log(data);

    if (data) {
      setMessages(data);
    }
  };

  useEffect(() => {
    getMessages();

    const channel = window.Echo.private(`users.${receiverId}.${authUserId}`);

    channel.listen("MessageReceived", (e: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, e]);
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
    <div className="d-flex flex-column w-100 p-5">
      <div className="d-flex flex-row">
        <h1 className="text-white">Hello</h1>
      </div>
      <div className="d-flex flex-column-reverse overflow-auto w-100">
        <div className="list-group list-group-flush border-bottom">
          {messages.map((message, index) => (
            <div
              className={`d-flex list-group-item list-group-item-action py-3 lh-sm bg-transparent ${
                message.receiver.id === authUserId
                  ? "justify-content-start"
                  : "justify-content-end"
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
