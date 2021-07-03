import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Auth from '../controller/auth.js'
import * as util from './util.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'


export function addEventListneres() {
	Element.menuProfile.addEventListener('click', async () => {
		history.pushState(null, null, Route.routePathname.PROFILE)
		await profile_page();
	});

}

let accountInfo;

export async function profile_page() {
	let html = '<h1>Profile Page</h1>';
	if (!Auth.currentUser) {
		html += '<h2>Protected Page</h2>'
		Element.root.innerHTML = html;
		return;
	}

	if (!accountInfo) {
		html += `<h2>Failed to retrieve account info for ${Auth.currentUser.email} </h2>`
		Element.root.innerHTML = html;
		return;
	}

	html += `
		<div class ="alert alert-primary">
			Email: ${Auth.currentUser.email} (cannot change email as login name)
		</div>
	`;

	html += `
	<form class ="form-profile" method="post">
		<table>
		<tr>
			<td width="15%">Name:</td>
			<td width="60%">
				<input type="text" name="name" value="${accountInfo.name}" placeholder="Firstname Lastname" disable required
					pattern="^[A-Za-z][A-Za-z|'|-| ] +">
			</td>
			<td>${actionButtons()}</td>
		</tr>
		</table>
	</form>
`;

	Element.root.innerHTML = html;
}

function actionButtons(){
	return `
	<button type="submit" class="btn btn-outline-primary">Edit</button>
	<button type="submit" class="btn btn-outline-danger" style="display: none;">Update</button>
	<button type="submit" class="btn btn-outline-secondary" style="display: none;">Cancel</button>
	`;
}

export async function getAccountInfo(user) {
	try {
		accountInfo = await FirebaseController.getAccountInfo(user.uid);
	} catch (e) {
		if (Constant.DEV) console.log(e);
		util.info(`Failed to retrieve account info for ${user.email}`, JSON.stringify(e));
		accountInfo = null;
		return;
	}
	Element.menuProfile.innerHTML = `
		<img src=${accountInfo.photoURL} class="rounded-circle" height="30px">
	`;
}