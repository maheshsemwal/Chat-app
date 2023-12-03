import './App.css';
import {Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <div className="bg-slate-900 h-screen App">
      <Route path="/" component={HomePage} exact/>
      <Route path="/chats" component={ChatPage} />
    </div>
  )
}