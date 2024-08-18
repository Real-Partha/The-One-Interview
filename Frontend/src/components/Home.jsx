
const Home = () => {
    const handleGoogleClick = () => {
        window.location.href = '/auth/google';
      };
  return (
    <div>
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
