module.exports = function(RED) {
    function Anywhere365AzureOpenAIChatNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        
        // Get the config node
        this.openaiConfig = RED.nodes.getNode(config.openaiConfig);
        this.selectedSource = config.selectedSource;

        this.on('input', function(msg, send, done) {
            // Get message based on selected source
            let message;
            switch (this.selectedSource) {
                case 'msg.payload':
                    message = msg.payload;
                    break;
                case 'msg.payload.transcriptor.transcript':
                    message = msg.payload.transcriptor.transcript;
                    break;
                case 'msg.payload.message':
                    message = msg.payload.message;
                    break;
                default:
                    message = "No valid message source selected";
            }

            // Prepare request
            const requestMsg = {
                url: this.openaiConfig.url,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": this.openaiConfig.credentials.apiKey
                },
                payload: {
                    messages: [
                        {
                            role: "system",
                            content: "You are an AI assistant that helps people find information."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7,
                    top_p: 0.95,
                    n: 2,
                    stream: false,
                    max_tokens: 4096,
                    presence_penalty: 0,
                    frequency_penalty: 0
                }
            };

            // Make HTTP request
            RED.util.httpRequest(requestMsg)
                .then(function(result) {
                    msg.payload = result.body.choices[0].message.content;
                    send(msg);
                    done();
                })
                .catch(function(err) {
                    node.error(err.message, msg);
                    done(err);
                });
        });
    }

    RED.nodes.registerType("anywhere365-azure-openai-chat", Anywhere365AzureOpenAIChatNode, {
        defaults: {
            name: { value: "" },
            openaiConfig: { type: "anywhere365-azure-openai-config", required: true },
            selectedSource: { 
                value: "msg.payload",
                required: true
            }
        },
        inputs: 1,
        outputs: 1,
        icon: "assistant.png",
        label: function() {
            return this.name || "Anywhere365 Azure OpenAI Chat";
        },
        paletteLabel: "Anywhere365 Azure OpenAI Chat",
        category: "Anywhere365"
    });
}