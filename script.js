const urlBase = 'http://group15.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = [];

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("login-username").value;
	let password = document.getElementById("login-password").value;
//	var hash = md5( password );
	
	document.getElementById("login-result").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("login-result").innerHTML = "User/Password combination incorrect";
					document.getElementById("login-result-container").classList.add("login-result-container-present");
					document.getElementById("login-result").classList.add("login-result-container-present-text");
					return;
				}

				else
				{
					document.getElementById("login-result-container").classList.remove("login-result-container-present");
					document.getElementById("login-result").classList.remove("login-result-container-present-text");
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("login-result").innerHTML = err.message;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}   

function doRegister()
{   
    let login = document.getElementById("signup-username").value;
    let password = document.getElementById("signup-password").value;
  	firstName = document.getElementById("firstname").value;
  	lastName = document.getElementById("lastname").value;

    let tmp = {login:login,password:password,firstName,lastName};
	//  var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify( tmp );
    
    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse( xhr.responseText );
                userId = jsonObject.id;
        
                if( userId < 1 )
                {       
          			console.log("Registration failed");
                    return;
                }
        
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
    
                document.getElementById("signup-result").innerHTML = "Successfully Added User!";
				document.getElementById("signup-result-container").classList.add("signup-result-container-present");
				document.getElementById("signup-result").classList.add("signup-result-container-present-text");
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
    	console.log("Registration failed");
    }
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}

	else
	{
		document.getElementById("firstname-contact-page-message").innerHTML = firstName;
		document.getElementById("lastname-contact-page-message").innerHTML = lastName;
	}
}

// NOT FUNCTIONAL YET
function loadContacts()
{
	let tmp = 
	{
        search: "",
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == 4 && this.status == 200) 
			{
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) 
				{
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) 
				{
                    ids[i] = jsonObject.results[i].ID
                    text += "<tr id='row" + i + "'>"
                    text += "<td id='firstNameRow" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>"; // might have to change field name
                    text += "<td id='lastNameRow" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>"; // might have to change field name
                    text += "<td id='emailRow" + i + "'><span>" + jsonObject.results[i].EmailAddress + "</span></td>"; // might have to change field name
                    text += "<td id='phoneRow" + i + "'><span>" + jsonObject.results[i].PhoneNumber + "</span></td>"; // might have to change field name
                    text += "<td>" +
                        "<button id='editButton" + i + "' onclick='editRow(" + i + ")'>" + "</button>" +
                        "<button id='deleteButton" + i + "' onclick='deleteRow(" + i + ")' '>" + "</button>" + "</td>";
                    text += "<tr/>"
                }
                text += "</table>"
                document.getElementById("contacts-container").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } 
	catch (err) 
	{
        console.log(err.message);
    }
}

// NOT FUNCTIONAL YET
function addContact()
{
	let firstName = document.getElementById("create-contact-firstname").value;
	let lastName = document.getElementById("create-contact-lastname").value;
	let email = document.getElementById("create-contact-email").value;
	let phone = document.getElementById("create-contact-phone").value;

	if (!validAddContact(firstName, lastName, email, phone))
	{
		// invalid contact info
		console.log("CONTACT INFO NOT VALID!"); // debugging
		return;
	}

	let tmp = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phone,
        emailAddress: email,
        userId: userId
    };

	let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == 4 && this.status == 200) 
			{
                console.log("Contact has been added");
                // Clear input fields in form 
                // document.getElementById("addMe").reset();
                // reload contacts table and switch view to show
                // loadContacts();
                // showTable();
            }
        };
        xhr.send(jsonPayload);
    } 
	catch (err) 
	{
        console.log(err.message);
    }
}

function validAddContact(firstName, lastName, email, phone)
{
	let contactError = false;

	if (firstName == "" || lastName == "" || email == "" || phone == "")
	{
		contactError = true;
	}

	let validEmailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

	if (validEmailRegex.test(email) == false)
	{contactError = true;
	}

	let validPhoneRegex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

	if (validPhoneRegex.test(phone) == false)
	{
		contactError = true;
	}

	return !contactError;
}

// NOT FUNCTIONAL YET
function deleteRow(rowNumber) 
{
    var namef_val = document.getElementById("first_Name" + rowNumber).innerText;
    var namel_val = document.getElementById("last_Name" + rowNumber).innerText;
    nameOne = namef_val.substring(0, namef_val.length);
    nameTwo = namel_val.substring(0, namel_val.length);

    let check = confirm('Are you sure you want to delete: ' + nameOne + ' ' + nameTwo + '?');

    if (check === true) 
	{
        document.getElementById("row" + rowNumber + "").outerHTML = "";
        let tmp = 
		{
            firstName: nameOne, // might have to change field name
            lastName: nameTwo, // might have to change field name
            userId: userId // might have to change field name
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try 
		{
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) 
				{

                    console.log("Contact has been deleted");
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } 
		catch (err) 
		{
            console.log(err.message);
        }
    };
}