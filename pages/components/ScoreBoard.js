const ScoreBoard=({score})=>{
    return(<div className="score-board" style={{marginLeft:"20vw",marginTop:"30vh",border:"2px solid black",borderRadius:"5px",width:"20%",height:"20%",padding:"3vh"}}  >
      <h1>Your Score:</h1>
      <h1>{score}</h1>

      </div>)
}

export default ScoreBoard
