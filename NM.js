import React, { useState, useEffect } from "react";

const API_KEY = "YOUR_NEWSAPI_KEY"; // 🔑 Replace with your NewsAPI key
const PAGE_SIZE = 10;

function App() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch news
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=${PAGE_SIZE}&page=${page}&apiKey=${API_KEY}`
      );
      const data = await response.json();
      if (data.articles) {
        setArticles((prev) => [...prev, ...data.articles]);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load when page changes
  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>📰 News Feed</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {articles.map((article, i) => (
          <div
            key={i}
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={article.urlToImage || "https://via.placeholder.com/300"}
              alt="news"
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h2 style={{ fontSize: "18px", margin: "10px 0" }}>
              {article.title}
            </h2>
            <p style={{ fontSize: "14px", color: "gray" }}>
              {article.description || "No description available"}
            </p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <button
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Read More
              </button>
            </a>
          </div>
        ))}
      </div>
      {loading && <p style={{ textAlign: "center" }}>Loading more news...</p>}
    </div>
  );
}

export default App;
