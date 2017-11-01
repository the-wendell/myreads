import React from 'react'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Shelf from './Shelf.js'
import Header from './Header.js'
import AddSearchButton from './AddSearchButton.js'
import BookSearch from './BookSearch.js'

class BooksApp extends React.Component {
  state = {
    currentBookList: [],
    books: [],
    shelves: [
      {name: "Currently Reading", camleCase: 'currentlyReading'},
      {name: "Want To Read", camleCase: 'wantToRead'},
      {name: "Read", camleCase: 'read'}
    ]
  }

  loadBookList() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books: books, currentBookList: books })
    })
  }

  componentDidMount() {
    this.loadBookList()
  }

  changeShelf(book, shelf) {
    BooksAPI.update(book, shelf).then(() => this.loadBookList())
  }

  setCurrentBookList(books) {
    this.setState({ currentBookList: books })
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/" render={ () =>(
          <div className="list-books" onChange={this.loadBookList()}>
            <Header/>
            <div className="list-books-content">
              <div>
                {this.state.shelves.map( (shelf, index) => (
                  <Shelf
                    key={index}
                    books={this.state.books.filter(book => book.shelf === shelf.camleCase)}
                    shelfName={shelf.name}
                    changeShelf={(book, shelf) => this.changeShelf(book, shelf)}
                  />
                ))}
              </div>
            </div>
            <AddSearchButton/>
          </div>
        )}/>
        <Route path="/search" render={ ({history}) => (
          <BookSearch
            myBooks={this.state.books}
            changeShelf={(book, shelf) => this.changeShelf(book, shelf)}
            setCurrentBookList={books => this.setCurrentBookList(books)}
            currentBookList={this.state.currentBookList}
          />
        )}/>
        {this.state.currentBookList.map(book => (
          <Route exact path={`/${book.id}-info`} key={book.id} render={({history}) => (
            <div>
              <p>HELLO EVERYONE!!</p>
              <div>
                <button onClick={() => history.goBack()}
                >GO BACK</button>
              </div>
            </div>
          )}
          />
        ))}
      </div>
    )
  }
}

export default BooksApp
