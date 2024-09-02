// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import './LoginRegister.css';
// import useNotification from "../Notifications";

// const TwoFactorMessage = () => (
//   <div className="two-factor-message">
//     <div className="two-factor-icon">
//       <i className="fas fa-shield-alt"></i>
//     </div>
//     <h3>2FA Protected</h3>
//     <p>Your account is secured with Two-Factor Authentication.</p>
//     <p>Please open your Authenticator app and enter the 2FA token below.</p>
//   </div>
// );

// const LoginRegister = () => {
//   const [isActive, setIsActive] = useState(false);
//   const [loginData, setLoginData] = useState({ email: "", password: "" });
//   const [showLoginPassword, setShowLoginPassword] = useState(false);
//   const [twoFactorToken, setTwoFactorToken] = useState("");
//   const [requireTwoFactor, setRequireTwoFactor] = useState(false);
//   const [userId, setUserId] = useState(null);

//   const [signupData, setSignupData] = useState({
//     username: "",
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     gender: "",
//     date_of_birth: "",
//   });
//   const [showSignupPassword, setShowSignupPassword] = useState(false);
//   const [usernameAvailable, setUsernameAvailable] = useState(null);
//   const [checkingUsername, setCheckingUsername] = useState(false);
//   const [emailExists, setEmailExists] = useState(false);
//   const [checkingEmail, setCheckingEmail] = useState(false);
//   const [passwordError, setPasswordError] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [confirmPasswordError, setConfirmPasswordError] = useState("");

//   const { ErrorNotification, SuccessNotification } = useNotification();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/status`, { withCredentials: true });
//         if (response.data.requireTwoFactor) {
//           setRequireTwoFactor(true);
//           setUserId(response.data.userId);
//         } else if (response.data.isAuthenticated) {
//           navigate("/");
//         }
//       } catch (error) {
//         console.error("Error checking auth status:", error);
//       }
//     };

//     checkAuthStatus();
//   }, [navigate]);

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/auth/login`,
//         loginData,
//         { withCredentials: true }
//       );
//       if (response.data.requireTwoFactor) {
//         setRequireTwoFactor(true);
//         setUserId(response.data.userId);
//       } else if (response.data.user) {
//         SuccessNotification(response.data.message);
//         navigate("/");
//       }
//     } catch (error) {
//       ErrorNotification(error.response.data.message);
//       console.error("Login error:", error);
//     }
//   };

//   const handleTwoFactorSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/auth/verify-2fa`,
//         { userId, token: twoFactorToken },
//         { withCredentials: true }
//       );
//       if (response.data.user) {
//         SuccessNotification(response.data.message);
//         navigate("/");
//       }
//     } catch (error) {
//       ErrorNotification(error.response.data.message);
//       console.error("2FA verification error:", error);
//     }
//   };

//   const handleSignupSubmit = async (e) => {
//     e.preventDefault();
//     if (signupData.password !== signupData.confirmPassword) {
//       ErrorNotification("Passwords don't match");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/auth/signup`,
//         signupData,
//         { withCredentials: true }
//       );
//       if (response.data.user) {
//         SuccessNotification(response.data.message);
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Signup error:", error);
//       ErrorNotification(error.response?.data?.message || "Error signing up");
//     }
//   };

//   const handleGoogleClick = () => {
//     window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
//   };

//   const handleLoginChange = (e) => {
//     setLoginData({ ...loginData, [e.target.name]: e.target.value });
//   };

