//获胜组合
export default function getWinnerList(squareBoardsWidth) {
  let winLines = [];
  //横向
  for(let i = 0; i < squareBoardsWidth; i++) {
    for(let j = 0; j < squareBoardsWidth-4; j++) {
      let arr = [];
      for(let k = 0; k < 5; k ++) {
        arr.push(i*squareBoardsWidth + j + k);
      }
      winLines.push(arr);
    }
  }
  //纵向
  for(let i = 0; i < squareBoardsWidth; i++) {
    for(let j = 0; j < squareBoardsWidth-4; j++) {
      let arr = [];
      for(let k = 0; k < 5; k ++) {
        arr.push(i + (j+k)*squareBoardsWidth);
      }
      winLines.push(arr);
    }
  }
  //正斜向
  for(let i = 0; i < squareBoardsWidth-4; i++) {
    for(let j = 0; j < squareBoardsWidth-4; j++) {
      let arr = [];
      for(let k = 0; k < 5; k ++) {
        arr.push(i*squareBoardsWidth + j + k*(squareBoardsWidth+1));
      }
      winLines.push(arr);
    }
  }
  //反斜向
  for(let i = 4; i < squareBoardsWidth; i++) {
    for(let j = 0; j < squareBoardsWidth-4; j++) {
      let arr = [];
      for(let k = 0; k < 5; k ++) {
        arr.push(i + j*squareBoardsWidth + k*(squareBoardsWidth-1));
      }
      winLines.push(arr);
    }
  }
  return winLines;
}