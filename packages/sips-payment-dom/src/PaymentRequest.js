import INTERFACE_VERSION from './config';

export default class PaymentRequest {
  interfaceVersion = INTERFACE_VERSION;

  paymentMeanBrandList;

  amount;

  automaticResponseUrl;

  billingAddress;

  billingContact;

  captureDay;

  captureMode;

  currencyCode;

  customerAddress;

  customerContact;

  customerId;

  customerLanguage;

  deliveryAddress;

  deliveryContact;

  holderAddress;

  holderContact;

  keyVersion;

  merchantId;

  merchantWalletId;

  normalReturnUrl;

  orderChannel;

  orderId;

  transactionReference;

  seal;

  statementReference;

  templateName;

  paypageData;
}