//   const handleSignupChange = (e) => {
//     let value = e.target.value;
//     if (e.target.name === "username") {
//       value = value.replace(/\s/g, "").toLowerCase();
//       setCheckingUsername(true);
//       setUsernameAvailable(null);
//     }
//     if (e.target.name === "email") {
//       setCheckingEmail(true);
//       setEmailExists(false);
//       if (value && !validateEmail(value)) {
//         setEmailError("Please enter a valid email address");
//       } else {
//         setEmailError("");
//       }
//     }
//     if (e.target.name === "password") {
//       validatePassword(value);
//     }
//     if (e.target.name === "confirmPassword") {
//       if (value !== signupData.password) {
//         setConfirmPasswordError("Passwords do not match");
//       } else {
//         setConfirmPasswordError("");
//       }
//     }
//     setSignupData({ ...signupData, [e.target.name]: value });
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const validatePassword = (password) => {
//     if (password.length < 6) {
//       setPasswordError("Password must be at least 6 characters long");
//     } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
//       setPasswordError("Password must contain both letters and numbers");
//     } else {
//       setPasswordError("");
//     }
//   };

//   useEffect(() => {
//     const checkUsernameAvailability = async () => {
//       if (signupData.username && signupData.username.length > 2) {
//         try {
//           const response = await axios.get(
//             `${import.meta.env.VITE_API_URL}/user/check-username/${signupData.username}`
//           );
//           setUsernameAvailable(response.data.available);
//         } catch (error) {
//           console.error("Error checking username:", error);
//           setUsernameAvailable(false);
//         }
//       } else {
//         setUsernameAvailable(null);
//       }
//       setCheckingUsername(false);
//     };

//     const timeoutId = setTimeout(() => {
//       checkUsernameAvailability();
//     }, 500);

//     return () => clearTimeout(timeoutId);
//   }, [signupData.username]);

//   useEffect(() => {
//     const checkEmailAvailability = async () => {
//       if (validateEmail(signupData.email)) {
//         try {
//           const response = await axios.get(
//             `${import.meta.env.VITE_API_URL}/user/check-email/${signupData.email}`
//           );
//           setEmailExists(response.data.exists);
//         } catch (error) {
//           console.error("Error checking email:", error);
//           setEmailExists(false);
//         }
//       }
//       setCheckingEmail(false);
//     };

//     const timeoutId = setTimeout(() => {
//       checkEmailAvailability();
//     }, 500);

//     return () => clearTimeout(timeoutId);
//   }, [signupData.email]);

//   const isSignupFormValid = () => {
//     return (
//       signupData.username &&
//       signupData.first_name &&
//       signupData.last_name &&
//       signupData.email &&
//       validateEmail(signupData.email) &&
//       signupData.password &&
//       signupData.confirmPassword &&
//       signupData.gender &&
//       signupData.date_of_birth &&
//       usernameAvailable &&
//       !emailExists &&
//       !passwordError &&
//       !emailError &&
//       signupData.password === signupData.confirmPassword
//     );
//   };

//   return (
//     <div className={`wrapper ${isActive ? 'active' : ''}`}>
//       <span className="rotate-bg"></span>
//       <span className="rotate-bg2"></span>

//       <div className="form-box login">
//         <h2 className="title animation" style={{ "--i": 0, "--j": 21 }}>Login</h2>
//         {!requireTwoFactor ? (
//           <form onSubmit={handleLoginSubmit}>
//             <div className="input-box animation" style={{ "--i": 1, "--j": 22 }}>
//               <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required />
//               <label>Email</label>
//               <i className='bx bxs-envelope'></i>
//             </div>
//             <div className="input-box animation" style={{ "--i": 2, "--j": 23 }}>
//               <input type={showLoginPassword ? "text" : "password"} name="password" value={loginData.password} onChange={handleLoginChange} required />
//               <label>Password</label>
//               <i className='bx bxs-lock-alt'></i>
//               <i className={`bx ${showLoginPassword ? 'bxs-hide' : 'bxs-show'}`} onClick={() => setShowLoginPassword(!showLoginPassword)}></i>
//             </div>
//             <button type="submit" className="btn animation" style={{ "--i": 3, "--j": 24 }}>Login</button>
//             <div className="login-divider animation" style={{ "--i": 4, "--j": 24.5 }}>
//               <span>or</span>
//             </div>
//             <button onClick={handleGoogleClick} className="login-google-button animation" style={{ "--i": 4.5, "--j": 25 }}>
//               <i className="fab fa-google"></i> Sign in with Google
//             </button>
//             <div className="linkTxt animation" style={{ "--i": 5, "--j": 25 }}>
//               <p>Don't have an account? <a href="#" className="register-link" onClick={() => setIsActive(true)}>Sign Up</a></p>
//             </div>
//           </form>
//         ) : (
//           <form onSubmit={handleTwoFactorSubmit}>
//             <TwoFactorMessage />
//             <div className="input-box animation" style={{ "--i": 1, "--j": 22 }}>
//               <input type="text" value={twoFactorToken} onChange={(e) => setTwoFactorToken(e.target.value)} required />
//               <label>2FA Code</label>
//               <i className='bx bxs-key'></i>
//             </div>
//             <button type="submit" className="btn animation" style={{ "--i": 3, "--j": 24 }}>Verify 2FA</button>
//           </form>
//         )}
//       </div>

//       <div className="info-text login">
//         <h2 className="animation" style={{ "--i": 0, "--j": 20 }}>Welcome Back!</h2>
//         <p className="animation" style={{ "--i": 1, "--j": 21 }}>Log in to access your account and explore our features.</p>
//       </div>

//       <div className="form-box register">
//         <h2 className="title animation" style={{ "--i": 17, "--j": 0 }}>Sign Up</h2>
//         <form onSubmit={handleSignupSubmit}>
//           <div className="input-box animation" style={{ "--i": 18, "--j": 1 }}>
//             <input type="text" name="username" value={signupData.username} onChange={handleSignupChange} required />
//             <label>Username</label>
//             <i className='bx bxs-user'></i>
//           </div>
//           {checkingUsername && <span className="checking">Checking username...</span>}
//           {!checkingUsername && usernameAvailable !== null && (
//             <span className={usernameAvailable ? "available" : "unavailable"}>
//               {usernameAvailable ? "✓ Username is available" : "✗ Username is not available"}
//             </span>
//           )}
//           <div className="input-box animation" style={{ "--i": 19, "--j": 2 }}>
//             <input type="email" name="email" value={signupData.email} onChange={handleSignupChange} required />
//             <label>Email</label>
//             <i className='bx bxs-envelope'></i>
//           </div>
//           {checkingEmail && <span className="checking">Checking email...</span>}
//           {!checkingEmail && emailExists && <span className="unavailable">✗ Account already exists with this email</span>}
//           {emailError && <span className="error">{emailError}</span>}
//           <div className="input-box animation" style={{ "--i": 20, "--j": 3 }}>
//             <input type={showSignupPassword ? "text" : "password"} name="password" value={signupData.password} onChange={handleSignupChange} required />
//             <label>Password</label>
//             <i className='bx bxs-lock-alt'></i>
//             <i className={`bx ${showSignupPassword ? 'bxs-hide' : 'bxs-show'}`} onClick={() => setShowSignupPassword(!showSignupPassword)}></i>
//           </div>
//           {passwordError && <span className="error">{passwordError}</span>}
//           <div className="input-box animation" style={{ "--i": 21, "--j": 4 }}>
//             <input type="password" name="confirmPassword" value={signupData.confirmPassword} onChange={handleSignupChange} required />
//             <label>Confirm Password</label>
//             <i className='bx bxs-lock-alt'></i>
//           </div>
//           {confirmPasswordError && <span className="error">{confirmPasswordError}</span>}
//           <button type="submit" className="btn animation" style={{ "--i": 21, "--j": 4 }} disabled={!isSignupFormValid()}>Sign Up</button>
//           <div className="linkTxt animation" style={{ "--i": 22, "--j": 5 }}>
//             <p>Already have an account? <a href="#" className="login-link" onClick={() => setIsActive(false)}>Login</a></p>
//           </div>
//         </form>
//       </div>

//       <div className="info-text register">
//         <h2 className="animation" style={{ "--i": 17, "--j": 0 }}>Join Us Today!</h2>
//         <p className="animation" style={{ "--i": 18, "--j": 1 }}>Create an account to access exclusive features and personalized content.</p>
//       </div>
//     </div>
//   );
// };

// export default LoginRegister;



import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './LoginRegister.css';
import useNotification from "../Notifications";

const TwoFactorMessage = () => (
  <div className="two-factor-message">
    <div className="two-factor-icon">
      <i className="fas fa-shield-alt"></i>
    </div>
    <h3>2FA Protected</h3>
    <p>Your account is secured with Two-Factor Authentication.</p>
    <p>Please open your Authenticator app and enter the 2FA token below.</p>
  </div>
);

const LoginRegister = () => {
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [requireTwoFactor, setRequireTwoFactor] = useState(false);
  const [userId, setUserId] = useState(null);

  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    // gender: "",
    // date_of_birth: "",
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { ErrorNotification, SuccessNotification } = useNotification();
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/status`, { withCredentials: true });
        if (response.data.requireTwoFactor) {
          setRequireTwoFactor(true);
          setUserId(response.data.userId);
        } else if (response.data.isAuthenticated) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        loginData,
        { withCredentials: true }
      );
      if (response.data.requireTwoFactor) {
        setRequireTwoFactor(true);
        setUserId(response.data.userId);
      } else if (response.data.user) {
        SuccessNotification(response.data.message);
        navigate("/");
      }
    } catch (error) {
      ErrorNotification(error.response.data.message);
      console.error("Login error:", error);
    }
  };

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-2fa`,
        { userId, token: twoFactorToken },
        { withCredentials: true }
      );
      if (response.data.user) {
        SuccessNotification(response.data.message);
        navigate("/");
      }
    } catch (error) {
      ErrorNotification(error.response.data.message);
      console.error("2FA verification error:", error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      ErrorNotification("Passwords don't match");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        signupData,
        { withCredentials: true }
      );
      if (response.data.user) {
        SuccessNotification(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      ErrorNotification(error.response?.data?.message || "Error signing up");
    }
  };

  const handleGoogleClick = () => {
    window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "username") {
      value = value.replace(/\s/g, "").toLowerCase();
      setCheckingUsername(true);
      setUsernameAvailable(null);
    }
    if (e.target.name === "email") {
      setCheckingEmail(true);
      setEmailExists(false);
      if (value && !validateEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
    if (e.target.name === "password") {
      validatePassword(value);
    }
    if (e.target.name === "confirmPassword") {
      if (value !== signupData.password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
    setSignupData({ ...signupData, [e.target.name]: value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setPasswordError("Password must contain both letters and numbers");
    } else {
      setPasswordError("");
    }
  };

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (signupData.username && signupData.username.length > 2) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/check-username/${signupData.username}`
          );
          setUsernameAvailable(response.data.available);
        } catch (error) {
          console.error("Error checking username:", error);
          setUsernameAvailable(false);
        }
      } else {
        setUsernameAvailable(null);
      }
      setCheckingUsername(false);
    };

    const timeoutId = setTimeout(() => {
      checkUsernameAvailability();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [signupData.username]);

  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (validateEmail(signupData.email)) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/check-email/${signupData.email}`
          );
          setEmailExists(response.data.exists);
        } catch (error) {
          console.error("Error checking email:", error);
          setEmailExists(false);
        }
      }
      setCheckingEmail(false);
    };

    const timeoutId = setTimeout(() => {
      checkEmailAvailability();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [signupData.email]);


  // ... (keep all the existing functions and useEffects)

  const isSignupFormValid = () => {
    return (
      signupData.first_name &&
      signupData.last_name &&
      signupData.username &&
      signupData.email &&
      validateEmail(signupData.email) &&
      signupData.password &&
      signupData.confirmPassword &&
      signupData.gender &&
      signupData.date_of_birth &&
      usernameAvailable &&
      !emailExists &&
      !passwordError &&
      !emailError &&
      signupData.password === signupData.confirmPassword
    );
  };

  return (
    <div className={`wrapper ${isActive ? 'active' : ''}`}>
      <span className="rotate-bg"></span>
      <span className="rotate-bg2"></span>

      <div className="form-box login">
        <h2 className="title animation" style={{"--i": 0, "--j": 21}}>Login</h2>
        {!requireTwoFactor ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="input-box animation" style={{"--i": 1, "--j": 22}}>
              <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required />
              <label>Email</label>
              <i className='bx bxs-envelope'></i>
            </div>
            <div className="input-box animation" style={{"--i": 2, "--j": 23}}>
              <input type={showLoginPassword ? "text" : "password"} name="password" value={loginData.password} onChange={handleLoginChange} required />
              <label>Password</label>
              <i className='bx bxs-lock-alt'></i>
              <i className={`bx ${showLoginPassword ? 'bxs-hide' : 'bxs-show'}`} onClick={() => setShowLoginPassword(!showLoginPassword)}></i>
            </div>
            <button type="submit" className="btn animation" style={{"--i": 3, "--j": 24}}>Login</button>
            <div className="login-divider animation" style={{"--i": 4, "--j": 24.5}}>
              <span>or</span>
            </div>
            <button onClick={handleGoogleClick} className="login-google-button animation" style={{"--i": 4.5, "--j": 25}}>
              <i className="fab fa-google"></i> Sign in with Google
            </button>
            <div className="linkTxt animation" style={{"--i": 5, "--j": 25.5}}>
              <p>Don't have an account? <a href="#" className="register-link" onClick={() => setIsActive(true)}>Sign Up</a></p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleTwoFactorSubmit}>
            <TwoFactorMessage />
            <div className="input-box animation" style={{"--i": 1, "--j": 22}}>
              <input type="text" value={twoFactorToken} onChange={(e) => setTwoFactorToken(e.target.value)} required />
              <label>2FA Code</label>
              <i className='bx bxs-key'></i>
            </div>
            <button type="submit" className="btn animation" style={{"--i": 3, "--j": 24}}>Verify 2FA</button>
          </form>
        )}
      </div>

      <div className="info-text login">
        <h2 className="animation" style={{"--i": 0, "--j": 20}}>Welcome Back!</h2>
        <p className="animation" style={{"--i": 1, "--j": 21}}>Log in to access your account and explore our features.</p>
      </div>

      <div className="form-box register">
        <h2 className="title animation" style={{"--i": 17, "--j": 0}}>Sign Up</h2>
        <form onSubmit={handleSignupSubmit}>
          <div className="input-box animation" style={{"--i": 18, "--j": 1}}>
            <input type="text" name="first_name" value={signupData.first_name} onChange={handleSignupChange} required />
            <label>First Name</label>
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box animation" style={{"--i": 19, "--j": 2}}>
            <input type="text" name="last_name" value={signupData.last_name} onChange={handleSignupChange} required />
            <label>Last Name</label>
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box animation" style={{"--i": 20, "--j": 3}}>
            <input type="text" name="username" value={signupData.username} onChange={handleSignupChange} required />
            <label>Username</label>
            <i className='bx bxs-user'></i>
          </div>
          {checkingUsername && <span className="checking">Checking username...</span>}
          {!checkingUsername && usernameAvailable !== null && (
            <span className={usernameAvailable ? "available" : "unavailable"}>
              {usernameAvailable ? "✓ Username is available" : "✗ Username is not available"}
            </span>
          )}
          <div className="input-box animation" style={{"--i": 21, "--j": 4}}>
            <input type="email" name="email" value={signupData.email} onChange={handleSignupChange} required />
            <label>Email</label>
            <i className='bx bxs-envelope'></i>
          </div>
          {checkingEmail && <span className="checking">Checking email...</span>}
          {!checkingEmail && emailExists && <span className="unavailable">✗ Account already exists with this email</span>}
          {emailError && <span className="error">{emailError}</span>}
          <div className="input-box animation" style={{"--i": 22, "--j": 5}}>
            <input type={showSignupPassword ? "text" : "password"} name="password" value={signupData.password} onChange={handleSignupChange} required />
            <label>Password</label>
            <i className='bx bxs-lock-alt'></i>
            <i className={`bx ${showSignupPassword ? 'bxs-hide' : 'bxs-show'}`} onClick={() => setShowSignupPassword(!showSignupPassword)}></i>
          </div>
          {passwordError && <span className="error">{passwordError}</span>}
          <div className="input-box animation" style={{"--i": 23, "--j": 6}}>
            <input type="password" name="confirmPassword" value={signupData.confirmPassword} onChange={handleSignupChange} required />
            <label>Confirm Password</label>
            <i className='bx bxs-lock-alt'></i>
          </div>
          {confirmPasswordError && <span className="error">{confirmPasswordError}</span>}
          <button type="submit" className="btn animation" style={{"--i": 24, "--j": 7}} disabled={!isSignupFormValid()}>Sign Up</button>
          <div className="linkTxt animation" style={{"--i": 25, "--j": 8}}>
            <p>Already have an account? <a href="#" className="login-link" onClick={() => setIsActive(false)}>Login</a></p>
          </div>
        </form>
      </div>

      <div className="info-text register">
        <h2 className="animation" style={{"--i": 17, "--j": 0}}>Join Us Today!</h2>
        <p className="animation" style={{"--i": 18, "--j": 1}}>Create an account to access exclusive features and personalized content.</p>
      </div>
    </div>
  );
};

export default LoginRegister;

