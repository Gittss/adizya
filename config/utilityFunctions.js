exports.handleValidationError = (err,body)=>{
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'name':
                body['nameError']=err.errors[field].message;
                break;
            case 'email':
                body['emailError']=err.errors[field].message;
                break;
            case 'password':
                body['passwordError']=err.errors[field].message;
                break;
            case 'phoneNumber':
                body['phoneNumberError']=err.errors[field].message;
                break;
            case 'address':
                body['addressError']=err.errors[field].message;
                break;
            case 'dresscode':
                body['dresscodeError']=err.errors[field].message;
                break;
            case 'price':
                body['priceError']=err.errors[field].message;
                break;
            default: break;
        }
    }
}