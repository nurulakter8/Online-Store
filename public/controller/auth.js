import * as Element from '../view/element.js'
import * as FirebaseController from './firebase_controller.js'
import * as Util from '../view/util.js'
import * as Constant from '../model/constant.js'
import * as Route from './route.js'
import * as Home from '../view/home_page.js'


export let currentUser;

export function addEventListneres(){

	Element.formSignIn.addEventListener('submit', async e => {
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;

		try {
			await FirebaseController.signIn(email, password);
			Element.modalSignin.hide();
		} catch (e) {
			if(Constant.DEV) console.log(e);
			Util.info('Sign in error', JSON.stringify(e), Element.modalSignin);

		}
	})

	Element.menuSignout.addEventListener('click', async () => {
		try {
			await FirebaseController.signOut();
		} catch (e) {
			if(Constant.DEV) console.log(e);
			Util.info('Sign out error', JSON.stringify(e));
		}
	})

	firebase.auth().onAuthStateChanged( async user => {
		if (user) {
			currentUser = user;

			Home.initShoppingCart();

			let elements = document.getElementsByClassName('modal-pre-auth');
			for (let i = 0; i < elements.length; i++){
				elements[i].style.display = 'none';
			}

			 elements = document.getElementsByClassName('modal-post-auth');
			for (let i = 0; i < elements.length; i++){
				elements[i].style.display = 'block';
			}
			const pathname = window.location.pathname;
			const hash = window.location.hash;
			Route.routing(pathname,hash);
		} else {
			currentUser = null;
			let elements = document.getElementsByClassName('modal-pre-auth');
			for (let i = 0; i < elements.length; i++){
				elements[i].style.display = 'block';
			}

			 elements = document.getElementsByClassName('modal-post-auth');
			for (let i = 0; i < elements.length; i++){
				elements[i].style.display = 'none';
			}
			history.pushState(null, null, Route.routePathname.HOME);
			const pathname = window.location.pathname;
			const hash = window.location.hash;
			Route.routing(pathname,hash);
		}
	})

}