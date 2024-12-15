import { AxiosResponse } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../common/context/AuthProvider";
import { IGroup } from "../common/models/Group";
import { IMessage } from "../common/models/Message";
import { IUser } from "../common/models/User";
import { MessageStatus } from "../common/enums/MessageStatus";
import {
  decryptAllMessages,
  decryptMessagePayload,
  EncryptionService,
  encryptMessagePayload,
} from "../common/services/EncryptionService";

interface MessageEvent {
  message: IMessage;
}

interface ChatProps {
  entityId: string;
  entityService: {
    oldMessages: (id: string) => Promise<AxiosResponse<any, any>>;
    create: (data: any) => Promise<AxiosResponse<any, any>>;
  };
  echoChannel: (id: string, authUserId?: number) => string;
  entityLabel: string;
  entityKeyName: string;
}

const Chat = ({
  entityId,
  entityService,
  echoChannel,
  entityKeyName,
}: ChatProps) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [payload, setPayload] = useState<string>("");
  const [entity, setEntity] = useState<IUser | IGroup>();
  const { authUser } = useAuth();

  const authUserId = authUser.id;

  console.log(authUser);
  const receiverPublicKey = entity?.public_key;

  const getMessages = async () => {
    const response = await entityService.oldMessages(entityId);

    const data = response?.data.data;

    if (data) {
      setEntity(data.receiver ?? data.group);

      setMessages(await decryptAllMessages(data.messages, authUserId));
    }
  };

  useEffect(() => {
    getMessages();

    const channel = window.Echo.private(echoChannel(entityId, authUserId));

    channel.listen("MessageReceived", async (e: MessageEvent) => {
      const receivedMessage = e.message;

      receivedMessage.payload = await decryptMessagePayload(
        receivedMessage,
        authUserId
      );

      setMessages((prevMessages) => [...prevMessages, e.message]);
    });

    return () => {
      channel.stopListening("MessageReceived");
    };
  }, [entityId]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const sentMessage = {
      id: -1,
      sender: {
        id: authUserId,
        name: authUser.name,
      },
      payload: payload,
      created_at: new Date().toISOString(),
      status: MessageStatus.Sending,
    };

    setMessages((prevMessages) => [...prevMessages, sentMessage]);

    try {
      const aesKey = await EncryptionService.generateAESKey();

      const encryptedMessage = await encryptMessagePayload(
        payload,
        aesKey,
        receiverPublicKey
      );

      const response = await entityService.create({
        [entityKeyName]: entityId,
        ...encryptedMessage,
      });

      response.data.payload = await decryptMessagePayload(
        response?.data,
        authUserId
      );

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message === sentMessage ? response.data : message
        )
      );
    } catch (error) {
      console.error(error);
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message === sentMessage) {
            message.status = MessageStatus.Failed;
          }

          return message;
        })
      );
    }

    setPayload("");
  };

  return (
    <div className="d-flex flex-column justify-content-end w-100">
      <div
        className="d-flex border-bottom border-secondary flex-row mb-auto align-content-ceter"
        style={{ backgroundColor: "#04051B" }}
      >
        <h3 className="text-white p-3" style={{ fontSize: "2.3rem" }}>
          {entity?.name}
        </h3>
      </div>
      <div className="d-flex flex-column-reverse overflow-auto w-100 p-5">
        <ul className="list-group list-group-flush border-0">
          {messages.map((message, index) => (
            <li
              className={`d-flex list-group-item list-group-item-action py-3 lh-sm bg-transparent border-0 ${
                message.sender.id === authUserId
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
              key={index}
            >
              <div
                className={`card ${
                  message.sender.id === authUserId
                    ? "sender-card"
                    : "receiver-card"
                }`}
                style={{ width: "18rem" }}
              >
                <div className="card-body">
                  <h3 className="card-title">{message.sender.name}</h3>
                  <p className="card-text">{message.payload}</p>
                  {message?.status === MessageStatus.Sending && (
                    <p>Sending...</p>
                  )}
                  {message?.status === MessageStatus.Failed && <p>Failed</p>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-5">
        <form onSubmit={(e) => submit(e)}>
          <input
            className="search form-control form-control-lg text-bg-dark border border-0"
            placeholder="Write a message"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
