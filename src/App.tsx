import React from 'react';
import { Login } from './pages/Login';
import { ModifyPassword } from './pages/ModifyPassword';

export const App = () => (
  <div className="app">
    <div className="app-content">
      <div className="app-header">
        <h3>Examples</h3>
      </div>
      <div className="app-content-body">
        <Login />
        <ModifyPassword />
      </div>
    </div>
  </div>
);
