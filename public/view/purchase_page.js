import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'

export function addEventListneres() {
	Element.menuPurchase.addEventListener('click', async ()=> {
		history.pushState(null,null, Route.routePathname.PURCHASE)
		await purchase_page();
	});
}

export async function purchase_page() {
	Element.root.innerHTML = '<h1>Purchase Page</h1>';
}