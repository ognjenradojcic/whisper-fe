import { useParams } from "react-router-dom";
import { GroupChatService } from "../common/services/GroupChatService copy";
import Chat from "../components/Chat";

const GroupChat = () => {
  const { groupId } = useParams();

  return (
    <Chat
      entityId={groupId}
      entityService={GroupChatService}
      echoChannel={(id: string, authUserId: number) =>
        `groups.${id}.${authUserId}`
      }
      entityLabel="name"
    />
  );
};

export default GroupChat;
