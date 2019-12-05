import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  NavLinkProps
} from 'react-router-dom';
import { PATHS } from './constants';
import { Login } from './pages/Login';

const route: NavLinkProps[] = [
  {
    to: PATHS.LOGIN,
    component: Login,
    children: 'Login'
  }
];

function Home() {
  return (
    <div className="home">
      <div>
        <h3>Examples</h3>
        <ul>
          {route.map(({ component, ...props }, index) => (
            <li key={index}>
              <NavLink {...props} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const App = () => (
  <Router>
    <Switch>
      <Route exact path={PATHS.HOME} component={Home} />
      {route.map(({ to, component }, index) => (
        <Route key={index} to={to} component={component} />
      ))}
    </Switch>
  </Router>
);
