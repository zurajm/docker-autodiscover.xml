# autodiscover-email-settings

[![Docker Pulls](https://img.shields.io/docker/pulls/barfittc/autodiscover.svg)](https://hub.docker.com/r/barfittc/autodiscover/)

This service is created to autodiscover your provider email settings.

It provides IMAP/SMTP Autodiscover capabilities on Microsoft Outlook/Apple Mail, Autoconfig capabilities for Thunderbird, and Configuration Profiles for iOS/Apple Mail.

This is a clone of weboaks/autodiscover-email-settings and has had extra variables added to allow for STARTTLS and different Password Types


### DNS settings

```
autoconfig              IN      A      {{$AUTODISCOVER_IP}}
autodiscover            IN      A      {{$AUTODISCOVER_IP}}
imap                    IN      CNAME  {{$MX_DOMAIN}}.
smtp                    IN      CNAME  {{$MX_DOMAIN}}.
@                       IN      MX 10  {{$MX_DOMAIN}}.
@                       IN      TXT     "mailconf=https://autoconfig.{{$DOMAIN}}/mail/config-v1.1.xml"
_imaps._tcp             IN      SRV    0 0 993 {{MX_DOMAIN}}.
_submission._tcp        IN      SRV    0 0 587 {{MX_DOMAIN}}.
_autodiscover._tcp      IN      SRV    0 0 443 autodiscover.{{$DOMAIN}}.
```

Replace above variables with data according to this table

| Variable        | Description                         |
| --------------- | ----------------------------------- |
| MX_DOMAIN       | The hostname name of your MX server |
| DOMAIN          | Your apex/bare/naked Domain         |
| AUTODISCOVER_IP | IP of the Autoconfig HTTP           |

---

### Usage

Put it behind a reverse proxy of your choice

#### docker

```yaml
version: '2'

services:
  autodiscover-domain-com:
    image: barfittc/autodiscover:latest
    environment:
      NAME_URL: "https://api.domain.com/namelookup?email={{email}}&apiKey=12ab34cd"
      NAME_PROPERTY: Display_name
      SYNC_URL: "https://sync.domain.com/Microsoft-Server-ActiveSync"
      ENROLL_URL: "https://cert.domain.com/CertEnroll"
      CULTURE: "en:us"
      SYNC_URL: "https://sync.domain.com/Microsoft-Server-ActiveSync"
      IMAP_HOST: imap.domain.com
      IMAP_PORT: "993"
      IMAP_PROTOCOL: STARTTLS
      IMAP_AUTHTYPE: password-cleartext
      SMTP_HOST: smtp.domain.com
      SMTP_PORT: "587"
      SMTP_PROTOCOL: STARTTLS
      SMTP_AUTHTYPE: password-cleartext
```

#### docker swarm

```yaml
version: '3'

services:
  autodiscover-domain-com:
    image: barfittc/autodiscover:latest
    environment:
      NAME_URL: "https://api.domain.com/namelookup?email={{email}}&apiKey=12ab34cd"
      NAME_PROPERTY: Display_name
      SYNC_URL: "https://sync.domain.com/Microsoft-Server-ActiveSync"
      ENROLL_URL: "https://cert.domain.com/CertEnroll"
      CULTURE: "en:us"
      IMAP_HOST: imap.domain.com
      IMAP_PORT: "993"
      IMAP_PROTOCOL: STARTTLS
      IMAP_AUTHTYPE: password-cleartext
      SMTP_HOST: smtp.domain.com
      SMTP_PORT: "587"
      SMTP_PROTOCOL: STARTTLS
      SMTP_AUTHTYPE: password-cleartext
```

### Notes

SYNC_URL: is optional, point it to your ActiveSync path

The above autoconfiguration methods assume the following:

* Username: `{{email}}` (Entire email address)


### License

This project is distributed under the [MIT License](LICENSE)


### Credits
Forked from https://github.com/harrydeluxe/autodiscover.xml to allow extra Environment Variable for Active Sync, and fixed xml up a bit
Forked from https://github.com/sylvaindumont/autodiscover.xml to allow extra Environment Variables for STARTTLS and Clear/Encrypted Passwords
Inspired from https://github.com/johansmitsnl/docker-email-autodiscover, but with https://github.com/Tiliq/autodiscover.xml instead of https://github.com/gronke/email-autodiscover to allow a much lighter ([![](https://images.microbadger.com/badges/image/weboaks/autodiscover-email-settings.svg)](https://microbadger.com/images/weboaks/autodiscover-email-settings)) image based of node on alpine instead of apache on debian ([![](https://images.microbadger.com/badges/image/jsmitsnl/docker-email-autodiscover.svg)](https://microbadger.com/images/jsmitsnl/docker-email-autodiscover))