window.onload = () => {


    function g(cname) {let name = cname + "=";let decodedCookie = decodeURIComponent(document.cookie);let ca = decodedCookie.split(';');for(let i = 0; i <ca.length; i++) {let c = ca[i];while (c.charAt(0) == ' ') {c = c.substring(1);}if (c.indexOf(name) == 0) {return c.substring(name.length, c.length);}}return "";}


    const [accessToken, tokenType] = [g("access_token"), g("token_type")];
    if (!accessToken) {
        return (document.getElementById('login').style.display = 'block');
    }

    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
    .then(result => result.json())
    .then(response => {
        const { username, discriminator } = response;
        //document.getElementById('info').innerText += ` ${username}#${discriminator}`;
            
    })
    .catch(console.error);

    fetch(window.location.protocol + "//" + window.location.host + '/api/roblox/users/', {
            headers: {
                type: `discord`,
                authorization: `${tokenType} ${accessToken}`,
            },
        })
        .then(result => result.json())
        .then(response => {
            if (response.name) {
                const { name } = response;
                //document.getElementById('linker').innerText = `Roblox account: ${name}`;
            }
                
        })
    .catch(console.error);
    
};