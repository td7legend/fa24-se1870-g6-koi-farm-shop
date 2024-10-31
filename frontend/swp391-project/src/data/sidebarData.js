export const defaultSidebarData = {
  contactInfo: {
    phone: "123-456-7890",
    email: "contact@goldenkoi.com",
    address: "123 Koi Street, District 1, Ho Chi Minh City",
    social: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  quickContact: {
    onSubmit: (e) => {
      e.preventDefault();
      console.log("Form submitted");
    },
  },
};
