//root
export const root = document.getElementById('root')

//top menus
export const menuSignIn = document.getElementById('menu-signin')
export const menuHome = document.getElementById('menu-home')
export const menuPurchase = document.getElementById('menu-purchases')
export const menuSignout = document.getElementById('menu-signout')
export const menuCart = document.getElementById('menu-cart')
export const menuProfile = document.getElementById('menu-profile')

//forms 
export const formSignIn = document.getElementById('form-signin')


//modals 
export const modalSignin = new bootstrap.Modal(document.getElementById('modal-signin'), {backdrop: 'static'});
export const modalInfo = new bootstrap.Modal(document.getElementById('modal-info'), {backdrop: 'static'});
export const modalInfoTitle = document.getElementById('modal-info-title');
export const modalInfobody = document.getElementById('modal-info-body');
