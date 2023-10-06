// Define the FAQ model
const faqSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    question: { type: String, required: true },
    answer: { type: String }
  });
  
  // Create the FAQ model
  const Faq = mongoose.model('Faq', faqSchema);
  
  // Example data
  const faq1 = new Faq({
    userId: '60973645e8267864b4d',
    question: 'What is the meaning of life?',
    answer: 'The meaning of life is to find your purpose and pursue it with passion.'
  });
  
  const faq2 = new Faq({
    userId: '60973645e64b43898ed',
    question: 'How do I find my purpose in life?',
    answer: 'To find your purpose in life, you must first understand what you are passionate about and what you value most. Then, explore different career paths and opportunities that align with those passions and values. Finally, take action towards achieving your goals and reflect on your experiences to discover what truly fulfills you.'
  });
  
  // Save the FAQ documents
  faq1.save((err) => {
    if (err) console.error(err);
    console.log('FAQ saved successfully');
  });
  
  faq2.save((err) => {
    if (err) console.error(err);
    console.log('FAQ saved successfully');
  });