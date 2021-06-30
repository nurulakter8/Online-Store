import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'


export function addEventListneres() {
	Element.menuHome.addEventListener('click', async ()=> {
		history.pushState(null,null, Route.routePathname.HOME)
		await home_page();
	});
}

export async function home_page() {

	let html = '<h1>Enjoy Shopping</h1>';

	let products;
	try {
		products = await FirebaseController.getProductList();
	} catch (e) {
		if (Constant.DEV) console.log(e);
		Util.info('cannot get product list', JSON.stringify(e));
		return;
	}

	for (let i = 0; i < products.length; i++) {
		html+= buildProductCard(products[i], i);
		
	}
	Element.root.innerHTML = html;


}

function buildProductCard(product, index) {
	return `
	<div class="card" style="width: 18rem; display: inline-block;">
		<img src="${product.imageURL}" class="card-img-top">
		<div class="card-body">
			<h5 class="card-title">${product.name}</h5>
	  		<p class="card-text">${Util.currency(product.price)} <br> 
			  ${product.summary}
			</p>
			<div class="container pt-3 bg-light ${Auth.currentUser ? 'd-block' : 'd-none'}">
				<form method="post" class="d-inline"> 
					<input type="hidden" name="index" value="${index}">
					<button class= "btn btn-outline-danger" type="submit">&minus;</button>  
				</form>
				<div class ="container rounded text-center text-white bg-primary d-inline-block w-50">
					${product.qty == null || product.qty == 0 ? 'Add' : product.qty} 
				</div>
				<form method="post" class="d-inline"> 
				<input type="hidden" name="index" value="${index}">
				<button class= "btn btn-outline-primary" type="submit">&plus;</button>  
			</form>
			</div>

		</div>
  	</div>
	`;

}