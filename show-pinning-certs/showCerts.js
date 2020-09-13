const tls = require('tls');
const https = require('https');
const crypto = require('crypto');


let urlArgs = process.argv.slice(2);
console.log('Processing Url: ', urlArgs);

function sha256 (s) {
    return crypto.createHash('sha256').update(s).digest('base64');
}
const options = {
    hostname: urlArgs[0],
    port: 443,
    path: '/',
    method: 'GET',
    checkServerIdentity: function (host, cert) {
        // Make sure the certificate is issued to the host we are connected to
        const err = tls.checkServerIdentity(host, cert);
        if (err) {
            return err;
        }
        do {
            console.log('---------------------------------------------------------------------');
            console.log('Subject Common Name:', cert.subject.CN);
            console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

            hash = crypto.createHash('sha256');

            console.log('  Public key ping-sha256 :', sha256(cert.pubkey));

            console.log('  Valid From :', cert.valid_from);
            console.log('  Valid To :', cert.valid_to);

            console.log('  Subject :', cert.subject);

            console.log('');

            lastprint256 = cert.fingerprint256;
            cert = cert.issuerCertificate;


        } while (cert.fingerprint256 !== lastprint256);

    },
};

options.agent = new https.Agent(options);
const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    // Print the HPKP values
    console.log('headers:', res.headers['public-key-pins']);

    res.on('data', (d) => { });
});

req.on('error', (e) => {
    console.error(e.message);
});
req.end();