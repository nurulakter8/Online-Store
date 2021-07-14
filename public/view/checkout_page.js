import * as Element from './element.js'
import * as Auth from '../controller/auth.js'
import * as Home from './home_page.js'

export function donate_page() {
	if (!Auth.currentUser) {
		Element.root.innerHTML = '<h1> Not allowed</h1>'
		return;
	}
	const cart = Home.cart;

	Element.root.innerHTML =
		`
		<div class="card" style="text-align:center">
			<img src="/images/donate.png" alt="Donate" width="240" height="130" class="center">
			<p>Please Donate</p>
			<div style="font-size: 150%;"> 
			Tip: $10.00
		</div>
			<button id="checkout-button">Continue</button>
		</div>
	`;
	
	  const checkoutButton = document.getElementById('checkout-button')
	  const createStripeCheckout = firebase.functions().httpsCallable('createStripeCheckout')
	  const stripe = Stripe('pk_test_51J6Tc7LDUwi9TcIfw7HM6X52IqstqqqT2UGuS6cuFHlxVOXOqc7yTfHZwOpHLldC2isoJsWXrrkdYV0IqKzD6sm400xw3t2XeL')
	  
	  checkoutButton.addEventListener('click', () => {
		createStripeCheckout()
		  .then(response => {
			const sessionId = response.data.id
			stripe.redirectToCheckout({ sessionId: sessionId })
		  })
	  })

}