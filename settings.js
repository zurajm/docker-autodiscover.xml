module.exports = {

	sync: process.env.SYNC_URL || "",// https://sync.domain.com/Microsoft-Server-ActiveSync

	enroll: process.env.ENROLL_URL || "", // https://cert.domain.com/CertEnroll
	hasEnroll: "" !== (process.env.ENROLL_URL || ""),

	culture: process.env.CULTURE || "", // en:us
	hasCulture: "" !== (process.env.CULTURE || ""),

	imap: {
		host: process.env.IMAP_HOST,
		port: process.env.IMAP_PORT,
		protocol: process.env.IMAP_PROTOCOL || "STARTTLS",
		authType: process.env.IMAP_AUTHTYPE || "password-cleartext",
		isStartTls: (process.env.IMAP_AUTHTYPE || "STARTTLS") === 'STARTTLS'
	},

	smtp: {
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		protocol: process.env.SMTP_PROTOCOL || "STARTTLS",
		authType: process.env.SMTP_AUTHTYPE || "password-cleartext",
		isStartTls: (process.env.SMTP_PROTOCOL || "STARTTLS") === 'STARTTLS'
	}
};
