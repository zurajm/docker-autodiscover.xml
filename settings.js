module.exports = {
	sync: process.env.SYNC_URL || "",
	hasSync: process.env.SYNC_URL !== (process.env.SYNC_URL || ""),
	imap: {
		host: process.env.IMAP_HOST,
		port: process.env.IMAP_PORT,
		protocol: process.env.IMAP_PROTOCOL || "STARTTLS",
		authType: process.env.IMAP_AUTHTYPE || "password-cleartext",
		isStartTls: process.env.IMAP_PROTOCOL === 'STARTTLS'
	},
	smtp: {
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		protocol: process.env.SMTP_PROTOCOL || "STARTTLS",
		authType: process.env.SMTP_AUTHTYPE || "password-cleartext",
		isStartTls: process.env.SMTP_PROTOCOL === 'STARTTLS'
	}
};
