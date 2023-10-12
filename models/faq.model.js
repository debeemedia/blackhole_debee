const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    },
    question: { 
        type: String, 
        required: true 
    },
    answer: { 
        type: String 
    }
  });
  
  const FaqModel = mongoose.model('faq', faqSchema);
 
  module.exports = FaqModel