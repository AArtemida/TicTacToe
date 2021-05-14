import React, { Component } from 'react';
import './css/App.css';
import getWinnerList from './utils/winners';
import getSquareBoardsList from './utils/getBoardsList';

import Board from './components/Board';
import Mytooltip from './components/tooltip';

const squareBoardsWidth = 10;
let squareBoardsList = getSquareBoardsList(squareBoardsWidth);
const squareBoardTotal = squareBoardsWidth * squareBoardsWidth;

//判断胜利
function calculateWinner(squares) {
  let winLines = getWinnerList(squareBoardsWidth);

  for (let i = 0; i < winLines.length; i++) {
    const [a] = winLines[i];
    let wlist = winLines[i];
    let equalStatus = false;
    let prev;
    for (let k = 0; k < wlist.length; k++) {
      let nowIndex = wlist[k];
      if (typeof prev != "undefined") {
        if (prev && prev === squares[nowIndex]) {
          equalStatus = true;
        } else {
          equalStatus = false;
          break;
        }
      } else {
        prev = squares[nowIndex];
      }
    }
    if (equalStatus) {
      return { winner: squares[a], winnerLine: wlist };
    }
  }
  return null;
}

class Game extends Component {
 constructor(props) {
    super(props);
    this.state = {//状态提升
      history: [{
        list: Array(squareBoardTotal).fill(null),
      }],
      xIsNext: true,//下一步落子
      stepNumber:0,//当前step
      winnerList:null,//胜利列表
      winner:null,
      showTip:0,
    };
  }
  get xSteps() {
    const history = this.state.history;
    const current = history[this.state.stepNumber] || {};
    let squares = current.list || [];
    let res = []
    squares.forEach((chess,pos) => {
      if(chess === 'X') {
        res.push(pos)
      }
    })
    return res
  }
  get oSteps() {
    const history = this.state.history;
    const current = history[this.state.stepNumber] || {};
    let squares = current.list || [];
    let res = []
    squares.forEach((chess,pos) => {
      if(chess === 'O') {
        res.push(pos)
      }
    })
    return res
  }
  componentDidUpdate () {
    if(!this.state.xIsNext) {
      this.computer();
    }
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
  //电脑
  computer() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let squares = current.list;
    let winLines = getWinnerList(squareBoardsWidth);

    if(this.oSteps.length) {
      let oCounts = {}, xCounts = {}, emptyPos = {}
      for (let i = 0; i < winLines.length; i++) {
        let wlist = winLines[i];
        oCounts[i] = 0
        xCounts[i] = 0
        for (let k = 0; k < wlist.length; k++) {
          let pos = wlist[k]
          if(this.oSteps.indexOf(pos) > -1) {
            oCounts[i]++
          }else if(this.xSteps.indexOf(pos) > -1) {
            xCounts[i]++
          }else {
            if(!emptyPos[i]){
              emptyPos[i] = []
            }
            emptyPos[i].push(pos)
          }
        //   let nowIndex = wlist[k];
        //   if(!squares[nowIndex]) {
        //     this.handleClick(nowIndex);
        //     break;
        //   }
        }
      }
      let oCountsCopy = {}, xCountsCopy = {}
      for(let index in emptyPos) {
        oCountsCopy[index] = oCounts[index]
        xCountsCopy[index] = xCounts[index]
      }
      let oMax = Math.max.apply(null, Object.values(oCountsCopy)),
          xMax = Math.max.apply(null, Object.values(xCountsCopy))
      if(xMax > oMax && xMax > 2) {
        for(let index in xCountsCopy) {
          if(xCountsCopy[index] === xMax) {
            let emptylist = emptyPos[index]
            let nowPos = emptylist[0]
            this.handleClick(nowPos)
          }
        }
      }else {
        for(let index in oCountsCopy) {
          if(oCountsCopy[index] === oMax) {
            let emptylist = emptyPos[index]
            let nowPos = emptylist[0]
            this.handleClick(nowPos)
          }
        }
      }
    }else {//首次
      let xPos = this.xSteps[0]
      let around = [xPos + 1, xPos - 1, xPos - squareBoardsWidth, xPos + squareBoardsWidth]
      around = around.filter(pos => pos > 0 && pos < squareBoardTotal && !squares[pos])
      let index = Math.floor((Math.random()*around.length))
      this.handleClick(around[index])
    }
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
    let history = this.state.history;
    let len = history.length;
    let current = history[len - 1] ? history[len - 1].list : [];
    let allClicked = current
      .map((item) => {
        return item ? 1 : 0;
      })
      .reduce((total, num) => {
        return num + total;
      });
    //debugger
    if(type == 1){//胜利
      setTimeout(()=>{
        this.setState({
          showTip:1
         })
      },200);
    }else if(allClicked == squareBoardTotal - 1){//平局
        setTimeout(()=>{
          this.setState({
            showTip:2
           })
        },200);
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
              boardsList={squareBoardsList}
              onClick={(i) => this.handleClick(i)}
             />
          </div>
          <div className="tooltip-box" style={{display:(this.state.showTip>0)?"flex":"none"}}>
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
