import React from 'react';

class RandomNumber extends React.Component {

  _update() {
    let value = Math.round(Math.random()*100);
    // props 로 받은 함수를 실행
    this.props.onUpdate(value);
  }

  constructor(props) {
    super(props);
    // _update 메소드에서 this.props 에 접근 할 수 있도록 binding
    this._update = this._update.bind(this);
  }

  render() {
    return (
        <div>
          <h1>RANDOM NUMBER: {this.props.number }</h1>
          <button onClick={this._update}>Randomize</button>
        </div>
    );
  }

}

export default RandomNumber;
