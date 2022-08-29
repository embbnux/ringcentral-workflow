# RingCentral Workflow

A app to config workflow with RingCentral Events and APIs.

![Workflow Demo](https://user-images.githubusercontent.com/7036536/186582927-a6b72345-782f-4c38-8d49-1aced509eeed.png)

## Support Triggers

- [x] New SMS Event
- [x] New Team Message Event
- [ ] Call Event
- [ ] Call Missed Event
- [ ] Call Ended Event

## Support Actions

- [x] Send SMS
- [x] Send Team Messaging
- [x] Send Webhook
- [ ] Create Ring Out Call
- [ ] API to Third party platform

## TODO

- [ ] Run the workflow based on Message Queue

## Development

1. Clone the project
   
```shell
$ git clone https://github.com/embbnux/ringcentral-workflow.git
```

2. Create HTTP tunnel to your local port 3000

You can use `ngrok`, or [lite-http-tunnel](https://github.com/web-tunnel/lite-http-tunnel) to deploy a HTTP tunnel.

You should get a domain to your local port, we will use it as `APP_SERVER` in `.env` later.

3. Create a RingCentral app

Please follow [here](https://developers.ringcentral.com/guide/basics/create-app) to create a RingCentral REST API app. 

* OAuth: 3-legged OAuth flow, server side. Enable refresh token
* OAuth redirect: `${your_http_tunnel_domain}/oauth/callback`
* App permissions: `Read Messages`, `Call Control`, `Faxes`, `Read Presence`, `Meeting`, `Read Call Recording`, `Read Contacts`, `Contacts`, `Read Account`, `Ring Out`, `SMS`, `Team Messaging`, `Internal Messages`, `Read Call Log`, `Webhook Subscriptions`, `Edit Messages`, `Edit Presence`

4. Setup `.env` file

```
$ cp .env.default .env
```

Update .env file with data that your get in above steps.

5. Install dependencies

```
$ yarn
```

6. Start webpack server

```
$ yarn webpack-server
```

7. Start app

In other Terminal:

```
$ yarn start
```

8. Test in Browser

Visit your HTTP tunnel domain in browser to run the app.
