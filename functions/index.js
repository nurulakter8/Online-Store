const functions = require("firebase-functions");

const admin = require("firebase-admin");

//admin.initializeApp();

const serviceAccount = require("./account_key.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
	// Stripe init
	const stripe = require("stripe")(functions.config().stripe.secret_key);
	const session = await stripe.checkout.sessions.create({
	  payment_method_types: ["card"],
	  mode: "payment",
	  success_url: "http://localhost:5000",
	  cancel_url: "http://localhost:5000",
	  shipping_address_collection: {
		allowed_countries: ["US"],
	  },
	  line_items: [
		{
		  quantity: 1,
		  price_data: {
			currency: "usd",
			unit_amount: (100) * 10, // 100 = 10 USD
			product_data: {
			  name: "Donate",
			},
		  },
		},
	  ],
	});
	return {
		id: session.id,
	  };
});


exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
	const stripe = require("stripe")(functions.config().stripe.token);
	let event;
  
	try {
	  const whSec = functions.config().stripe.payments_webhook_secret;
  
	  event = stripe.webhooks.constructEvent(
		  req.rawBody,
		  req.headers["stripe-signature"],
		  whSec,
	  );
	} catch (err) {
	  console.error("signature verification failed.");
	  return res.sendStatus(400);
	}
  
	const dataObject = event.data.object;
  
	await admin.firestore().collection("orders").doc().set({
	  checkoutSessionId: dataObject.id,
	  paymentStatus: dataObject.payment_status,
	  shippingInfo: dataObject.shipping,
	  amountTotal: dataObject.amount_total,
	});
  
	return res.sendStatus(200);
  });