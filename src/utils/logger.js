export class Logger {
    isEnabled = true;

    log(...data) {
        if (!this.isEnabled) {
            return;
        }

        console.debug(...data);
    }
}
