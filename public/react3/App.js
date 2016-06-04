import React from 'react';  // require('..')
import ReactDOM from 'react-dom';
import Header from './Header';
import Content from './Content';
import RandomNumber from './RandomNumber';


class App extends React.Component {

  constructor(props) {
    super(props);
    // state 초기화
    this.state = {
      value: Math.round(Math.random()*100)
    };
    // _updateValue() 메소드에서 this.setState 에 접근 할 수 있도록 bind
    this._updateValue = this._updateValue.bind(this);
  }

  _updateValue(randomValue) {
    this.setState({
      value: randomValue
    });
  }

  render() {
    return  (
        <div>
            <Header title={this.props.headerTitle}/>
            <Content title={this.props.contentTitle}
                     body={this.props.contentBody}/>
                   <RandomNumber number={this.state.value}
                                 onUpdate={this._updateValue} />
        </div>
    );
  }
}

// 기본값
App.defaultProps = {
    headerTitle: 'Default header',
    contentTitle: 'Default contentTitle',
    contentBody: 'Default contentBody'
};

// 타입 체크
App.propTypes = {
    headerTitle: React.PropTypes.string,
    contentTitle: React.PropTypes.string,
    contentBody: React.PropTypes.string.isRequired
};

ReactDOM.render(<App headerTitle="Welcom!"
                     contentTitle="Stranger"
                     contentBody="Welcom to example app"/>,
                   document.getElementById('root'));
