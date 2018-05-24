module.exports = {
	domain: process.env.DOMAIN,
	imap: {
		host: process.env.IMAP_HOST,
		port: process.env.IMAP_PORT,
		protocol: process.env.IMAP_PROTOCOL || "SSL",
		authtype: process.env.IMAP_AUTHTYPE || "password-cleartext"
	},
	smtp: {
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		protocol: process.env.SMTP_PROTOCOL || "STARTTLS",
		authtype: process.env.SMTP_AUTHTYPE || "password-cleartext"
	}
};
