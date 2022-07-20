const { initializeApp, deleteApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");
const fetch = require("node-fetch");

const endpoints = [
  {
    title: "Mietwohnungen",
    url: "https://www.willhaben.at/iad/immobilien/mietwohnungen/oberoesterreich/linz",
  },
  {
    title: "Eigentumswohnungenwohnungen",
    url: "https://www.willhaben.at/iad/immobilien/eigentumswohnung/oberoesterreich/linz",
  },
  /* {
    title: "Neue Heimat",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6563419&verticalId=2",
  },
  {
    title: "GWG Linz",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=28446133&verticalId=2",
  },
  /*{
    title: "WSG",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=29720423&verticalId=2",
  },
  {
    title: "OÖ Wohnbau",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=37441909&verticalId=2",
  },
  {
    title: "Lawog",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=17103067&verticalId=2",
  },
  {
    title: "GIWOG",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6912138&verticalId=2",
  },
  {
    title: "Wohnbau 200",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6912076&verticalId=2",
  },
  {
    title: "Familie",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=37609411&verticalId=2",
  },
  {
    title: "Lebensräume",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6563410&verticalId=2",
  },
  {
    title: "BRW",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6556903&verticalId=2",
  },
  {
    title: "WAG",
    url: "https://www.willhaben.at/iad/searchagent/alert?searchId=90&alertId=6556872&verticalId=2",
  },*/
];

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

let app;
let db;

async function writeResults(result) {
  app = await initializeApp(firebaseConfig);
  db = await getDatabase(app);

  const date = new Date(Date.now());
  set(
    ref(
      db,
      `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getHours()}`
    ),
    result
  )
    .then(() => {
      console.log("Data saved successfully!", result);
    })
    .catch((error) => {
      console.log("The write failed", error);
    });
}

const handler = async function (req, res) {
  try {
    let _results = {};
    await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          const res = await fetch(
            `${process.env.URL}/.netlify/functions/willhaben-stats/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: endpoint.title,
                url: endpoint.url,
              }),
            }
          );

          const data = await res.json();
          _results[data.title] = data.description;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    ).then(async () => {
      await writeResults(_results);
      app.deleteApp();
      return {
        statusCode: 200,
      };
    });
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error,
      }),
    };
  }
};

module.exports.handler = handler;
