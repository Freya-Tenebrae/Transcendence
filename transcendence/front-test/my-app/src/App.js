import logo from './logo.svg';
import home from './fonts/home.svg';
import './App.css';

export function Header () {
  return (
    <div className="Header">
      <img src={home} className="icons" alt="home" />
      <h1>Home</h1>
    </div>
  );
}

export function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
        Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
