import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as util from './util.js'


export function addEventListneres() {
	Element.menuPurchase.addEventListener('click', async ()=> {
		history.pushState(null,null, Route.routePathname.PURCHASE)
		await purchase_page();
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
			console.log('index= ', index);
		})
		
	}
}