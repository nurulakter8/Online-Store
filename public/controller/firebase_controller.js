export async function signIn (email, password){
	await firebase.auth().signInWithEmailPassword(email,password);
}
