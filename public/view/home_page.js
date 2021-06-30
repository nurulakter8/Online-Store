import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'

export function addEventListneres() {
	Element.menuHome.addEventListener('click', async ()=> {
		history.pushState(null,null, Route.routePathname.HOME)
		await home_page();
	});
}

export async function home_page() {
	Element.root.innerHTML = '<h1>Home Page</h1>';
}