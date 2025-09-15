# Job Aggregator

This is a small project that aggregates job listing from various sources, such as Linkedin. It's built using TypeScript in Node.js.

The project is under active development, and is currently very basic, the goal is to make it more customizable without having to manually go in and change the code.

## Requirements

There are some requirements to run this project on your machine:

- You need an API key from RapidAPI as the project uses [LinkdAPI](https://rapidapi.com/linkdapi-linkdapi-default/api/linkdapi-best-unofficial-linkedin-api/pricing) through RapidAPI to fetch job listings. The basic plan is fine with the default configurations.
- Node.js 22+ installed on your machine.
- NPM 10+
- A gmail account to send email from, along with an App Password. See [Configuration](#configuration) for more details.

## Configuration

An example configuration setup can be found in [src/example.config.json](./src/example.config.json). You need to create your own configuration file based on this example, and name it `config.json`. The project will read from this file when running.

// TODO - Explain the config in detail...

## Environment Variables

The script is configured to work with a gmail sender out of the box, using an [App Password](https://support.google.com/accounts/answer/185833?hl=en) for authentication. The app password needs to be set using an environment variable named `GOOGLE_APP_PASSWORD`. See [exampe.env](./example.env) for reference.

The environment also expects a RapidAPI key to be set using an environment variable named `RAPIDAPI_KEY`. The project is configured to use LinkdAPI through RapidAPI to fetch job listings. This allows for up to 30 requests per month. The script was conceived as a weekly scheduled task, so I recommend setting up up to 4-5 linkedInParams objects in the config file which will be run once a week. This way you can stay within the free tier.
