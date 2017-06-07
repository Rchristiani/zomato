//Up here we import all the required packages
import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'jquery';

//Allow the user to enter their city
//And with that get restaurants in that area
//And we will display them on the page
//Then when the user clicks on a restaurant we will show the menu

//Setting up some constants that we will need.
const apiUrl = 'https://developers.zomato.com/api/v2.1/';
const apiKey = 'eb2d5d3712288765a5d30a6a74dc0b99';

//Set up all component
//Think of App component as the app.init method from namespacing
//This is where everything begins.
class App extends React.Component {
	//The constructor is used to initialize stuff like state, used to bind methods
	//so that we get the proper this, etc.
	constructor() {
		//The super needs to be called so that we can use the this keyword
		//We do that because we need to call React.Component's constructor first
		super();
		//Set initial state
		this.state = {
			cityQuery: '',
			restaurants: []
		};
		//Here we bind our methods
		//React does not autobind so we need to get specific
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getRestaurants = this.getRestaurants.bind(this);
	}
	handleSubmit(e) {
		//This method hands the form submit
		//So when it is submitted we want to make our first request
		e.preventDefault();
		console.log("Submitted form");
		ajax({
			url: 'http://proxy.hackeryou.com',
			data: {
				reqUrl: `${apiUrl}locations`,
				proxyHeaders: {
					'user-key': apiKey
				},
				params: {
					query: this.state.cityQuery,
				},
				useCache: true
			},
			method: 'GET',
			dataType: 'json'
		})
		.then((res) => {
			console.log(res);
			//In here we only want to get the entity_id, so we create a new
			//var to store that.
			const entity_id = res.location_suggestions[0].entity_id;
			//Then we pass the value to getRestaurants
			this.getRestaurants(entity_id);
		});
	}
	getRestaurants(entity_id) {
		console.log(entity_id);
		//Then we search for the restaurants in that city.
		ajax({
			url: 'http://proxy.hackeryou.com',
			data: {
				reqUrl: `${apiUrl}search`,
				proxyHeaders: {
					'user-key': apiKey
				},
				params: {
					entity_id,
					entity_type: 'city'
				},
				useCache: true
			},
			method: 'GET',
			dataType: 'json'
		})
		.then((resData) => {
			//Here we need to change the data slightly
			//The way it comes back is an array of objects that have a restaurant key. That key holds the data we want.
			//So we map the array, and return ONLY that object.
			resData = resData.restaurants.map((resto) => {
				return resto.restaurant;
			});
			//Then we set the state of our App component to be that data
			//This is important, because anytime we call setState, React will
			//call the render method again, checking for differences in the data.
			this.setState({
				restaurants: resData
			});
			// REMOVE THIS
			resData.forEach(function(res) {
				console.log(res);
				ajax({
					url: 'http://proxy.hackeryou.com',
					data: {
						reqUrl: `${apiUrl}reviews`,
						proxyHeaders: {
							'user-key': apiKey
						},
						params: {
							res_id: res.id
						},
						useCache: true
					},
					method: 'GET',
					dataType: 'json'
				})
			})
			//REMOVE THIS
		})
	}
	//This will handle the change of an input
	handleChange(e) {
		//It will set up the value we want to search for. 
		this.setState({
			//This syntax is called a computed property
			//What it will do is create a key based on the value in e.target.name
			//In our case for this app, it will be the value of cityQuery
			[e.target.name] : e.target.value
		});
	}
	render() {
		return (
			<main>
				<form action="" onSubmit={this.handleSubmit}>
					<input type="search" name="cityQuery" onChange={this.handleChange} />
				</form>
				<ul>
					{/* 
						Here we map the array and for each element
						we will use our Restaurant component.
					 */}
					{this.state.restaurants.map((restaurant) => {
						//Here we return a component that gets passed some props, and we set the key to be what we want.
						return (
							<Restaurant data={restaurant} key={restaurant.id}/>
						)
					})}
				</ul>
			</main>
		)
	}
}

// We have a simple component that takes props and displays them
const Restaurant = (props) => {
	return (
		<li>
			<h2>{props.data.name}</h2>
		</li>
	)
}
//Here we render the thing.
ReactDOM.render(<App />, document.getElementById('app'));

[]
