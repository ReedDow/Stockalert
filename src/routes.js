
import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Landing from './Components/Landing/Landing';
import Dashboard from './Components/Dashboard/Dashboard';
import Profile from './Components/Profile/Profile';
import Home from './Components/Home/Home';
import Contact from './Components/Contact/Contact'

export default (
    <Switch>
        <Route exact path ='/' component={Landing} />
        <Route path ='/dash' component={Dashboard} />
        <Route path ='/profile' component={Profile} />
        <Route path = '/home' component={Home}/>
        <Route path = '/contact' component={Contact}/>
    </Switch>
)