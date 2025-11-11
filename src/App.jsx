  import Card from './Card.jsx'
  import info from './info.jsx'
  
  function App() {


    return (
          <>
            <h1 className="h1">La tunisie est fière de ses champions</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
              {info.map((champion) => (<Card key={champion.id} champion={champion} />
))}
            </div>
          </>
    )
  }

  export default App;
