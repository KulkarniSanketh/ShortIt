const Contact = require("../models/contact");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function createContact(req, res) {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
  const message = typeof req.body.message === "string" ? req.body.message.trim() : "";

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "name, email, and message are required",
    });
  }

  if (name.length > 80 || email.length > 120 || message.length > 2000) {
    return res.status(400).json({
      success: false,
      error: "One or more fields exceed the allowed length",
    });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ success: false, error: "Please provide a valid email address" });
  }

  const contact = await Contact.create({ name, email, message });

  return res.status(201).json({
    success: true,
    data: {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      createdAt: contact.createdAt,
    },
    message: "Thanks for reaching out. We will get back to you soon.",
  });
}

module.exports = {
  createContact,
};
