import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import NewApp from './components/LoginPage'
import MainScreen from './components/Messenger'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";


import a from "./components/use-auth.js";
const [useAuth, authContext] = a
// console.log(useAuth(), authContext)
export default function App() {

  const [navOpen, setNavOpen] = useState(false)
  const opennav = () => {
    // console.log("slic")
    let tempNav = navOpen;
    setNavOpen(!navOpen)
    // navOpen = !navOpen;
    if (tempNav) {
      document.getElementById('nav-toggler').style.left = '179px';
      document.getElementById('nav-icon').style.transform = 'rotate(0deg)';
    }
    else {
      document.getElementById('nav-toggler').style.left = '-500px';
      document.getElementById('nav-icon').style.transform = 'rotate(-180deg)';
    }

  }
  const toggleOptionButton = () => {
    if (navOpen) {
      return <i onClick={opennav} className="fas fa-plus fa-3x "></i>
    } else {
      return <i onClick={opennav} className="fas fa-users-cog fa-3x"></i>
    }
  }

  return (
    <ProvideAuth>
      <Router>


        <div className="whole-panel">
          <div className="navigation-bar-wrapper">
            <div className="corner-button" >
              <div id="nav-icon" >{toggleOptionButton()}
              </div>
            </div>
            <div className="navigation-bar " id="nav-toggler">
              <ul>
                <li className="nav-link">
                  <NavLink

                    to="/home"
                    activeStyle={{
                      backgroungColor: 'rgb(237, 136, 89)', color: 'white', borderRadius: '10px', padding: '8px'
                    }}>Home</NavLink></li>


                <li className="nav-link">
                  <NavLink
                    className="nav-link"
                    to="/login"
                    activeStyle={{
                      backgroungColor: 'rgb(237, 136, 89)', color: 'white', borderRadius: '10px', padding: '8px 8px 8px 25px'
                    }}>Login</NavLink></li>


                <li className="nav-link">
                  <NavLink
                    className="nav-link"
                    to="/home"
                    activeStyle={{
                      backgroungColor: 'rgb(237, 136, 89)', color: 'white', borderRadius: '10px', padding: '8px 8px 8px 27px'
                    }}>Find Friends</NavLink></li>
                <li><AuthButton /></li>
              </ul>
            </div>
          </div>
          <div className="content ">
            <Switch>
              <Route path="/login">
                <NewApp />
              </Route>
              <PrivateRoute path="/home">
                <MainScreen />
              </PrivateRoute>
            </Switch>
          </div>
        </div>

      </Router>
    </ProvideAuth >

  )
}



const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

// this will be used globally


function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}


function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = cb => {
    return fakeAuth.signin(() => {
      setUser("user");
      cb();
    });
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}



function AuthButton() {
  let history = useHistory();
  let auth = useAuth();

  return auth.user ? (
    <p>
      <a onClick={() => { auth.signout(() => history.push("/")); }} className="bg-orange btn btn-info " style={{ width: '100px' }}>
        <i class="fa fa-sign-out" aria-hidden="true"></i> Log out
        </a>
    </p >
  ) : (
      <p>You are not logged in.</p>
    );
}

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}



