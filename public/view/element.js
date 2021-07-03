//root
export const root = document.getElementById('root')

//top menus
export const menuSignIn = document.getElementById('menu-signin')
export const menuHome = document.getElementById('menu-home')
export const menuPurchase = document.getElementById('menu-purchases')
export const menuSignout = document.getElementById('menu-signout')
export const menuCart = document.getElementById('menu-cart')
export const menuProfile = document.getElementById('menu-profile')
export const shoppingCartCount = document.getElementById('shoppingcart-count')


//forms 
export const formSignIn = document.getElementById('form-signin')
export const formSignUp = document.getElementById('form-signup')
export const formsignuppassworderror = document.getElementById('form-signup-password-error');

export const buttonSignup = document.getElementById('button-signUp')


//modals 
export const modalSignin = new bootstrap.Modal(document.getElementById('modal-signin'), {backdrop: 'static'});
export const modalInfo = new bootstrap.Modal(document.getElementById('modal-info'), {backdrop: 'static'});
export const modalInfoTitle = document.getElementById('modal-info-title');
export const modalInfobody = document.getElementById('modal-info-body');
export const modalTransactionView = new bootstrap.Modal(document.getElementById('modal-transaction-view'), {backdrop: 'static'});
export const modalTransactionViewTitle = document.getElementById('modal-transaction-view-title');
export const modalTransactionViewBody = document.getElementById('modal-transaction-body');
export const modalsignup = new bootstrap.Modal(document.getElementById('modal-signup'), {backdrop: 'static'});
