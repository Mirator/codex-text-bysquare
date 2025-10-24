import "./style.css";
import QRCode from "qrcode";
import { CurrencyCode, encode, PaymentOptions } from "bysquare";

const ANIMALS = [
  "kočka",
  "pes",
  "kůň",
  "kráva",
  "ovce",
  "liška",
  "medvěd",
  "vlk",
  "sova",
  "ježek",
  "žába",
  "vydra",
  "los",
  "rys",
  "kachna",
  "husa",
  "čáp",
  "krtek",
  "zajíc",
  "srna"
];

const PAYMENT_DETAILS = {
  accountNumber: "13103019995234450010000001",
  iban: "PL13103019995234450010000001",
  bic: "CITIPLPX",
  amount: 1,
  currency: "EUR",
  variableSymbol: "1"
};

const PAYMENT_MODEL = {
  amount: PAYMENT_DETAILS.amount,
  variableSymbol: PAYMENT_DETAILS.variableSymbol,
  currencyCode: CurrencyCode.EUR,
  bankAccounts: [
    {
      iban: PAYMENT_DETAILS.iban,
      bic: PAYMENT_DETAILS.bic
    }
  ]
};

const app = document.querySelector("#app");

if (!app) {
  throw new Error("Root element #app not found");
}

app.innerHTML = `
  <div class="card">
    <header>
      <h1>PAY by Square</h1>
      <p>Generujte QR kód pro platbu pomocí standardu PAY by Square.</p>
    </header>

    <section class="payment-details">
      <dl>
        <div>
          <dt>Číslo účtu</dt>
          <dd>${PAYMENT_DETAILS.accountNumber}</dd>
        </div>
        <div>
          <dt>IBAN</dt>
          <dd>${PAYMENT_DETAILS.iban}</dd>
        </div>
        <div>
          <dt>SWIFT/BIC</dt>
          <dd>${PAYMENT_DETAILS.bic}</dd>
        </div>
        <div>
          <dt>Částka</dt>
          <dd>${PAYMENT_DETAILS.amount.toFixed(2)} ${PAYMENT_DETAILS.currency}</dd>
        </div>
        <div>
          <dt>Variabilní symbol</dt>
          <dd>${PAYMENT_DETAILS.variableSymbol}</dd>
        </div>
        <div>
          <dt>Zpráva pro příjemce</dt>
          <dd id="message">…</dd>
        </div>
      </dl>
    </section>

    <section class="controls">
      <button id="generate">Vygenerovat nový QR kód</button>
      <span class="status" id="status">Připraveno</span>
    </section>

    <canvas id="qr-canvas" width="320" height="320" role="img" aria-label="PAY by Square QR kód"></canvas>
  </div>
`;

const messageElement = document.querySelector("#message");
const statusElement = document.querySelector("#status");
const canvas = document.querySelector("#qr-canvas");
const button = document.querySelector("#generate");

if (!(messageElement instanceof HTMLElement && statusElement instanceof HTMLElement && canvas instanceof HTMLCanvasElement && button instanceof HTMLButtonElement)) {
  throw new Error("Unable to initialize application UI");
}

function pickRandomAnimal() {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}

async function generateQrCode() {
  button.disabled = true;
  statusElement.textContent = "Generuji…";

  const animal = pickRandomAnimal();
  messageElement.textContent = animal;

  const qrString = encode(
    {
      payments: [
        {
          type: PaymentOptions.PaymentOrder,
          paymentNote: animal,
          ...PAYMENT_MODEL
        }
      ]
    },
    { deburr: false }
  );

  await QRCode.toCanvas(canvas, qrString, {
    width: 320,
    margin: 1,
    color: {
      dark: "#0f172aff",
      light: "#ffffffff"
    }
  });

  statusElement.textContent = `Poslední aktualizace: ${new Intl.DateTimeFormat("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date())}`;
  button.disabled = false;
}

button.addEventListener("click", () => {
  generateQrCode().catch((error) => {
    console.error(error);
    statusElement.textContent = "Nastala chyba při generování kódu";
    button.disabled = false;
  });
});

generateQrCode().catch((error) => {
  console.error(error);
  statusElement.textContent = "Nastala chyba při generování kódu";
  button.disabled = false;
});
