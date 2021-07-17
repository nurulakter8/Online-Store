import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'
import * as Home from './home_page.js'
import * as Check from './checkout_page.js'
import * as util from './util.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'



export function addEventListneres() {

	Element.menuWishList.addEventListener('click', async () => {
		history.pushState(null, null, Route.routePathname.WISH);
		await wishlist_page();
	});
}

export async function wishlist_page() {
	if (!Auth.currentUser) {
		Element.root.innerHTML = '<h1>Protected Page</h1>'
		return;
	}
	let html = '<h1>Wish List</h1>';
	const cart = Home.cart;

	if (!cart || cart.getTotalQty() == 0) {
		html += '<h1>Empty!!</h1>';
		return;
	}

	html += `
	<table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">Image</th>
      <th scope="col">Name</th>
      <th scope="col">Unit Price</th>
      <th scope="col">Quantity</th>
	  <th scope="col">Sub-Tptal</th>
	  <th scope="col" width="50%">Summary</th>
    </tr>
  </thead>
  <tbody>
	`;

	cart.items.forEach(item => {
		html += `
		<tr>
			<td> <img src="${item.imageURL}" width = "150px" </td> 
			<td>${item.name}</td>
			<td>${util.currency(item.price)}</td>
			<td>${item.qty}</td>
			<td>${util.currency(item.qty * item.price)}</td>
			<td>${item.summary}</td>
		</tr>
		`;
	})

	html += '</tbody></table>'

	html += `
		<button id="button-continue" class="btn btn-outline-primary">Continue Shopping</button>
	`;


	Element.root.innerHTML = html;


	const continueButton = document.getElementById('button-continue');
	continueButton.addEventListener('click', async () => {
		history.pushState(null, null, Route.routePathname.HOME);
		await Home.home_page();
	})
}