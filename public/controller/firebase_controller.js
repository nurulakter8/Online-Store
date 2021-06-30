
import * as Constant from '../model/constant.js'
import { Products } from '../model/Product.js';

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