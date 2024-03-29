import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Message from "./components/Message";
import Quotes from "./components/quotes/Quotes";
import FavoriteQuotes from "./components/quotes/FavoriteQuotes";
import { Loader } from "react-feather";
import "./App.css";

function App() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("All");
  const [favoriteQuotes, setFavoriteQuotes] = useState(
    JSON.parse(window.localStorage.getItem("favoriteQuotes")) || []
  );

  const [messageText, setMessageText] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const maxFaves = 3;

  // const quotesUrl =
  //   "https://gist.githubusercontent.com/skillcrush-curriculum/6365d193df80174943f6664c7c6dbadf/raw/1f1e06df2f4fc3c2ef4c30a3a4010149f270c0e0/quotes.js";

  const quotesUrl =
    "https://gist.githubusercontent.com/AimeeT8/af7be7fe284afdf7f5cc2b178554bc4f/raw/2384c92b2982013a74613991f5a4b16085e69898/quotes.js";

  const categories = [
    "All",
    "Leadership",
    "Empathy",
    "Motivation",
    "Learning",
    "Success",
    "Empowerment"
  ];

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(quotesUrl);
      const results = await response.json();
      setQuotes(results);
    } catch (e) {
      console.log("Something went wrong", e);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "favoriteQuotes",
      JSON.stringify(favoriteQuotes)
    );
  }, [favoriteQuotes]);

  const filteredQuotes =
    category !== "All"
      ? quotes.filter(quote => quote.categories.includes(category))
      : quotes;

  const handleCategoryChange = e => {
    setCategory(e.target.value);
  };

  const addToFavorites = quoteId => {
    const selectedQuote = quotes.find(quote => quote.id === quoteId);

    const alreadyFavorite = favoriteQuotes.find(
      favorite => favorite.id === selectedQuote.id
    );
    if (alreadyFavorite) {
      setMessageText(
        "This quote is already in your favorites. Choose another."
      );
      setShowMessage(true);
    } else if (favoriteQuotes.length < maxFaves) {
      setFavoriteQuotes([...favoriteQuotes, selectedQuote]);
      setMessageText("added to your favorites!");
      setShowMessage(true);
    } else {
      setMessageText("Maximum amount of favorites reached!");
      setShowMessage(true);
    }
  };

  const removeFromFavorites = quoteId => {
    const updatedFavorites = favoriteQuotes.filter(
      quote => quote.id !== quoteId
    );
    setFavoriteQuotes(updatedFavorites);
  };

  const removeMessage = () => {
    setShowMessage(false);
  };
  return (
    <div className="App">
      {showMessage && (
        <Message messageText={messageText} removeMessage={removeMessage} />
      )}
      <Header />
      <main>
        <FavoriteQuotes
          favoriteQuotes={favoriteQuotes}
          maxFaves={maxFaves}
          removeFromFavorites={removeFromFavorites}
        />
        {loading ? (
          <Loader />
        ) : (
          <Quotes
            filteredQuotes={filteredQuotes}
            categories={categories}
            category={category}
            handleCategoryChange={handleCategoryChange}
            addToFavorites={addToFavorites}
            favoriteQuotes={favoriteQuotes}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
export default App;
