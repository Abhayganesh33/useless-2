const initialPosition = [
  ["wr", "wk", "wb", "wq", "wm", "wb", "wk", "wr"],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["wr", "wk", "wb", "wq", "wm", "wb", "wk", "wr"]
];

// Mapping piece codes to their hosted image URLs
const pieceImages = {
  wp: "https://i.ibb.co/HTqk2Lws/pawn.png",
  wb: "https://i.ibb.co/yBGyPd1h/bishop.png",
  wr: "https://i.ibb.co/2YvTYH57/rook.png",
    wk: "https://i.ibb.co/cShHDVHL/kuthira.png",
      wm: " https://i.ibb.co/TqRVhKrV/king.png",
        wq: "https://i.ibb.co/k2TbvTnd/queen.png"
  
};

window.onload = function () {
  const board = document.getElementById("chessboard");
  board.innerHTML = ""; // Clear any old content

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.className = "square " + ((row + col) % 2 === 0 ? "white" : "black");

      // Check if there is a piece at this position in the initialPosition array
      const pieceCode = initialPosition[row][col];
      if (pieceCode !== "") {
        const img = document.createElement("img");
        img.src = pieceImages[pieceCode];
        img.alt = pieceCode;
        img.className = "chess-piece";
        square.appendChild(img);
      }

      board.appendChild(square);
    }
  }
};


