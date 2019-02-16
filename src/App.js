import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Board from './Board';
import Mytooltip from './tooltip';

//判断胜利
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner:squares[a],winnerLine:lines[i]};
    }
  }
  return null;
}

class Game extends Component {
 constructor(props) {
    super(props);
    this.state = {//状态提升
      history: [{
        list: Array(9).fill(null),
      }],
      xIsNext: true,//下一步落子
      stepNumber:0,//当前step
      winnerList:null,//胜利列表
      winner:null,
      showTip:0,
    };
  }
  handleClick(index){//点击事件
    //const history = this.state.history;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let squares = current.list.slice();
    //debugger
    //避免重复点击
    if(squares[index]){
      return;
    }
    squares[index] = this.state.xIsNext?"X":"O";//轮流落子
    //判断是否有赢家
    let  winnerlist = calculateWinner(squares);
    if(winnerlist){
      if(!this.state.winnerList){//第一次胜利
        this.setState({
          history:history.concat([{list:squares}]),//保存历史记录
          stepNumber: history.length,//修改步数
          winnerList:winnerlist.winnerLine,
          xIsNext:winnerlist.winner=="X"?true:false,//赢的先下
          winner:winnerlist.winner,
        });
        this.changeShowTip(1);
      }
      return;
    }
    //squares[index] = this.state.xIsNext?"X":"O";//轮流落子
    this.setState({
      history:history.concat([{list:squares}]),//保存历史记录
      stepNumber: history.length,//修改步数
      xIsNext:!this.state.xIsNext,
      winnerList:null,
      winner:null,
    });
    this.changeShowTip();
  }
  jumpTo(step){//跳转步数
    if(step != this.state.stepNumber){
      this.setState({
        stepNumber: step,//修改步数
        winnerList:null,
        winner:null,
        xIsNext: (step % 2) ? false : true,//修改当前落子
      });
      this.changeShowTip();
    }
  }
  contiuteGame(){//继续游戏
    if(this.state.winner){
      let winlist = this.state.winnerList;

      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      let squares = current.list.slice();

      winlist.forEach((val,index)=>{
        squares[val] = null;
      })
      this.setState({
        winnerList:null,
        history:history.concat([{list:squares}]),//保存历史记录
        stepNumber: history.length,//修改步数
      });
      this.changeShowTip();
    }
  }
  //重新开始
  restart(){
    this.jumpTo(0);
    let history = this.state.history;
    history.splice(1,history.length - 1);
    this.setState({
      history:history,
    })
    this.changeShowTip();
  }
  changeShowTip(type){//是否显示弹出框
    let len = this.state.history.length;
    //debugger
    if(type == 1){//胜利
      setTimeout(()=>{
        this.setState({
          showTip:1
         })
      },800);
    }else if(len == 9){//平局
        setTimeout(()=>{
          this.setState({
            showTip:2
           })
        },800);
    }else{
      this.setState({
        showTip:0,
      })
    }
  }
  cancel(){
    this.setState({
        showTip:0,
    })
  }
  render(){
    const history = this.state.history;
    const current = history[this.state.stepNumber];//当前状态
    //const winner = calculateWinner(current.list);
    const winner = this.state.winner;
    //展示历史记录
    let moves = history.map((step,move)=>{
      let desc = move?'Move # ' + move :'Game start';
      let thisKey = 'Move'+move;
      return (
        <li key={thisKey} 
          className={move == this.state.stepNumber?'now_li':''}>
          <a onClick={()=>this.jumpTo(move)}>{desc}</a></li>//时间旅行
      );
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;//显示赢家
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');//显示下一步
    }

    return(
      <div className="game">
        <div className="game-content">
          <div className="game-board">
            <Board list={current.list}
              winnerList={this.state.winnerList}
              onClick={(i) => this.handleClick(i)}
             />
          </div>
          <div className="tooltip-box" style={{display:(this.state.showTip>0)?"block":"none"}}>
             <Mytooltip winner={this.state.winner}
               type={this.state.showTip}
               restart={()=> this.restart()}
               cancel={()=> this.cancel()}
               onClick={() => this.contiuteGame()}/>
          </div>
        </div>
        <div className="game-info">
           <div className="status">{status}</div>
           <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

export default Game;
