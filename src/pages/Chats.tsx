import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../common/models/User";
import { UserService } from "../common/services/UserService";
import MainList from "../components/MainList";

const Chats = () => {
  return (
    <MainList headerLabel="Chats" entityService={UserService} route="chats" />
  );
};

export default Chats;
