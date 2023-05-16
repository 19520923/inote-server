import { Configuration, OpenAIApi } from "openai";
import { openai } from "../../config";

const configuration = new Configuration({
  apiKey: openai,
});

const openaiAPI = new OpenAIApi(configuration);

export const getAnswer = (content) =>
  openaiAPI
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: content }],
    })
    .then((res) => res.data.choices[0].message.content)
    .catch((e) => {
      console.log(e);
    });
