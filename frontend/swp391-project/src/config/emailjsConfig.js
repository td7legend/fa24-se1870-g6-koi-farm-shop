import emailjs from "@emailjs/browser";
export const initEmailJS = () => {
  emailjs.init({
    publicKey: "6qSihg-gFvCTpw5Be",
    blockHeadless: true,
    blockList: {
      list: ["foo@emailjs.com", "bar@emailjs.com"],
      watchVariable: "userEmail",
    },
    limitRate: {
      id: "app",
      throttle: 10000,
    },
  });
};
