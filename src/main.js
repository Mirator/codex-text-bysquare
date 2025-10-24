import "./style.css";
import QRCode from "qrcode";
import { CurrencyCode, encode, PaymentOptions } from "bysquare";
import { Buffer } from "buffer";

if (!globalThis.Buffer) {
  globalThis.Buffer = Buffer;
}

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

const PAYMENT_TEMPLATE = {
  amount: 1,
  variableSymbol: "1",
  currencyCode: CurrencyCode.EUR,
  bankAccounts: [
    {
      iban: "PL13103019995234450010000001",
      bic: "CITIPLPX",
      accountNumber: "13103019995234450010000001"
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
          <dd>${PAYMENT_TEMPLATE.bankAccounts[0].accountNumber}</dd>
        </div>
        <div>
          <dt>IBAN</dt>
          <dd>${PAYMENT_TEMPLATE.bankAccounts[0].iban}</dd>
        </div>
        <div>
          <dt>SWIFT/BIC</dt>
          <dd>${PAYMENT_TEMPLATE.bankAccounts[0].bic}</dd>
        </div>
        <div>
          <dt>Částka</dt>
          <dd>${PAYMENT_TEMPLATE.amount.toFixed(2)} EUR</dd>
        </div>
        <div>
          <dt>Variabilní symbol</dt>
          <dd>${PAYMENT_TEMPLATE.variableSymbol}</dd>
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

    <section class="history" aria-live="polite">
      <h2>Historie generovaných zpráv</h2>
      <p class="history-description">
        Sledujte, jaké zprávy byly použity při vytváření jednotlivých QR kódů.
      </p>
      <table id="history-table" class="history-table" hidden>
        <thead>
          <tr>
            <th scope="col">Zpráva pro příjemce</th>
            <th scope="col">Čas vygenerování</th>
          </tr>
        </thead>
        <tbody id="history-body"></tbody>
      </table>
      <p id="history-empty" class="history-empty">QR kód zatím nebyl vygenerován.</p>
    </section>
  </div>
`;

const messageElement = document.querySelector("#message");
const statusElement = document.querySelector("#status");
const canvas = document.querySelector("#qr-canvas");
const button = document.querySelector("#generate");
const historyTable = document.querySelector("#history-table");
const historyTableBody = document.querySelector("#history-body");
const historyEmptyState = document.querySelector("#history-empty");

if (
  !(
    messageElement instanceof HTMLElement &&
    statusElement instanceof HTMLElement &&
    canvas instanceof HTMLCanvasElement &&
    button instanceof HTMLButtonElement &&
    historyTable instanceof HTMLElement &&
    historyTableBody instanceof HTMLElement &&
    historyEmptyState instanceof HTMLElement
  )
) {
  throw new Error("Unable to initialize application UI");
}

function pickRandomAnimal() {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}

const timeFormatter = new Intl.DateTimeFormat("cs-CZ", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});

const historyEntries = [];

function formatTimestamp(date) {
  return timeFormatter.format(date);
}

function renderHistory() {
  historyTableBody.innerHTML = "";

  if (historyEntries.length === 0) {
    historyTable.hidden = true;
    historyEmptyState.hidden = false;
    return;
  }

  historyTable.hidden = false;
  historyEmptyState.hidden = true;

  for (const entry of historyEntries) {
    const row = document.createElement("tr");
    const messageCell = document.createElement("td");
    messageCell.textContent = entry.message;

    const timeCell = document.createElement("td");
    const timeElement = document.createElement("time");
    timeElement.dateTime = entry.timestamp.toISOString();
    timeElement.textContent = formatTimestamp(entry.timestamp);
    timeCell.append(timeElement);

    row.append(messageCell, timeCell);
    historyTableBody.append(row);
  }
}

function addHistoryEntry(message, timestamp) {
  historyEntries.unshift({ message, timestamp });

  if (historyEntries.length > 10) {
    historyEntries.pop();
  }

  renderHistory();
}

renderHistory();

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
          ...PAYMENT_TEMPLATE
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

  const generatedAt = new Date();
  statusElement.textContent = `Poslední aktualizace: ${formatTimestamp(generatedAt)}`;
  addHistoryEntry(animal, generatedAt);
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
