const sgMail = require('@sendgrid/mail')

module.exports = {
    init: key => {
        sgMail.setApiKey(key)
    },

    sendVerificationMail: (reciever, code) => {
        sgMail.send({
            to: reciever,
            from: 'Travellerr <admin@app.traveller.com>',
            subject: 'Your Email Verification Code',
            html: `
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
                        crossorigin="anonymous">
                    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
                </head>

                <body style="font-family: 'Roboto', sans-serif">
                    <div class="container text-center">
                        <h1>Your Verification Code!</h1>
                        <p class="display-1">${code}</p>
                    </div>
                </body>
          `
        })
    }
}