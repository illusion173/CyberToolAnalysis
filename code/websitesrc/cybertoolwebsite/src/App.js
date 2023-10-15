import logo from './logo.svg';
import './App.css';
import {
  Star1 
 } from './ui-components';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          "My syndrome may be down but my hopes are up" -Jeremiah Webb
        </p>
        <Star1 />
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

