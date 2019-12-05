import React from 'react';
import { Login } from './pages/Login';
import { ModifyPassword } from './pages/ModifyPassword';
import { Others } from './pages/Others';

export const App = () => (
  <div className="app">
    <div className="app-content">
      <div className="app-header">
        <h3>Examples</h3>
      </div>
      <div className="app-content-body">
        <Login />
        <ModifyPassword />
        <Others />
      </div>
    </div>
  </div>
);
