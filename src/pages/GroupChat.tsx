import { useParams } from "react-router-dom";
import { GroupChatService } from "../common/services/GroupChatService";
import Chat from "../components/Chat";

const GroupChat = () => {
  const { groupId } = useParams();

  return (
    <Chat
      entityId={groupId}
      entityService={GroupChatService}
      echoChannel={(id: string) => `groups.${id}`}
      entityLabel="name"
      entityKeyName="group_id"
    />
  );
};

export default GroupChat;
