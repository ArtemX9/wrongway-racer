import GameView from "./components/Game/GameView";
import ChatContainer from "./components/Chat/ChatContainer";
import StatisticsContainer from "./components/Statistics/StatisticsContainer";
import PlayersContainer from "./components/Players/PlayersContainer";
import styles from './App.module.css';

function App() {
    return (
        <div className={styles.App}>
          <GameView/>
          <div className={styles.bottom}>
            <StatisticsContainer />
            <ChatContainer />
            <PlayersContainer />
          </div>
        </div>
  );
}

export default App;
