import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import { ShoppingCart } from '../model/ShoppingCart.js'
import * as Review from './review_page.js'
import * as Wish from './wishlist_page.js'



export function addEventListneres() {
	Element.menuHome.addEventListener('click', async () => {
		history.pushState(null, null, Route.routePathname.HOME)
		const label = Util.disableButton(Element.menuHome);
		await home_page();
		Util.enableButton(Element.menuHome, label);

	});


}

export let cart;
// export let wish;

export async function home_page() {

	let html = '<h1>Available Products</h1>';

	let products;
	let productsWish;

	try {
		products = await FirebaseController.getProductList();
		if (cart) {
			cart.items.forEach(item => {
				const product = products.find(p => item.docId == p.docId)
				product.qty = item.qty;
			})
		}
	} catch (e) {
		if (Constant.DEV) console.log(e);
		Util.info('cannot get product list', JSON.stringify(e));
		return;
	}
	/// wish

	// try {
	// 	productsWish = await FirebaseController.getProductList();
	// 	if (wish) {
	// 		wish.items.forEach(item => {
	// 			const product = productsWish.find(p => item.docId == p.docId)
	// 			product.qty = item.qty;
	// 		})
	// 	}
	// } catch (e) {
	// 	if (Constant.DEV) console.log(e);
	// 	Util.info('cannot get product list', JSON.stringify(e));
	// 	return;
	// }

	for (let i = 0; i < products.length; i++) {
		html += buildProductCard(products[i], i);

	}
	Element.root.innerHTML = html;

	const decForms = document.getElementsByClassName('form-dec-qty');
	for (let i = 0; i < decForms.length; i++) {
		decForms[i].addEventListener('submit', e => {
			e.preventDefault();
			const p = products[e.target.index.value];
			// dec p to
			cart.removeItem(p);
			document.getElementById('qty-' + p.docId).innerHTML = (p.qty == null || p.qty == 0) ? 'Add' : p.qty;
			Element.shoppingCartCount.innerHTML = cart.getTotalQty();
		})
	}
	const incForms = document.getElementsByClassName('form-inc-qty');
	for (let i = 0; i < decForms.length; i++) {
		incForms[i].addEventListener('submit', e => {
			e.preventDefault();
			const p = products[e.target.index.value];
			// add p to shopping
			cart.addItem(p);
			document.getElementById('qty-' + p.docId).innerHTML = p.qty;
			Element.shoppingCartCount.innerHTML = cart.getTotalQty();

		})

	}

	const wishForm = document.getElementsByClassName('form-fav');
	for (let i = 0; i < wishForm.length; i++) {
		wishForm[i].addEventListener('submit', e => {
			e.preventDefault();

			// FirebaseController.addFav(wishForm[i]);
			const p = products[e.target.index.value];
			// add p to shopping
			cart.addItem(p);
			document.getElementById('qty-' + p.docId).innerHTML = p.qty;
			Element.shoppingCartCount.innerHTML = cart.getTotalQty();

		})

	}

	const reviewForm = document.getElementsByClassName('form-review');
	for (let i = 0; i < reviewForm.length; i++) {
		reviewForm[i].addEventListener('submit', e => {
			e.preventDefault();
			Review.addviewButtonListeners();
			Review.addViewFormSubmitEvent(reviewForm[i])
		})
	}

	const deleteForms = document.getElementsByClassName('form-delete-product');
	for (let i = 0; i < deleteForms.length; i++) {
		deleteForms[i].addEventListener('submit', async e=>{
			e.preventDefault();
			if(!window.confirm("Press OK to delete")) return; // cancle button pressed
			const button = e.target.getElementsByTagName('button')[0];
			const label = Util.disableButton(button)
			await Auth.delete_product(e.target.docId.value, e.target.imageName.value);
			Util.enableButton(button, label);
		});
		
	}
}

export function buildProductCard(product, index) {
	return `
	<div class="card" style="width: 18rem; display: inline-block;">
		<img src="${product.imageURL}" class="card-img-top">
		<div class="card-body">
			<h5 class="card-title">${product.name}</h5>
	  		<p class="card-text">${Util.currency(product.price)} <br> 
			  ${product.summary}
			</p>

			<div>
				<form method="post" class="d-inline form-review">
				<input type="hidden" name="productId" value="${product.docId}">
					<button class= "btn btn-outline-primary" type="submit">Reviews</button> 
				</form>
			</div>

			<div>
			<form method="post" class="d-inline form-fav">
			<input type="hidden" name="index" value="${index}">
				<button class= "btn btn-outline-primary" type="submit">Favorite</button> 
			</form>
			</div>

			<div> 
			<form class = "form-delete-product" method ="post">
			<input type = "hidden" name="docId" value="${product.docId}">
			<input type = "hidden" name="imageName" value="${product.imageName}">
			<button class= "btn btn-outline-danger" type="submit">Delete</button>  
			</form>
			</div> 

			<br>

			<div class="container pt-3 bg-dark ${Auth.currentUser ? 'd-block' : 'd-none'}">
				<form method="post" class="d-inline form-dec-qty"> 
					<input type="hidden" name="index" value="${index}">
					<button class= "btn btn-outline-danger" type="submit">&minus;</button>  
				</form>
				<div id="qty-${product.docId}" class ="container rounded text-center text-white bg-primary d-inline-block w-50">
					${product.qty == null || product.qty == 0 ? 'Add' : product.qty} 
				</div>
				<form method="post" class="d-inline form-inc-qty"> 
				<input type="hidden" name="index" value="${index}">
				<button class= "btn btn-outline-primary" type="submit">&plus;</button>  
			</form>
			</div>

		</div>
  	</div>
	`;

}

export function initShoppingCart() {

	const carString = window.localStorage.getItem('cart-' + Auth.currentUser.uid);
	cart = ShoppingCart.parse(carString);
	if (!cart || !cart.isValid() || cart.uid != Auth.currentUser.uid) {
		window.localStorage.removeItem('cart-' + Auth.currentUser.uid);
		cart = new ShoppingCart(Auth.currentUser.uid);
	}

	Element.shoppingCartCount.innerHTML = cart.getTotalQty();
}