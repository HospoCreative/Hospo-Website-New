# Digital business cards

The public card URLs are permanent:

- `https://hospocreative.com/tiago`
- `https://hospocreative.com/andreia`

Their profile data is held in `data/digitalBusinessCards.ts`. Edit that single file to change an image, title, contact method, social link, or portfolio image. An action is hidden automatically when its corresponding value is removed. Contact files and QR images are generated in the visitor's browser, so the feature does not add Vercel Serverless Functions or store generated QR files.

## NFC setup

Use an NFC tag that supports an NDEF URL record (for example, NTAG213 or NTAG215). In an NFC-writing app on iPhone or Android:

1. Choose **URL / Website** as the record type.
2. Enter the full, secure URL for the right card, such as `https://hospocreative.com/tiago`.
3. Write the record to the tag and lock it only after testing.
4. Test using an iPhone and an Android device. The tag should open the browser directly on the card page.

Do not write a redirect, short link, password, Wi-Fi password, or private contact data to the tag. The permanent HTTPS URL is enough and can be maintained by the website.

## Wallet passes

No Wallet button has been added. A real Apple Wallet pass requires a [pass type identifier and signing certificate](https://developer.apple.com/help/account/capabilities/create-wallet-identifiers-and-certificates/) plus an active Apple Developer Program membership (currently [USD 99 per year](https://developer.apple.com/help/account/membership/program-enrollment/), subject to local pricing). Google Wallet requires a [Google Wallet API Issuer account](https://developers.google.com/wallet/generic/getting-started/issuer-onboarding), API authentication and publishing approval before passes can be issued publicly. Both should be assessed before a pass is offered, so that the card never contains a non-working Wallet control.
