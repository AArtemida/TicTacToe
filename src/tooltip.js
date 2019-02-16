import React, { Component } from 'react';

class Mytooltip extends Component {
  render(){//提示框
    return (
      <div className="tooltip">
        <p className="tip" style={{display:(this.props.type==1)?"block":"none"}}>
          <span>{this.props.winner}</span> 胜利，是否继续游戏？
        </p>
        <p className="tip" style={{display:(this.props.type==2)?"block":"none"}}>
          平局，是否重新开始游戏？
        </p>
        <p className="buttonlist">
          <button className="contiute" onClick={() => this.props.onClick()}
            style={{display:(this.props.type==1)?"inline-block":"none"}}>继续游戏</button>
          <button onClick={() => this.props.restart()}>重新开始</button>
          <button onClick={()=> this.props.cancel()}
            style={{display:(this.props.type==2)?"inline-block":"none"}}>取消</button>
        </p>
      </div>
    )
  }
}
export default Mytooltip;