function validation(values){
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.username === ""){
        error.username = "Username should not be empty"
    }
    else {
        error.username = ""
    }

    if(values.org_id === ""){
        error.org_id = "Organization ID should not be empty"
    }
    else {
        error.org_id = ""
    }

    if(values.email === ""){
        error.email = "Email should not be empty"
    }
    else if (!email_pattern.test(values.email)) {
        error.email = "Email didn't match"

    } else {
        error.email = ""
    }

    if(values.password === "") {
        error.password = "Password should not be empty"

    }
    else if(!password_pattern.test(values.password)) {
        error.password = "Password doesn't meet requirements"

    } else {
        error.password = ""
    }
    return error;

}

export default validation;