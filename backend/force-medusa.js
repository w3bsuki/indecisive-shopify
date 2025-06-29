console.log("FORCE MEDUSA DEPLOYMENT - " + new Date().toISOString());
console.log("This file forces Railway to redeploy");
console.log("Starting Medusa backend...");

// Force exit to trigger restart
setTimeout(() => {
  console.log("Exiting to force redeploy");
  process.exit(0);
}, 5000);