import { Alert } from 'react-native'
const API_KEY = 'AIzaSyATUMwesuBSiCA2QdvsDsH1immr8BBKen0'  //put you key here

const endpoint = {
    login : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
}

export const userLogin = async (user) => {
    return "rajivse2007@gmail.com"
    const response = await fetch(endpoint.login,{
        method : 'POST',
        headers : { 
            'Content-Type' : 'application/json' 
        },
        body : JSON.stringify({
            username : user.username,
            password : user.password,
            returnSecureToken : true
        })
    })
    //if(!response.ok) throw new Error('Something Went Wrong!!');
    //const responseData = await response.json()
    return "rajivse2007@gmail.com"
}