import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AuthRoute from './AuthRoute';
import Header from './Header';
import Login from './auth/Login';
import Register from './auth/Register';
import Logout from './auth/Logout';
import Users from './user/Users';
import UserAdd from './user/UserAdd';
import UserEdit from './user/UserEdit';
import ApartmentsMap from './apartment/ApartmentsMap';
import Apartments from './apartment/Apartments';
import ApartmentAdd from './apartment/ApartmentAdd';
import ApartmentEdit from './apartment/ApartmentEdit';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <div className="main container">
          <Switch>
            <AuthRoute exact path="/" component={ApartmentsMap} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/logout" component={Logout} />
            <AuthRoute exact permit="admin" path="/users" component={Users} />
            <AuthRoute exact permit="admin" path="/users/new" component={UserAdd} />
            <AuthRoute exact permit="admin" path="/users/:userId/edit" component={UserEdit} />
            <AuthRoute exact permit="admin,realtor" path="/apartments" component={Apartments} />
            <AuthRoute exact permit="admin,realtor" path="/apartments/new" component={ApartmentAdd} />
            <AuthRoute exact permit="admin,realtor" path="/apartments/:apartmentId/edit" component={ApartmentEdit} />

          </Switch>
        </div>
      </div>
    </Router>
  );
}
