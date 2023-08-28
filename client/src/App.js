import { useContext } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import Login from './components/Login';
import HomePage from './components/HomePage';
import Settings from './components/Settings';
import TopicPage from './components/TopicPage';
import { myContext } from './Context';
import PostPage from './components/PostPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import Contact from './components/Contact';
import Error404 from './components/Error404';

export default function App(){
  //Get the user object from Context.js
  const userObject = useContext(myContext);

  console.log(userObject);
  if (userObject) console.log(userObject.username);
  if (userObject) console.log(userObject.role);
    return (
      <>
        <BrowserRouter>
          <Navbar user={userObject} />
          <div className="content-wrapper">
            <Switch>
              <Route path='/' exact render={(props) => (
                  <HomePage {...props} user={userObject}/>
                )}
              />
              <Route path='/login' render={(props) => (
                <Login />
              )}
              />
              <Route path='/settings' render={(props) => (
                  <Settings {...props} user={userObject}/>
                )}
              />
              <Route path='/topic/*/post' render={(props) =>(
                  <PostPage {...props} user={userObject}/>
                )}
              />
              <Route path='/topic' render={(props) => (
                  <TopicPage {...props} user={userObject}/>
                )}
              />
              <Route path='/PrivacyPolicy' render={(props) => (
                  <PrivacyPolicy {...props} user={userObject}/>
                )}
              />
              <Route path='/Contact' render={(props) => (
                  <Contact {...props} user={userObject}/>
                )}
              />
              <Route component={Error404} />
            </Switch>
          </div>
          <Footer />
        </BrowserRouter>
      </>
    );
}
