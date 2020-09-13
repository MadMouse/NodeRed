module.exports = function (RED) {
    /**
     *
     *
     * @param {*} config
     */
    function smsSwitch (config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.on('input', function (msg) {
            msg.topic = msg.payload.sid;
            console.log(msg);
            node.send(msg);
        });
    }
    RED.nodes.registerType('smsSwitch', smsSwitch);
};

