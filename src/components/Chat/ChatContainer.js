import ChatView from "./ChatView";
import {listenForNewChat, listenForNewChatJoin} from "../../socketClient";
import {useState} from "react";
import TextInput from "./TextInput";

import styles from './ChatContainer.module.css'
export const MESSAGE_TYPES = {
    message: 'message',
    newChatJoin: 'newChatJoin'
}

export default function ChatContainer() {
    const [messages, setMessages] = useState([]);
    listenForNewChat.addListener(handleNewChat);
    listenForNewChatJoin.addListener(handleNewChatJoin);
    function handleNewChat(newMessage) {
        setMessages([...messages, {
            type: 'message',
            message: newMessage
        }]);
    }
    function handleNewChatJoin({name}) {
        setMessages([...messages, {
            type: 'newChatJoin',
            message: `${name} Has Joined the Game`
        }]);
    }

    return (
        <div className={styles.chatContainer}>
            <ChatView messagesList={messages} />

            <TextInput />
        </div>
    )
}
