# Eve

Eve is a demo blog template made for [Ekto](https://github.com/bnhansn/ekto) that runs
a Node server to perform server side rendering of the React app.

Check out the companion theme [Ava](https://github.com/bnhansn/ava) if you are not
interested in server side rendering.

## Getting Started

Create an account at [https://ekto.tech](https://ekto.tech).

Make a note of the API key on your Ekto account settings page.

Clone the repository.

```
git clone https://github.com/bnhansn/eve.git
cd eve
```

Create a `.env` file in the project root and add your Ekto API key.

```
touch .env
echo "EKTO_KEY=<your api key>" >> .env
```

Install project dependencies.

```
npm install
```

Start the application.

```
npm run dev
```

## Deploying to Heroku

Sign up for a [Heroku](https://heroku.com) account and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line).

In your project directory, create a new Heroku app.

```
heroku create
```

Add your Ekto API key as an environment variable.

```
heroku config:set EKTO_KEY=<your api key>
```

Deploy to Heroku.

```
git push heroku master
```

View your newly deployed site.

```
heroku open
```

## License

MIT
