import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <main className="container py-3">
        <h1 className="bg-danger">Hello world</h1>
      </main>
      <Footer />
    </>
  );
}

export default App;
