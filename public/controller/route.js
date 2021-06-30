import * as Home from '../view/home_page.js'
import * as Purchase from '../view/purchase_page.js'
import * as Cart from '../view/cart.js'
import * as Profile from '../view/profile_page.js'

export const routePathname = {
	HOME: '/',
	PURCHASE: '/purchase',
	PROFILE:'/profile',
	CART: '/cart',
}

export const routes = [
	{pathname: routePathname.HOME, page: Home.home_page},
	{pathname: routePathname.PURCHASE, page: Purchase.purchase_page},
	{pathname: routePathname.PROFILE, page: Profile.profile_page},
	{pathname: routePathname.CART, page: Cart.cart_page},
];

export function routing(pathname, hash){
	const route = routes.find(r => r.pathname == pathname);
	if (route) route.page();
	else routes[0].page();
}