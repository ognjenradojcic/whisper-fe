import { AxiosResponse } from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../common/context/AuthProvider";
import { IGroup } from "../common/models/Group";
import { IMessage } from "../common/models/Message";
import { IUser } from "../common/models/User";
import { MessageStatus } from "../common/enums/MessageStatus";
import {
  decryptAllMessages,
  decryptMessagePayload,
  encryptMessagePayload,
} from "../common/services/EncryptionService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "./Loading";
import { ChatResponse } from "../common/models/ChatResponse";
import { group } from "console";

interface MessageEvent {
  message: IMessage;
}

interface ChatProps {
  isPrivateChat: boolean;
  entityId: string;
  entityService: {
    oldMessages: (id: string) => Promise<ChatResponse>;
    create: (data: any) => Promise<IMessage>;
  };
  echoChannel: (id: string, authUserId?: number) => string;
  entityLabel: string;
  entityKeyName: string;
}

const Chat = ({
  isPrivateChat,
  entityId,
  entityService,
  echoChannel,
  entityKeyName,
}: ChatProps) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [payload, setPayload] = useState<string>("");
  const [receiver, setReceiver] = useState<IUser | IGroup>();
  const groupAesKey = useRef<string>("");
  const { authUser } = useAuth();

  const authUserId = authUser.id;
  const receiverPublicKey = receiver?.public_key;

  const { isPending, isError, data } = useQuery({
    queryKey: ["messages", entityId],
    queryFn: async () => {
      const response = await entityService.oldMessages(entityId);

      groupAesKey.current = response.group_aes_key;

      const decrpytedMessages = await decryptAllMessages(
        response.messages,
        authUserId,
        isPrivateChat,
        response.group_aes_key
      );

      return {
        receiver: response.receiver,
        messages: decrpytedMessages,
      };
    },
  });

  const { status, error, mutate } = useMutation({
    mutationFn: async (sentMessage: IMessage) => {
      const encryptedMessage = await encryptMessagePayload(
        sentMessage.payload,
        groupAesKey.current,
        receiverPublicKey,
        isPrivateChat
      );

      const response = await entityService.create({
        [entityKeyName]: entityId,
        ...encryptedMessage,
      });

      response.payload = await decryptMessagePayload(
        response,
        authUserId,
        isPrivateChat,
        groupAesKey.current
      );

      return response;
    },
    onMutate: async (sentMessage: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
    },
    onSuccess: (data, sentMessage) => {
      console.log("Sent: ", sentMessage);
      console.log("Data: ", data);

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message === sentMessage ? data : message
        )
      );
    },
    onError: (error, sentMessage) => {
      console.error(error);
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message === sentMessage) {
            message.status = MessageStatus.Failed;
          }

          return message;
        })
      );
    },
  });

  useEffect(() => {
    setMessages(data?.messages);
    setReceiver(data?.receiver);
  }, [data]);

  useEffect(() => {
    const channel = window.Echo.private(echoChannel(entityId, authUserId));

    channel.listen("MessageReceived", async (e: MessageEvent) => {
      const receivedMessage = e.message;

      receivedMessage.payload = await decryptMessagePayload(
        receivedMessage,
        authUserId,
        isPrivateChat,
        groupAesKey.current
      );

      setMessages((prevMessages) => [...prevMessages, e.message]);
    });

    return () => {
      channel.stopListening("MessageReceived");
    };
  }, [entityId]);

  if (isPending || isError) {
    return <Loading />;
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const sentMessage = {
      id: -1,
      sender: {
        id: authUserId,
        role_id: authUser.role_id,
        name: authUser.name,
      },
      payload: payload,
      created_at: new Date().toISOString(),
      status: MessageStatus.Sending,
    };

    mutate(sentMessage);

    setPayload("");
  };

  return (
    <div className="d-flex flex-column justify-content-end w-100">
      <div
        className="d-flex border-bottom border-secondary flex-row mb-auto align-content-ceter"
        style={{ backgroundColor: "#04051B" }}
      >
        <h3 className="text-white p-3" style={{ fontSize: "2.3rem" }}>
          {receiver?.name}
        </h3>
      </div>
      <div className="d-flex flex-column-reverse overflow-auto w-100 p-5">
        <ul className="list-group list-group-flush border-0">
          {messages?.map((message, index) => (
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
