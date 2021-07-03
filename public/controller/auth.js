import * as Element from '../view/element.js'
import * as FirebaseController from './firebase_controller.js'
import * as Util from '../view/util.js'
import * as Constant from '../model/constant.js'
import * as Route from './route.js'
import * as Home from '../view/home_page.js'
import * as Profile from '../view/profile_page.js'

export let currentUser;

export function addEventListneres(){

	Element.formSignIn.addEventListener('submit', async e => {
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;
		const button = e.target.getElementsByTagName('button')[0];
		const label = Util.disableButton(button);
		try {
			await FirebaseController.signIn(email, password);
			Element.modalSignin.hide();
		} catch (e) {
			if(Constant.DEV) console.log(e);
			Util.info('Sign in error', JSON.stringify(e), Element.modalSignin);

		}
		Util.enableButton(button,label);
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

			await Profile.getAccountInfo(user);

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

	Element.buttonSignup.addEventListener('click', ()=>{
		Element.modalSignin.hide();
		Element.formSignUp.reset();
		Element.formsignuppassworderror.innerHTML ='';
		Element.modalsignup.show();
	})

	Element.formSignUp.addEventListener('submit', async e=> {
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;
		const passwordConfirm = e.target.passwordConfirm.value;

		Element.formsignuppassworderror.innerHTML = ''
		if(password != passwordConfirm){
			Element.formsignuppassworderror.innerHTML = 'Two password do not match';
			return;
		}

		try {
			await FirebaseController.createUser(email,password);
			Util.info('Account Created', `You are now signed in as ${email}`, Element.modalsignup);
		} catch (e) {
			if (Constant.DEV) console.log(e);
			Util.info(' error ', JSON.stringify(e), Element.modalsignup);
		}
	})

}