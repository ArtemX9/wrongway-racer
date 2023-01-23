import GradientBorderWrapper from "../common/GradientBorderWrapper/GradientBorderWrapper";
import styles from './TextInput.module.css';
export default function TextInput () {
    return (
        <div className={styles.textInputContainer}>
            <div>
                <GradientBorderWrapper>
                    <input className={styles.textInput} placeholder="|..."/>
                </GradientBorderWrapper>
            </div>

            <div className={styles.sendButtonOuter}>
                <div className={styles.sendButtonInner}>
                    <div className={styles.sendButtonText}>
                        Send
                    </div>
                </div>
            </div>
        </div>
    )
}
