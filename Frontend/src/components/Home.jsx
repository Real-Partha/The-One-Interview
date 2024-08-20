import NavBar from "./Navbar/Navbar";

const Home = () => {
    const handleGoogleClick = () => {
        window.open(`http://localhost:3000/auth/google`, "_self");
      };
  return (
    <div>
      <NavBar />
      <h1>
        Hello this is Home Page
      </h1>

      <button> Login </button>
      <button> Register </button>
      <button onClick={handleGoogleClick}> Google </button>
    </div>
  )
}

export default Home;
