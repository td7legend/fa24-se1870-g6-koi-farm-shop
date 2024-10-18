import emailjs from "@emailjs/browser";
export const initEmailJS = () => {
  emailjs.init({
    publicKey: "b5nNZsxlo2zNKVzi_",
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
