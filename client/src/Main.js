import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./Main.scss";
import Header from "./header/Header";
import Home from "./Home";
import FilterBar from "./filterBar/FilterBar";
import CreateAd from "./ads/CreateAd";
import SearchResults from "./SearchResults";
import AdDetailedView from "./ads/AdDetailedView";
import { PrivateRoute } from "./_components/PrivateRoute";
import Account from "./account/Account";

class Main extends Component {
    render() {
        return ( 
            <div className="Main">
                <Header />
				<FilterBar />
                <main>
                    <Switch>
						<Route path="/search" component={SearchResults}/>
						<Route path="/ad/:id" component={AdDetailedView}/>
                        <Route exact path="/" component={Home}/>
						<PrivateRoute path="/create/:id?" component={CreateAd} />
						<PrivateRoute path="/myaccount" component={Account} />
                        <Route render={() => <Redirect to="/" />} />
                    </Switch>
                </main>
            </div>
        );
    }
}



// const Home = ({ match }) => {
//     return (<div>
//     {/*default message*/}
//     <Route exact path={match.url} render={() => (
//       <h3>Please select a section:</h3>
//     )}/>
//     <Link to={`${match.url}/info`}>Info - </Link>
//     <Link to={`${match.url}/about`}>About - </Link>
//     <Link to={`${match.url}/contacts`}>Contact</Link>
//     <Route path={`${match.url}/:sectionName`} component={SubView}/>
//   </div>)
// }

// const SubView = ({ match }) => (
//     <div>
//       <h3>Section: 123{match.params.sectionName}</h3>
//     </div>
// );

export default Main;