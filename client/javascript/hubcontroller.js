const data = {
    _id: "bedrockhub_1dajdw819sassdawdbd21",

    applications: {
      bedrockapp_adwa9wd1sdadwa8wd2: {
        name: "Staff application",
        questions: [
          { question: "Is bedrockbot epic", type: "bool", required: true },
        ],

        responses: [
          {
            id: "bedrockapp_!038112",
            recorded: "31 jan",
            user: "231493257433972736",
            answers: [{ type: "bool", answer: true }],
          },
        ],
      },
    },
    owner: "330979731673710592",
    settings: { discordchannel: "740532211211829368", requireverify: true },
    applicationids: ["bedrockapp_adwa9wd1sdadwa8wd2"],
  };

window.onload = () => {
}
document.getElementById('downloadtest').addEventListener('click', function() {
    console.log(window.location.pathname.split('/')[2])
    fetch(window.location.protocol + "//" + window.location.host + "/files/BedrockBotApps.rbxlx?hubid=" + window.location.pathname.split('/')[2])
  .then(resp => resp.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = 'BedrockBotHub.rbxlx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    alert('File downloaded!'); // or you know, something with better UX...
  })
  .catch(() => alert('Looks like an error occured!'));
})