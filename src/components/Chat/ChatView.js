import classNames from "classnames";
import styles from './ChatView.module.css';
import {MESSAGE_TYPES} from "./ChatContainer";
import GradientBorderWrapper from "../common/GradientBorderWrapper/GradientBorderWrapper";

export default function ChatView({ messagesList }) {
    return (
        <div>
            <GradientBorderWrapper>
                <div className={styles.messagesList}>
                    {messagesList.map((message, idx) => {
                        const className = classNames({
                            [styles.message]: true,
                            [styles.messageHasJoined] : message.type === MESSAGE_TYPES.newChatJoin
                        })
                        return <p className={className} key={`${message.message} - ${idx}`}>{message.message}</p>
                    })}
                </div>
            </GradientBorderWrapper>
        </div>
    )
}
