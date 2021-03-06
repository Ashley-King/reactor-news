
import React, { Component} from 'react'
import './App.css'

const DEFAULT_QUERY ='redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query='

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walker',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result){
    this.setState({result});
  }

  componentDidMount(){
    const {searchTerm} = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  }

  onDismiss(id){
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({list: updatedList});
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }

  render(){
    const {list, searchTerm} = this.state;
    return(
      <div className="page">
        <div className="interactions">
        <Search
          pattern={searchTerm}
          onChange={this.onSearchChange}
          >
            Search
          </Search>
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
        </div>
        
      </div>
    )
  }

}

const Search = ({onChange, pattern, children}) => (
  <form>
        <input 
          type="text"
          onChange={onChange}
          value={pattern}/>
          {children}
      </form>
)

const largeColumn = {
  width: '40%'
};

const midColumn = {
  width: '30%'
};

const smallColumn = {
  width: '10%'
};

const Table = ({list, pattern, onDismiss}) => (
  <div className='table'>
    {list.filter(isSearched(pattern)).map(item =>
          <div key={item.objectID} className='table-row'>
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className='button-inline'
              >
              Dismiss
              </Button>
            </span>
          </div>
          )}
  </div>
)



const Button = ({children, className='', onClick}) => (
  <button
    type='button'
    onClick={onClick}
    className={className}
  >
    {children}
  </button>
)

export default App;