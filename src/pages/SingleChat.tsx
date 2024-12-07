import { SingleChatService } from "../common/services/SingleChatService";
import { useParams } from "react-router-dom";
import Chat from "../components/Chat";

const SingleChat = () => {
  const { receiverId } = useParams();

  return (
    <Chat
      entityId={receiverId}
      entityService={SingleChatService}
      echoChannel={(id: string, authUserId: number) =>
        `users.${id}.${authUserId}`
      }
      entityLabel="name"
    />
  );
};

export default SingleChat;
