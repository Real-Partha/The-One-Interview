import NavBar from "./Navbar/Navbar";
const Home = () => {
    const handleGoogleClick = () => {
        // console.log();
        console.log(`${import.meta.env.VITE_API_URL}/auth/google/callback`);
        window.open(`${import.meta.env.VITE_API_URL}/auth/google/callback`, "_self");
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
