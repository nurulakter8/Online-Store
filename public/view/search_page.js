import * as Element from './element.js'
import * as Utill from './util.js'
import * as Auth from '../controller/auth.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Home from './home_page.js'
import * as Route from '../controller/route.js'

export function addEventListener(){
	Element.formSearch.addEventListener('submit', async e=> {
		e.preventDefault();
		const searchKeys = e.target.searchKeys.value.trim();
		if(searchKeys.length == 0){
			Utill.info('Error, no search keys')
			return;
		}
		const button = Element.formSearch.getElementsByTagName('button')[0];
		const lable = Utill.disableButton(button);


		const searchKeysInArray = searchKeys.toLowerCase().match(/\S+/g);
		const joinedSearchKeys = searchKeysInArray.join('+')
		history.pushState(null, null, Route.routePathname.SEARCH + '#' + joinedSearchKeys);
		await search_page(joinedSearchKeys);
		Utill.enableButton(button,lable);
		
	})
}

export async function search_page(joinedSearchKeys){
	if(!joinedSearchKeys){
		Utill.info('Error', 'no search keys')
		return;

	}


	const searchKeysInArray = joinedSearchKeys.split('+');
	if(searchKeysInArray.length == 0){
		Utill.info('Error', 'no search keys')
		return
	}

	if(!Auth.currentUser){
		Element.root.innerHTML = '<h1>Protected Page</h1>'
	}

	let productList;
	try {
		productList = await FirebaseController.searchThreads(searchKeysInArray);

	} catch (e) {
		if(Constant.DEV) console.log(e)
		Utill.info('search Error', JSON.stringify(e))
		return;
	}

	Home.buildProductCard(productList);

}