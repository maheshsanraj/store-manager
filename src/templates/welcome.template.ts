export const welcomeTemplate = (name: string, phone: string, pin: string) => {
  return `
    <h2>Welcome ${name}</h2>
    <p>Your account is created.</p>
    <p><b>Mobile:</b> ${phone}</p>
    <p><b>PIN:</b> ${pin}</p>
  `;
};