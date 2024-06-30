async function getData() {
  const res = await fetch('http://localhost:3001/board')
  return res.json()
}

export default async function Board() {
  const { board }: { board: string[][] } = await getData();

  return (
    <div>
      <h1>TicTacToe</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '10px', justifyContent: 'center' }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => {}}
              style={{
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid black',
                fontSize: '24px',
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    </div>
  );
};