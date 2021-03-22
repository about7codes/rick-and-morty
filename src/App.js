import React from 'react';
import axios from 'axios';
import './App.css';

const { useState, useEffect } = React;

const ThemeContext = React.createContext()

// Main component -------------------------------
const Main = (props) => {
  
  const getData = (page = 1, name = 'a') => {
    setLoading(true);
    
    axios.get(`https://rickandmortyapi.com/api/character/?page=${page}&name=${encodeURIComponent(name)}`)
    .then(response => {
      console.clear()
      console.log(response.data);
      
      setChar(response.data.results);
      setTotalPage(response.data.info.pages)
      setCurrentPage(page);
      setLoading(false);
    }, error => {
      setChar([]);
      setLoading(false);
    })
    
  }
  
  const [char, setChar] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [word, setWord] = useState('a')
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getData()
  }, []);
  
  const storeInputValue = (value) => {
    console.log(value);
    setWord(value);
  }
  
  const handleNext = () => {
    
    setCurrentPage(prevPage => prevPage + 1);
    getData(currentPage+1, word);
    console.log(currentPage);
    
    // Scroll to top after clicking next/back
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  
  const handleBack = () => {
    
    setCurrentPage(prevPage => prevPage - 1);
    getData(currentPage-1, word);
    console.log(currentPage);
    
    // Scroll to top after clicking next/back
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  
  const genCards = () => {
    let allCards = [];
    char.map((card, index) => {
      allCards.push(<Card {...card} key={index} />);
    });
    
    return allCards;
  }
  
  let allCards = genCards();
  
  return (
    <div className='main'>
      <div className='head'>
        <img src='https://occ-0-1190-2774.1.nflxso.net/dnm/api/v6/LmEnxtiAuzezXBjYXPuDgfZ4zZQ/AAAABVK-867iNzC3GeSiDQJ7jasFpdN4ySy2Of17S2KxaxbOOtsqax_k_ldd_f5TiDeulU3_lyJmIjtBgPVKLnE1cUK-kRk9yZsO4MXA.png?r=47e' />
      </div>
      <Search 
          getInputValue={storeInputValue} 
          getSubmit={() => getData(1, word)}
          sendEnter={() => getData(1, word)}
          />
      
      <div className='cards'>
        
        {loading ? <Loader /> : 
        (allCards.length === 0 ? <div className='error'>No one found...<i class="far fa-grin-beam-sweat"></i></div> : allCards)}
      </div>
      
      <div className='btns'>
        {currentPage === 1 ? null : <button className='btn back'onClick={handleBack}>Back</button>}
        {currentPage === totalPage ? null : <button className='btn next' onClick={handleNext}>Next </button>}
      </div>
    </div>
  )
}


// Loader component -------------------------------
const Loader = props => {
  
  return (
     <div className='loader'>
      Loading...
      <i class="fas fa-sync-alt fa-spin"></i>
    </div>
  )
}

// Search component -------------------------
const Search = (props) => {

  let sendValue = (e) => {
    props.getInputValue(e.target.value)
  }
  
  const handleSubmit = () => {
    props.getSubmit();
  }
  
  const handleKeyDown = (e) => {
    if(e.key === 'Enter'){
      props.sendEnter();
      console.log('Enter');
    }
  }
  
  return(
    <div className='search'>
      <div className='search-box'>
        <input type='text' onChange={sendValue} onKeyDown={handleKeyDown} placeholder='Enter word...' />
        <button onClick={handleSubmit} ><i class="fas fa-search"></i></button>
      </div>
    </div>
  )
}

// Card component -------------------------------

const Card = props => {
  
  const [showPop, setShowPop] = useState(false)
  
  const handleClick = () => {
    if(showPop){
      setShowPop(false);
    }else{
      setShowPop(true);
    }
    
  }
  
  return (
    <div className='card' data-id={props.id}>
      <img src={props.image || 'https://via.placeholder.com/300x300/111217/FFFFFF/?text=Loading...'} 
        onClick={handleClick}
        alt={props.name} 
        data-id={props.id} />
      
      { showPop &&
        <div className='popup'>
        <article className='popup-content'>
          <i className="popup-close fas fa-times" onClick={handleClick}></i>
          <div className='popup-a'>
            <img src={props.image || 'https://via.placeholder.com/300x300/111217/FFFFFF/?text=Loading...'} 
              alt={props.name} />
          </div>
          <div className='popup-b'>
            <h2>{props.name}</h2>
            
            <div className='popup-details'>
              <span>Gender: </span><span>{props.gender}</span>
            </div>
            <div className='popup-details'>
              <span>Species: </span><span>{props.species}</span>
            </div>
            <div className='popup-details'>
              <span>Status: </span><span>{props.status}</span>
            </div>
            <div className='popup-details'>
              <span>Origin: </span><span>{props.origin ? props.origin.name : '-'}</span>
            </div>
            <div className='popup-details'>
              <span>Location: </span><span>{props.location ? props.location.name : '-'}</span>
            </div>
            
          </div>
        </article>
      </div>
      }
    </div>
  )
}

export default Main;

// ReactDOM.render(<Main />, document.getElementById('app'));