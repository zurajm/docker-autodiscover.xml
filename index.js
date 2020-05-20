'use strict';

const url 			= require('url');
const path			= require('path');
const fs 			= require('fs')
const app			= require('koa')();
const swig			= require('koa-swig');
const body			= require('koa-buddy');
const router		= require('koa-router')();
const settings		= require('./settings.js');
const mobileconfig	= require('mobileconfig');
const r2 			= require("r2");

function findChild(name, children) {
	for (let child of children) {
		if (child.name === name) {
			return child;
		}
	}
}
var nameLookup 
	= "" !== (process.env.NAME_URL || "")
	? async function(email) {
		try
		{
			var data = await r2(process.env.NAME_URL.replace("{{email}}", email)).json;
			var name = data[0][process.env.NAME_PROPERTY];
			return name === undefined ? email : name;
		}
		catch(_)
		{
			return email;
		}
	}
	: async function(email) {
		return email;
	};

// Microsoft Outlook / Apple Mail
router.post('/Autodiscover/Autodiscover.xml', function *autodiscover() {
	this.set('Content-Type', 'application/xml');

	const request	= findChild('Request', this.request.body.root.children);
	const schema	= findChild('AcceptableResponseSchema', request.children);
	const email		= findChild('EMailAddress', request.children).content;
	
	if (!email || !~email.indexOf('@')) {
		this.status = 400;

		return;
	}

	const username	= email.split('@')[0];
	const domain	= email.split('@')[1];

	yield this.render('autodiscover', {
		schema: schema.content,
		hasSync: schema.content.includes("mobilesync"),
		email,
		username,
		domain,
		displayName: yield nameLookup(email)
	});
});

// Thunderbird (/mail/config-v1.1.xml?ememailaddressail=username@domain.com)
router.get('/mail/config-v1.1.xml', function *autoconfig() {
	const email = this.request.query.emailaddress;
	const name = this.request.query.name || email;

	if (!email || !~email.indexOf('@')) {
		this.status = 400;

		return;
	}

	const domain	= email.split('@').pop();
	this.set('Content-Type', 'application/xml');
	yield this.render('autoconfig', {
		email,
		domain
	});
});

// iOS / Apple Mail (/email.mobileconfig?email=username@domain.com)
router.get('/email.mobileconfig', function *autoconfig() {
	const email = this.request.query.email;
	const name = this.request.query.name || email;

	if (!email || !~email.indexOf('@')) {
		this.status = 400;

		return;
	}

	const domain	= email.split('@').pop();
	const filename	= `${domain}.mobileconfig`;

	this.set('Content-Type', 'application/x-apple-aspen-config; chatset=utf-8');
	this.set('Content-Disposition', `attachment; filename="${filename}"`);

	var hostname = (new URL(request.url)).hostname;

	// encryption keys exist, use mobileconfig library
	if (fs.existsSync("/certs/" + hostname + ".key")) {

		yield mobileconfig.getSignedConfig({
			emailAddress: email,
			identifier: domain,
			displayName: 'Email Config',
			description: 'Configures email account',
			organization: domain,

			imap: {
				hostname: settings.imap.host,
				port:  settings.imap.port,
				secure: settings.imap.protocol === 'STARTTLS' || settings.imap.protocol === 'SSL',
				username: email,
			},

			smtp: {
				hostname: settings.smtp.host,
				port:  settings.smtp.port,
				secure: settings.smtp.protocol === 'STARTTLS' || settings.smtp.protocol === 'SSL',
				username: email,
				password: false
			},

			keys: {
				key: fs.readFileSync("/certs/" + hostname + ".key", 'utf8'),
				cert: fs.readFileSync("/certs/" + hostname + ".cert", 'utf8')
			}
		}, 
		function(err, data)
		{
			this.body = data;
		});
	}
	else
	{
		yield this.render('mobileconfig', {
			email,
			name,
			domain
		});
	}
});

app.context.render = swig({
	root: path.join(__dirname, 'views'),
	autoescape: true,
	cache: 'memory',
	ext: 'xml',
	locals: settings
});

app.use(function *fixContentType(next) {
	let type = this.request.headers['content-type'];

	if (type && type.indexOf('text/xml') === 0) {
		let newType = type.replace('text/xml', 'application/xml');

		this.request.headers['content-type'] = newType;
	}

	yield next;
});

app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT || 8000);
