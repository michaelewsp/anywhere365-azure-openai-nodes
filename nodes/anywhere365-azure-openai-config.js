module.exports = function(RED) {
    function Anywhere365AzureOpenAIConfigNode(config) {
        RED.nodes.createNode(this, config);
        this.url = config.url;
        this.apiKey = config.apiKey;
    }

    RED.nodes.registerType("anywhere365-azure-openai-config", Anywhere365AzureOpenAIConfigNode, {
        credentials: {
            apiKey: { type: "password" }
        },
        defaults: {
            url: { type: "text", required: true }
        }
    });
}
