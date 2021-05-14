//格子数据
export default function getSquareBoardsList(width) {
  let squareBoardsList = [];
  for(let i = 0; i < width; i++) {
    let arr = []
    for(let j = 0; j < width; j++) {
       arr.push(i*width + j)
    }
    squareBoardsList.push(arr)
  }
  return squareBoardsList
}