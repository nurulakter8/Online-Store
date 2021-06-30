import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'

export function addEventListneres() {

	Element.menuCart.addEventListener('click', async ()=> {
		history.pushState(null,null, Route.routePathname.CART);
		await cart_page();
	});
}

export async function cart_page() {
	Element.root.innerHTML = '<h1>Cart Page</h1>';
}