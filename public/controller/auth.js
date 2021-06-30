import * as Element from '../view/element.js'
import * as FirebaseController from './firebase_controller.js'

export function addEventListneres(){

	Element.formSignIn.addEventListener('submit', async e => {
		e.preventDefault();
		const email = e.target.email.value;
		const password = e.target.password.value;

		try {
			await FirebaseController.signIn(email, password);
			Element.modalSignin.hide();
		} catch (e) {
			console.log(e)		
		}
	})

}