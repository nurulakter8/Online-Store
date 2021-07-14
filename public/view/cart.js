import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'
import * as Home from './home_page.js'
import * as Check from './checkout_page.js'
import * as util from './util.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'



export function addEventListneres() {

	Element.menuCart.addEventListener('click', async () => {
		history.pushState(null, null, Route.routePathname.CART);
		await cart_page();
	});
}

export async function cart_page() {
	if (!Auth.currentUser) {
		Element.root.innerHTML = '<h1>Protected Page</h1>'
		return;
	}
	let html = '<h1>Shoping Cart</h1>';

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
	<div style="font-size: 150%;"> 
		Total: ${util.currency(cart.getTotalPrice())}
	</div>
	`;

	html += `
		<button id="button-checkout" class="btn btn-outline-primary">Check Out</button>
		<button id="button-continue" class="btn btn-outline-primary">Continue Shopping</button>

	`;

	Element.root.innerHTML = html;

	const continueButton = document.getElementById('button-continue');
	continueButton.addEventListener('click', async () => {
		history.pushState(null, null, Route.routePathname.HOME);
		await Home.home_page();
	})

	const checkOutButton = document.getElementById('button-checkout');
	checkOutButton.addEventListener('click', async () => {
		const label = util.disableButton(checkOutButton);
		await util.sleep(1000);
		// save cart as purchase in Firestore

		try {
			await FirebaseController.checkOut(cart);
			util.info('Purchased!!', 'Thank you for shopping with us!')

			history.pushState(null, null, Route.routePathname.CHECK);
			await Check.donate_page();
			window.localStorage.removeItem(`cart-${Auth.currentUser.uid}`);
			cart.empty();
			Element.shoppingCartCount.innerHTML = '0'
		} catch (e) {
			if (Constant.DEV) console.log(e);
			util.info('checkout error ', JSON.stringify(e));
			return;
		}
		util.enableButton(checkOutButton, label);




	})
}