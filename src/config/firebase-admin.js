const admin = require('firebase-admin');

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        if (!admin.apps.length) {
            admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        }
    } catch (err) {
        console.warn('⚠️  Firebase init failed:', err.message);
        console.warn('   Auth endpoints will not work without valid Firebase credentials.');
    }
} else {
    console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT not set. Running without Firebase auth.');
}

module.exports = admin;
