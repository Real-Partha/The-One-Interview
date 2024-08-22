const Signup = () => {
    const handleGoogleClick = () => {
        window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
      };
  return (
    <div>
      <button> Register </button>
      <button onClick={handleGoogleClick}> Google </button>
    </div>
  )
}

export default Signup;