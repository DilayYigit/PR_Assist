# PR Assist

PR Assist acts like a virtual assistant for managing code contributions on GitHub. It enhances developer experience by:

- Suggesting potential reviewers for their code.
- Providing smart recommendations for the title and description of their pull requests.
- Streamlining the process of submitting and reviewing code changes, thus fostering better collaboration among development teams.

## Setup
1. To run our but, you may choose to install it by cloning the code:    
    1. Clone the repository and navigate to the root directory in your terminal.
    2. Run the following commands:
    ```
    npm install
    npm start
    ```
    
    3. Open your web browser and go to `http://localhost:3000`.
2. Alternatively, you can go to this link directly:
    1. Go to `https://cs453.azurewebsites.net/probot`
       
3. Click on **Register GitHub App**, enter a name for your app, and click **Create**.
4. Decide on which account you want to install this app and proceed to installation.
5. Choose the repositories the bot should have access to and install the app.
6. You'll be redirected to your app's page. Navigate to **app settings -> Permissions & events -> Repository permissions**.

### Configuring Permissions

Ensure the following permissions are set:
- **Issues**: read and write
- **Pull requests**: read and write

In the same settings page, find the **Subscribe to events** section:
- Ensure the relevant events are selected and save your changes:
  - Issue comment
  - Issues
  - Pull request

### Final Steps

1. Go to **settings -> Applications -> {your_app}**.
2. Accept the permission requests prompted by the app.
3. Terminate the npm process in your terminal and restart it:

```
npm start
```

Your bot is now ready for use.

## Generate Title and Description Suggestion

When you create a new pull request, PR Assist will display title and description suggestions. Here's how to use them:

- If you agree with the suggestions, comment **Update** on your pull request, and the bot will automatically update it for you.
- If you prefer to modify some suggestions, you can manually edit your pull request using the suggestions as a guide.

## License

ISC License

Copyright (c) 2024, DilayYigit

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
