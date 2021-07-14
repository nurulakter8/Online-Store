import * as Auth from '../controller/auth.js'
import * as Element from './element.js'
import * as FirebaseController from '../controller/firebase_controller.js';
import * as Utill from './util.js'
import * as Constant from '../model/constant.js'
import * as Route from '../controller/route.js'
import { home_page } from './home_page.js';
import { Reply } from '../model/Reply.js';


// export function addEventListeners(){
// 	Element.reviewDirect.addEventListener('click', () => {
// 		history.pushState(null,null, Route.routhPath.REVIEW);
// 		review_page();
// 	})
// }

export function addviewButtonListeners() {

	const viewButtonForms = document.getElementsByClassName('form-review');
	for (let i = 0; i < viewButtonForms.length; i++) {
		addViewFormSubmitEvent(viewButtonForms[i])
	}

}

export function addViewFormSubmitEvent(form) {
	form.addEventListener('submit', async e => {
		e.preventDefault();

		const button = e.target.getElementsByTagName('button')[0]; // submit create button
		const label = Utill.disableButton(button);

		const productId = e.target.productId.value;
		history.pushState(null, null, Route.routePathname.REVIEW + '#' + productId);
		await review_page(productId);
		Utill.enableButton(button, label);
	})
}


export async function review_page(productId) {
	// if (!Auth.currentUser) {
	// 	Element.root.innerHTML = '<h1> Protected Page<h1>'
	// 	return
	// }

	// if (!productId) {
	// 	Utill.info('Error', 'Thread Id is null; Invalid access')
	// 	return;
	// }

	//1. get thread form firestore by id 
	let product;
	let replies;

	try {
		product = await FirebaseController.getOneThread(productId)
		if (!product) {
			history.pushState(null, null, Route.routePathname.HOME);
			return;
		}
		replies = await FirebaseController.getReplayList(productId)
	} catch (e) {
		if (Constant.DEV) console.log(e);
		Utill.info('Error', JSON.stringify(e))
		return;

	}

	//3. display this thread
	let html = `
	<div class = "centered">
		<h2 class = "text-black"> Reviews </h2>
	</div>
	<h4 class = "centered text-black"> ${product.name} Price: ${Utill.currency(product.price)}</h4>
	<hr>
`;


	html += '<div id ="message-reply-body">'
	//display all replies 
	if (replies && replies.length > 0) {
		replies.forEach(r => {
			html += buildReplyView(r)
		})
	}
	html += '</div>'

	//add new reply 
	html += `
		<div>
			<textarea id="textarea-add-new-reply" placeholder="Review this product"> </textarea>
			<br>
			<button id="button-add-new-reply" class="btn btn-outline-info"> Post review </button>
		</div>
	`;
	Element.root.innerHTML = html;
	document.getElementById('button-add-new-reply').addEventListener('click', async () => {

		try {
			const content = document.getElementById('textarea-add-new-reply').value;
			const uid = Auth.currentUser.uid;
			const email = Auth.currentUser.email;
			const timestamp = Date.now();
			const reply = new Reply({
				uid, email, timestamp, content, productId
			});

			const button = document.getElementById('button-add-new-reply');
			const label = Utill.disableButton(button);

			try {
				const docId = await FirebaseController.addReply(reply);
				reply.docId = docId;

			} catch (e) {
				if (Constant.DEV) console.log(e)
				Utill.info('Error', JSON.stringify(e))
			}
			const replyTag = document.createElement('div');
			replyTag.innerHTML = buildReplyView(reply)
			document.getElementById('message-reply-body').appendChild(replyTag);
			document.getElementById('textarea-add-new-reply').value = ''

			Utill.enableButton(button, label);
		} catch (e) {
			if (Constant.DEV) console.log(e)
			Utill.info('Must be signed in to reply', JSON.stringify(e))
		}

	})
}

function buildReplyView(reply) {
	return `
		<div class ="border border-primary"> 
			<div class= "bg-secondary text-white"> 
				Review by ${reply.email} 
			</div> 
			${reply.content}
		</div>
		<hr>
	`;
}