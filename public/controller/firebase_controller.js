
import * as Constant from '../model/constant.js'
import { Products } from '../model/Product.js';
import { ShoppingCart } from '../model/ShoppingCart.js';

export async function signIn (email, password){
	await firebase.auth().signInWithEmailAndPassword(email,password);
}

export async function signOut (){
	await firebase.auth().signOut();

}

export async function getProductList(){
	const products = [];
	const snapShot = await firebase.firestore().collection(Constant.collectioNames.PRODUCTS)
	.orderBy('name')
	.get();

	snapShot.forEach(doc => {
		const p = new Products(doc.data());
		p.docId = doc.id;
		products.push(p);
	})
	return products;
}

export async function checkOut(cart){
	const data = cart.serialize(Date.now());
	await firebase.firestore().collection(Constant.collectioNames.PURCHASE_HISTORY)
				.add(data);
}

export async function getPurchaseHistory(uid){
	const snapShot = await firebase.firestore().collection(Constant.collectioNames.PURCHASE_HISTORY)
						.where('uid', '==', uid)
						.orderBy('timestamp', 'desc')
						.get();

	const carts = [];
	snapShot.forEach(doc => {
		const sc = ShoppingCart.deserialize(doc.data());
		carts.push(sc);
	});
	return carts;
}