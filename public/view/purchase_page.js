import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as util from './util.js'


export function addEventListneres() {
	Element.menuPurchase.addEventListener('click', async ()=> {
		history.pushState(null,null, Route.routePathname.PURCHASE);
		const label = util.disableButton(Element.menuPurchase)
		await purchase_page();
		util.enableButton(Element.menuPurchase, label);
	});
}

export async function purchase_page() {
	if (!Auth.currentUser) {
		Element.root.innerHTML = '<h1>Protected Page</h1>'
		return;
	}

	let html = '<h1>Purchase Page</h1>';	

	let carts;
	try {
		carts = await FirebaseController.getPurchaseHistory(Auth.currentUser.uid);
		if (carts.length === 0) {
			html += '<h2>No Purchase Found:(</h2>'
			Element.root.innerHTML = html;
			return;
		}
	} catch (e) {
		if (Constant.DEV) console.log(e);
		util.info(' error ', JSON.stringify(e));
	}

	html+= `
	<table class="table table-striped">
  <thead>
    <tr>
      <th scope="col">View</th>
      <th scope="col">Items</th>
      <th scope="col">Price</th>
      <th scope="col">Date</th>
    </tr>
  </thead>
  <tbody>
	`;

	for (let i = 0; i < carts.length; i++) {
		html += `
		<tr>
			<td>
				<form class="form-ourchase-history" method ="post">
				<input type="hidden" name="index" value="${i}">
				<button type= "submit" class ="btn btn-outline-primary">Details</button>
				</form>
			</td>
			<td>${carts[i].getTotalQty()}</td>
			<td>${util.currency(carts[i].getTotalPrice())}</td>
			<td>${new Date(carts[i].timestamp).toString()}</td>
			</tr>
		`;
	}

	html += '</tbody></table>'

	Element.root.innerHTML = html;

	const historyForms = document.getElementsByClassName('form-ourchase-history');
	for (let i = 0; i < historyForms.length; i++) {
		historyForms[i].addEventListener('submit', e=> {
			e.preventDefault();
			const index = e.target.index.value;
			Element.modalTransactionViewTitle.innerHTML = `Purchased At: ${new Date(carts[index].timestamp).toString()}`;
			Element.modalTransactionViewBody.innerHTML = buildTransactionView(carts[index]);
			Element.modalTransactionView.show();

		})
		
	}
}

function buildTransactionView(cart){
	let html =
	`
	<table class="table">
  <thead>
    <tr>
      <th scope="col">Image</th>
      <th scope="col">Name</th>
      <th scope="col">Price</th>
      <th scope="col">Qty</th>
	  <th scope="col">Sub-Total</th>
	  <th scope="col" width="50%">Summary</th>
    </tr>
  </thead>
  <tbody>
	`;

	cart.items.forEach(item => {
		html += `
		<tr>
			<td> <img src="${item.imageURL}" width ="150px"></td>
			<td>${item.name}</td>
			<td>${util.currency(item.price)}</td>
			<td>${item.qty}</td>
			<td>${util.currency(item.qty * item.price)}</td>
			<td>${item.summary}</td>
		</tr>
		`;
	})
	html += '</tbody></table>';
	html += `<div style="font-size: 150%">Total: ${util.currency(cart.getTotalPrice())}</div>`;
	return html;
}