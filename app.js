const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
    origin: 'https://portfolio-deepak-bhagat-git-main-deepak-bhagats-projects.vercel.app'
}));

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// POST route to handle form submission
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Create a transporter object using SMTP
    let transporter = nodemailer.createTransport({
        service: 'Gmail', // Or another email service like SendGrid
        auth: {
            user: process.env.EMAIL, // Your email address
            pass: process.env.PASSWORD, // Your email password or App password
        },
    });

    // Email options
    let mailOptions = {
        from: email, // Sender address
        to: process.env.OWNER_EMAIL, // Owner's email address
        subject: `New Contact Form Submission from ${name}`,
        text: message,
        html: `<p>You have a new contact form submission</p>
               <h3>Contact Details</h3>
               <ul>
                   <li>Name: ${name}</li>
                   <li>Email: ${email}</li>
               </ul>
               <h3>Message</h3>
               <p>${message}</p>`,
    };

    // Send email
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ error: 'Error sending email' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
