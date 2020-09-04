import React from 'react';
import { Link, Route } from 'react-router-dom';

const Nav = ({ match }) => {
return( <div>   <ul>
        <li><Link to={`${match.url}/Home`}>Home</Link></li>
        <li><Link to={`${match.url}/Profile`}>Profile</Link></li>
        <li><Link to={`${match.url}/Dashboard`}>Watchlist</Link></li>
   
      </ul>
      <Route path={`${match.path}/:name`} render= {({match}) =>( <div> <h3> {match.params.name} </h3></div>)}/>
      </div>)
}

export default Nav;