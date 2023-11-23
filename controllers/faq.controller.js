
const FaqModel = require('../models/faq.model')

async function addQuestion(req,res) {
    try {
        const {question, answer} = req.body
    if (!question || !answer) {
        return res.json({success: false, message: `Please provide all required fields`})
    }

    const newFaq = new FaqModel({question, answer})
    await newFaq.save()

    res.json({success: true, message: `Question added succssfully`})
    
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

async function getQuestions(req,res) {
    try {
        const questions = await FaqModel.find().select('-__v')

        if (questions.length == 0) {
            return res.json({success: false, message: `No question found`})
        }

        res.json({success: true, message: questions})
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

async function updateFaq(req,res){
    try {
        const {faqId} = req.params
        const {question, answer} = req.body

        if (!question && !answer) {
            return res.json({success: false, message: 'Please provide at least a field'})
        }
        
        if (!faqId) {
            return res.json({success: false, message: 'Please provide FAQ ID'})
        }
        
        const faq = await FaqModel.findById(faqId)
        if (!faq) {
            return res.json({success: false, message: 'Question not found'})
        }
        
        const updateDetails = {}
        if (question) {
            updateDetails.question = question
        }

        if (answer) {
            updateDetails.answer = answer
        }

        const updatedFaq = FaqModel.findByIdAndUpdate(faqId, updateDetails, {new: true})
        
        res.json({success: true, message: 'Question updated successfully'})
      
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}

async function deleteFaq(req,res){
    try {
        const {faqId} = req.params
        
        if (!faqId) {
            return res.json({success: false, message: 'Please provide FAQ ID'})
        }
        
        const faq = await FaqModel.findById(faqId)
        if (!faq) {
            return res.json({success: false, message: 'Question not found'})
        }

        const deletedFaq = FaqModel.findByIdAndDelete(faqId)
        
        res.json({success: true, message: 'Question deleted successfully'})
      
    } catch (error) {
        res.json({success: false, error: error.message})
    }
}


module.exports = {
    addQuestion,
    getQuestions,
    deleteFaq,
    updateFaq
}