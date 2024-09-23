# SIPS Payment SDK [![npm version](https://img.shields.io/npm/v/@worldline/sips-payment-sdk.svg)](https://www.npmjs.com/package/@worldline/sips-payment-sdk)
This package provides a Node.js implementation for SIPS, the Worldline e-payments gateway.

> :warning: This library was written for SIPS 2.0 and is not compatible with SIPS 1.0!

## Installing

This library is provided as two separate packages on NPM . To install it, simply run:
```shell
npm install sherlocks-sips-payment-sdk
```

Or if you prefer Yarn, run:
```shell
yarn add sherlocks-sips-payment-sdk
```


## Usage
> :bulb: Currently this library only supports SIPS in pay page mode.

### Initialization
First, create a client for the desired environment using your merchant ID, key version & secret key:
```js
import Sips from 'sherlocks-sips-payment-sdk';

const paypageClient = new Sips.PaypageClient(
  Sips.Environment.TEST,
  '002001000000001',
  1, // This shouldn't be hardcoded here...
  '002001000000001_KEY1'); // ...and neither should this.
```

Then set up a request to initialize a session on the SIPS server:

```js
import Sips from 'sherlocks-sips-payment-sdk';

const paymentRequest = Object.assign(new Sips.PaymentRequest(), {
    currencyCode: Sips.Currency.EUR,
    orderChannel: Sips.OrderChannel.INTERNET,
    interfaceVersion: 'IR_WS_3.4',
    automaticResponseUrl: 'AUTOMATIC_RETURN_URL',
    normalReturnUrl: 'NORMAL_RETURN_URL',
    amount: Math.round(req.body.amount * 100) // Amount in the minimal unit used in the currency
    // bypassReceiptPage: true
});
```
Add unique reference for the transaction:

If SIPS 2.0 contract : 

```js
paymentRequest.transactionReference = 'unique-transaction-ref'; // Max 35 alphanumeric characters string
```

If SIPS 1.0 contract migrated to SIPS 2.0 :

```js
paymentRequest.s10TransactionReference = {
    s10TransactionId: 'unique-transaction-ref' // Max 6 numeric characters string
}
```

And initialize your session on the server:
```js
const initializationResponse = await paypageClient.initializePayment(paymentRequest);
```

The `initializationResponse` you'll receive from the server contains all information needed to continue
handling your transaction. If you're initialization was successful, your response will contain a
`RedirectionStatusCode.TRANSACTION_INITIALIZED` (Code 00). 

### Making the payment
In case your initialization was successful, you have to use the `redirectionUrl` received to perform a POST request
with both the `redirectionData` and `seal` as parameters. Since this should redirect the customer the SIPS
payment page, the cleanest example is a simple HTML form:

```html
<form method="post" action="redirectionUrl">
    <input name="redirectionData" type="hidden" value="..." />
    <input name="seal" type="hidden" value="..." />
    <input type="submit" value="Proceed to checkout"/>
</form>
```

### Verifying the payment
When your customer is done, he will be able to return to your application. This is done
via a form, making a POST request to the `normalReturnUrl` provided during the initialization of your payment.
This POST request contains details on the payment. You can simply decode these responses, providing the parameters included in the received request to your `paypageClient`:

```js
const paypageResponse = paypageClient.decodeResponse(request.data);
```

> :warning: Since the customer is not always redirecting back (e.g. he closes the confirmation page), it's a
a good practice to include an `automaticReturnUrl`. SIPS will always POST details on the transaction on this URL,
even if a customer doesn't redirect back to your application.
