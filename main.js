const size = 3;
const goal = "123456780";
let state = goal;

const board = document.getElementById("board");
const message = document.getElementById("message");

/*Render the board */
function render() {
    board.innerHTML = "";

[...state].forEach((v, i) => {
    const tile = document.createElement("div");
    tile.className = "tile";

    if (v === "0") {
    tile.classList.add("empty");
    } else {
    const index = parseInt(v) - 1;
    const x = index % size;
    const y = Math.floor(index / size);
      tile.style.backgroundPosition = `-${x * 100}px -${y * 100}px`;
    tile.onclick = () => move(i);
    }
    board.appendChild(tile);
  });
}

/* player move */
function move(index) {
  const zero = state.indexOf("0");
  const valid = [
    zero - 1, zero + 1,
    zero - size, zero + size
  ].filter(i => {
    if (i < 0 || i >= 9) return false;
    if (Math.abs(zero - i) === 1) {
      return Math.floor(zero / size) === Math.floor(i / size);
    }
    return true;
  });

  if (valid.includes(index)) {
    let arr = [...state];
    [arr[zero], arr[index]] = [arr[index], arr[zero]];
    state = arr.join("");
    render();
    checkWin();
  }
}
/*check if current state is the goal*/
function checkWin() {
    if (state === goal) {
        message.innerText = " Solved Successfully!";
        message.style.backgroundColor = "green";
        message.style.color = "white";
        message.style.padding = "10px";
        message.style.width = "300px";
        message.style.margin = "20px auto";
    }
}

/* Shuffle */
function shuffle() {
  let arr = [...goal];
  for (let i = 0; i < 40; i++) {
    const zero = arr.indexOf("0");
    const moves = [
      zero - 1, zero + 1,
      zero - size, zero + size
    ].filter(i => i >= 0 && i < 9);

    const m = moves[Math.floor(Math.random() * moves.length)];
    [arr[zero], arr[m]] = [arr[m], arr[zero]];
  }
  state = arr.join("");
  render();
}

/*   A* Heuristic: Manhattan Distance    */
function manhattan(s) {
  let d = 0;
  for (let i = 0; i < s.length; i++) { 
    if (s[i] === "0") continue;
    const v = parseInt(s[i]) - 1;
    const x1 = Math.floor(i / size), y1 = i % size;
    const x2 = Math.floor(v / size), y2 = v % size;
    d += Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }
  return d;
}

function solveAStar() {
  let open = [{
    state: state,
    g: 0,
    h: manhattan(state),
    path: [state]
  }];

  const visited = new Set();

  while (open.length) {
    open.sort((a, b) => (a.g + a.h) - (b.g + b.h));
    const current = open.shift();

    if (current.state === goal) {
      animate(current.path);
      return;
    }

    visited.add(current.state);
    const zero = current.state.indexOf("0");

    const potentialMoves = [
    zero - size,
    zero + size, 
    zero - 1,    
    zero + 1     
    ];


  const moves = potentialMoves.filter(m => {
    if (m < 0 || m >= 9) return false;
    if (Math.abs(zero - m) === 1) {
      return Math.floor(zero / size) === Math.floor(m / size);
    }
    return true;
  });
    for (let m of moves) {
        let arr = [...current.state];
        [arr[zero], arr[m]] = [arr[m], arr[zero]];
        const next = arr.join("");

        if (!visited.has(next)) {
          open.push({
            state: next,
            g: current.g + 1,
            h: manhattan(next),
            path: [...current.path, next]
          });
        }
      }
    }
}

/* Animation  */
function animate(path) {
  let i = 0;
  const interval = setInterval(() => {
    state = path[i];
    render();
    i++;
    if (i >= path.length) {
      clearInterval(interval)
      checkWin();
    };
  }, 300);
}

render();
