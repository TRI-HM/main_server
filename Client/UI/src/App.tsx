import "./App.css";

function App() {
  return (
    <>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}></div>
      <h1>Postman Clone</h1>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Server URL:
          <input
            type="text"
            placeholder="Enter server URL"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              boxSizing: "border-box",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Content:
          <textarea
            placeholder="Enter content"
            style={{
              width: "100%",
              height: "100px",
              padding: "8px",
              marginTop: "5px",
              boxSizing: "border-box",
            }}
          />
        </label>
      </div>
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => alert("Send button clicked")}>
        Send
      </button>
    </>
  );
}

export default App;
