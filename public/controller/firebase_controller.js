
import { AccountInfo } from '../model/account_info.js';
import * as Constant from '../model/constant.js'
import { Products } from '../model/Product.js';
import { Reply } from '../model/Reply.js';
import { ShoppingCart } from '../model/ShoppingCart.js';

export async function signIn (email, password){
	await firebase.auth().signInWithEmailAndPassword(email,password);
}

export async function signOut (){
	await firebase.auth().signOut();

}

export async function resetPassword(email) {
	await firebase.auth().sendPasswordResetEmail(email)
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

export async function createUser(email, password){
	await firebase.auth().createUserWithEmailAndPassword(email,password);
}

export async function getAccountInfo(uid) {
	const doc = await firebase.firestore().collection(Constant.collectioNames.ACCOUNT_INFO)
					.doc(uid).get();
	if (doc.exists) {
		return new AccountInfo(doc.data());
	} else {
		const defaultInfo = AccountInfo.instance();
		await firebase.firestore().collection(Constant.collectioNames.ACCOUNT_INFO)
				.doc(uid).set(defaultInfo.serialize());
		return defaultInfo;
	}
}

export async function updateaAccountInfo(uid, updateInfo){
	await firebase.firestore().collection(Constant.collectioNames.ACCOUNT_INFO)
			.doc(uid).update(updateInfo);
}

export async function uploadProfilePhoto(photoFile, imageName){
	const ref = firebase.storage().ref()
					.child(Constant.storageFolderNames.PROFILE_PHOTOS + imageName)
	const taskSnapShot = await ref.put(photoFile);
	const photoURL = await taskSnapShot.ref.getDownloadURL();
	return photoURL;
}


export async function getOneThread(productId) {
	const ref = await firebase.firestore()
		.collection(Constant.collectioNames.PRODUCTS)
		.doc(productId)
		.get();
	if (!ref.exists) return null;
	const t = new Products(ref.data());
	t.docId = productId;
	return t;
}

export async function getReplayList(productId) {
	const snapshot = await firebase.firestore()
		.collection(Constant.collectioNames.REPLIES)
		.where('productId', '==', productId)
		.orderBy('timestamp')
		.get();

	const replies = [];
	snapshot.forEach(doc => {
		const r = new Reply(doc.data())
		r.docId = doc.id;
		replies.push(r);
	})
	return replies;
}

export async function addReply(reply) {
	const ref = await firebase.firestore()
		.collection(Constant.collectioNames.REPLIES)
		.add(reply.serialize());
	return ref.id;
}

export async function searchThreads(keywordsArray) {
	let productList = []
	const snapshot = await firebase.firestore()
		.collection(Constant.collectioNames.PRODUCTS)
		.where('keywordsArray', 'array-contains-any', keywordsArray)
		.orderBy('timestamp', 'desc')
		.get();

	snapshot.forEach(doc => {
		const t = new Products(doc.data())
		t.docId = doc.id;
		productList.push(t)
	});
	return productList;
}

export async function deleteForm(form) {
	await firebase.firestore()
		.collection(Constant.collectioNames.PURCHASE_HISTORY)
		.doc(form)
		.delete();  // sql = primary key
}