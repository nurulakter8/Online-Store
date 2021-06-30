import * as Element from './element.js'

export function info(title, body, closeModal){
	if(closeModal) closeModal.hide();

	Element.modalInfoTitle.innerHTML = title;
	Element.modalInfobody.innerHTML = body;
	Element.modalInfo.show();

}