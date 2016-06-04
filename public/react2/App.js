import React from 'react';  // require('..')
import ReactDOM from 'react-dom';
import Header from './Header';
import Content from './Content';

class App extends React.Component {
  render() {

    let text = "Dev-Server";

    let pStyle = {
        color: 'aqua',
        backgroundColor: 'black'
    };

    return  (
        <div>
            <h1> Hello Velopert </h1>
            <h2> Welcome to {text}</h2>
            <button onClick= {this._sayHey}>Click Me</button>
            <p style = {pStyle}>{1 == 1 ? 'True' : 'False'}</p>
            <Header />
            <Content />
        </div>
    );
  }
}


export default App;  // module.export = App
