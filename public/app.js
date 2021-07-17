import * as Auth from './controller/auth.js'
import * as Home from './view/home_page.js'
import * as Cart from './view/cart.js'
import * as Profile from './view/profile_page.js'
import * as Purchase from './view/purchase_page.js'
import * as Route from './controller/route.js'
import * as Review from './view/review_page.js'
import * as Wish from './view/wishlist_page.js'



Auth.addEventListneres();
Home.addEventListneres();
Cart.addEventListneres();
Profile.addEventListneres();
Purchase.addEventListneres();
Wish.addEventListneres();


window.onload =() => {
	const pathname = window.location.pathname;
	const hash = window.location.hash;

	Route.routing(pathname, hash);
}

window.addEventListener('popstate', e=> {
	e.preventDefault();
	const pathname = e.target.location.pathname;
	const hash = e.target.location.hash;
	Route.routing(pathname, hash);
})