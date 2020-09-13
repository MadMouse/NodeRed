module.exports = function (RED) {
    'use strict';
    const cpaas = require('@avaya/cpaas');

    /**
     * JDoc Pending.
     * @param {*} config 
     */
    function cpaasAccountNode (config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.broker = RED.nodes.getNode(config.cpaasBroker);

        node.status({
            shape: 'ring',
            fill: 'red',
            text: 'uninitialized.',
        });

        node.cpaasClient = new cpaas.AccountsConnector({
            accountSid: node.broker.sid,
            authToken: node.broker.credentials.token,
        });
        if (node.cpaasClient) {
            node.status({
                shape: 'ring',
                fill: 'green',
                text: 'initialized.',
            });
        } else {
            node.error('Unable to create sms connector!');
        }

        node.on('input', function (msg) {
            node.cpaasClient.viewAccount()
                .then(function (data) {
                    msg.payload = data;
                    node.status({
                        shape: data.status === 'active' ? 'ring' : 'dot',
                        fill: data.status === 'active' ? 'green' : 'red',
                        text: data.friendly_name,
                    });
                    node.send(msg);
                })
                .catch(function (err) {
                    node.status({
                        shape: 'ring',
                        fill: 'red',
                        text: err.message,
                    });
                    node.error(err, msg);
                });
        });
    }
    RED.nodes.registerType('cpaas/Account', cpaasAccountNode);
};
