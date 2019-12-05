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
import { ModifyPassword } from './pages/ModifyPassword';

const route: Array<Omit<NavLinkProps, 'to'> & { to: string }> = [
  {
    to: PATHS.LOGIN,
    component: Login,
    children: 'Login'
  },
  {
    to: PATHS.MODIFY_PASSWORD,
    component: ModifyPassword,
    children: 'Modify Password'
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
        <Route key={index} path={to} component={component} />
      ))}
    </Switch>
  </Router>
);
