import React, { Component } from 'react';

class Board extends Component {
  renderSquare(i) {
    let newkey = 'square'+i;
    return (<Square key={newkey}
              value={this.props.list[i]}
              index={i}
              winnerlist={this.props.winnerList}
              onClick={() => this.props.onClick(i)}/>);
  }

  render(){
     const numbers = [[0,1, 2], [3, 4, 5],[6,7,8]];
     let _this = this;
     let boards = numbers.map((item,index)=>{
       let squareList = item.map((val)=>{//循环一个
         return _this.renderSquare(val);
       })
       let newkey = 'boardrow'+index;
       return (
         <div className="board-row" key={newkey}>{squareList}</div>//循环一行
       );
     })
     return(
       <div>
         {boards}
       </div>
     )
   }
}

//函数定义组件
function Square(props) {
  return (
    <button key={props.index} className={`square ${props.value === "X" ? "square_x" : (props.value === "O" ? "square_o" : "square_empty")}        ${props.winnerlist&&props.winnerlist.indexOf(props.index)>-1?"square_win":""}`} 
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Board;